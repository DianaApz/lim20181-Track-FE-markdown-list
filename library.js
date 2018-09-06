#!/usr/bin/env node
const [,, ...args] = process.argv;
const fetch=require('node-fetch');

let options={
    validate:false,
    stats:false
}

const path=require('path');
const fs = require('fs');
const util = require('util');
const Parser=require('markdown-parser');
const parser= new Parser();

const changeAbs=(insertPath)=>{
    if(path.isAbsolute(insertPath)){
        return insertPath;
    } else {
        const pathAbs= path.resolve(insertPath);
        return pathAbs
    }
}
const readDir = (dir,arrFile)=>{
    let  files = fs.readdirSync(dir);
    arrFile = arrFile || [];
   files.forEach((file)=>{
       const ext=path.extname(file);
       if (fs.statSync(path.resolve(dir, file)).isDirectory()) {
           arrFile = readDir(path.resolve(dir, file), arrFile);
        }
        else if(ext==='.md'){
           arrFile.push(path.resolve(dir, file));
        }
   });
   console.log(arrFile)
  return arrFile;
};
const readFile =(filemd,ar)=>new Promise((resolve,reject)=>{
    ar=ar || [];
    const read=util.promisify(fs.readFile);
    read(filemd).then(content=>{
        let string= content.toString();
        let arrlink=parser.parse(string, (err, result)=> {
            // console.log(result.references)
            let all=result.references;
            all.forEach((obj)=>{
               ar.push({
                  href:obj.href,
                  text:obj.title,
                  file:filemd
                })
            })
            resolve(ar);
        })
    })
});
const answerStats=(arrObj)=>{
    const arrlink=arrObj.map((obj)=>obj.href);
    const uniques=Array.from(new Set(arrlink));
    
    
    const obj={
        total:arrlink.length,
        unique:uniques.length
    }
    return obj;
}
const validateStatus=(arrlink)=>{
    return Promise.all(arrlink.map(link=>{
        const obj= {
            href:link,
        }
        return fetch(link)
        .then(response => {
            if(response.status >= 200 && response.status < 300){
                obj.statusText = 'OK';
                return obj
            } else {
                obj.statusText='FAIL';
               return obj
            }
        }).catch(e => {
            console.log("message", e.message)
            if (e){
               obj.statusText='FAIL';
               return obj
            }
        })
        
       
    }))
}

const answerValidate=(arr)=>{
    
    let arrlink=arr.map((obj)=>obj.href);
   return validateStatus(arrlink).then(arrayObj =>{ return arrayObj});
    // return answer;
}
const answerBoth=(arr)=>{
    let fails = 0
    let ok = 0
    let arrlink=arr.map((obj)=>obj.href);
    const uniques=Array.from(new Set(arrlink));
    validateStatus(arrlink).then(arrayObj => {
        console.log(arrayObj)
        arrayObj.forEach(el => {
            if (el.status == 200) {
                ok++
                // ok = ok + 1
            } else { 
                fails++
            }
        })
    }).catch(er=>('er'))
    
    return fails;
    
}
const mdlinks=(insertPath,options)=>new Promise((resolve,reject)=>{
    const change= changeAbs(insertPath);
    const stat=util.promisify(fs.lstat);
    stat(change)
    .then(stats=>{
        if(stats.isDirectory()){
            console.log('es car');
            const answer=readDir(change);
             answer.forEach(ele=>{
                readFile(ele)
                .then((arrObj)=>{
                    if(options.stats){
                        const answer=answerStats(arrObj);
                        resolve(answer);
                    }else if(options.validate){
                        const answer=answerValidate(arrObj);
                        setTimeout(()=>{
                            resolve(answer);
                        },5000);
                
                    }else if(options.validate&&options.stats){
                        const answer=answerBoth(arrObj);
                        resolve(answer);
                    }else{
                        resolve(arrObj);
                        
                    }
                });
            })
        } else if(stats.isFile()){
            const ext=path.extname(change);
            if(ext==='.md'){
                console.log('es file');
                readFile(change)
                .then((arrObj)=>{
                    if(options.stats&& !options.validate){
                        const answer=answerStats(arrObj);
                        resolve(answer);
                    }else if(options.validate&& !options.stats){
                        const answer=answerValidate(arrObj).then(res => {
                            console.log("hopjo", res)
                        })
                        
                    }else if(options.validate&&options.stats){
                        
                        let answered=answerBoth(arrObj);
                        // resolve(answered);
                        
                        
                        
                    }else{
                        resolve(arrObj);
                    }
                
                });
            }
        }
    })
    .catch((error) => {
        console.log('errqr');
    });
})

if(args[1] === '--validate' && args[2]!=='--stats'){
    options.validate=true;
}else if(args[1]==='--stats'&& args[2]!=='--validate'){
    options.stats=true;
}else if(args[1]==='--validate'&&args[2]==='--stats'||args[1]==='--stats'&&args[2]==='--validate'){
    options.stats=true;
    options.validate=true;
}
mdlinks(args[0],options)
.then(res=>{
    console.log(res)
})
.catch(error=>{})
