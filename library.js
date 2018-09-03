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
    const uniques=arrlink.filter((el,index,array)=>array.indexOf(el) === index);
    const obj={
        total:arrlink.length,
        unique:uniques.length
    }
    return obj;
}
const validateStatus=(arrlink)=>{
    const arrPromise=arrlink.map(link=>{
        return fetch(link);
    })
    
    return Promise.all(arrPromise)
    .then((res)=>{
        const arrObjs=res.map((objRes)=>{
            if(objRes.status === 200){
                const obj={
                    href:objRes.url,
                    status:objRes.status,
                    statusText:objRes.statusText
                }
                return obj
            }else{
                const obj={
                    href:objRes.url,
                    status:objRes.status,
                    statusText:'FAIL'
                }
                return obj
            }
        })
        return arrObjs
    })
}
const answerValidate=(arrObj)=>{
    let arrlink=arrObj.map((obj)=>obj.href);
    let answer=validateStatus(arrlink);
    return answer;
}
const answerBoth=(arrObj,validateLink)=>{
    const arrlink=arrObj.map((obj)=>obj.href);
    const uniques=arrlink.filter((el,index,array)=>array.indexOf(el) === index);
    const obj={
        total:arrlink.length,
        unique:uniques.length,
        broken:'falta'
    }
    return obj;
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
                    if(options.validate===false&&options.stats===false){
                        
                        resolve(arrObj);
                        
                        
                    }else if(options.validate===false&&options.stats===true){
                        const answer=answerStats(arrObj);
                        resolve(answer);
                    }else if(options.validate===true&&options.stats===false){
                        const answer=answerValidate(arrObj);
                        setTimeout(()=>{
                            resolve(answer);
                        },5000);
                
                    }else if(options.validate===true&&options.stats===true){
                        const answer=answerBoth(arrObj);
                        resolve(answer);
                    }
                });
            })
        } else if(stats.isFile()){
            const ext=path.extname(change);
            if(ext==='.md'){
                console.log('es file');
                readFile(change)
                .then((arrObj)=>{
                    if(options.validate===false&&options.stats===false){
                        resolve(arrObj);
                    }else if(options.validate===false&&options.stats===true){
                        const answer=answerStats(arrObj);
                        resolve(answer);
                    }else if(options.validate===true&&options.stats===false){
                        const answer=answerValidate(arrObj);
                        setTimeout(()=>{
                            resolve(answer);
                        },5000);
                    }else if(options.validate===true&&options.stats===true){
                        const answer=answerBoth(arrObj);
                        resolve(answer);
                    }
                });
            }
        }
    })
    .catch((error) => {
        console.log('errr');
    });
})

if(args[0] !== '' && args[1] !== '--validate' && args[1] !== '--stats'){
    mdlinks(args[0],options)
    .then(res=>{
        setTimeout(()=>{
            console.log(res);
        },5000);
    })
    .catch(error=>{
        console.log('err')
    });
}
if(args[1] === '--validate' && args[2] !== '--stats'){
    options.validate=true;
    mdlinks(args[0],options)
    .then(res=>{
        console.log(res)
    }).catch(error=>{
        console.log('err')
    });
}else if(args[1]==='--stats'&&args[2]!=='--validate'){
    options.stats=true;
    mdlinks(args[0],options)
    .then(res=>{
        console.log(res)
    })
    .catch(error=>{console.log('err')});
}else if(args[1]==='--validate'&&args[2]==='--stats' || args[1]==='--stats'&&args[2]==='--validate'){
    options.stats=true;
    options.validate=true;
    mdlinks(args[0],options)
    .then(res=>{
        console.log(res)
    })
    .catch(error=>{
        console.log('err')
    });
}