#!/usr/bin/env node
const path=require('path');
const fs = require('fs');
const Parser=require('markdown-parser');
const fetch=require('node-fetch');
const parser= new Parser();
const answerBoth=(arr)=>{
    let fails = 0
    let arrlink=arr.map((obj)=>obj.href);
    const uniques=Array.from(new Set(arrlink));
    return validateStatus(arrlink).then(arrayObj => {
        const obj={
            total:arrlink.length,
            unique:uniques.length
        }
        arrayObj.forEach(el => {
            if (el.status === 200) {
            } else { 
                fails++
            }
        })
        obj.broken=fails;
        return obj;
    }).catch(er=>('er'))
}
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
                obj.status=200;
                return obj
            } else {
                obj.statusText='FAIL';
                obj.status=400;
               return obj
            }
        }).catch(e => {
            if (e){
               obj.statusText='FAIL';
               obj.status=400;
               return obj
            }
        })
    }))
}
const answerValidate=(arr)=>{
    let arrlink=arr.map((obj)=>obj.href);
   return validateStatus(arrlink).then(arrayObj =>{ return arrayObj});
}
const getlinksDir=(filemd,arrResult)=>new Promise((resolve,reject)=>{
    let arrObj=filemd.forEach((md)=>{
        const content=fs.readFileSync(md);
        let string= content.toString();
        let arrlink=parser.parse(string, (err, result)=> {
            let all=result.references;
            let resut=all.map((obj)=>{
                arrResult.push({
                   href:obj.href,
                   text:obj.title,
               })
            })
            resolve(arrResult)
        })
    })
})
const readFile =(filemd)=>new Promise((resolve,reject)=>{
    if(Array.isArray(filemd)){
       let arrlinks=[];
       let arrResult=[]
        getlinksDir(filemd,arrResult)
        .then(res=>{
           resolve(res)
        })
        .catch(e=>'er')
    }else{
        let arrResult=[];
       const content=fs.readFileSync(filemd);
       let string= content.toString();
       let arrlink=parser.parse(string, (err, result)=> {
           let all=result.references;
           all.forEach((obj)=>{
               arrResult.push({
                   href:obj.href,
                   text:obj.title,
                   file:filemd
               })
            })
         resolve(arrResult);
        })
    }
});
const readDir = (dir,arrFile)=>{
    let  files = fs.readdirSync(dir);
   files.forEach((file)=>{
       const ext=path.extname(file);
       if (fs.statSync(path.resolve(dir, file)).isDirectory()) {
        readDir(path.resolve(dir, file), arrFile);
        }
        else if(ext==='.md'){
           arrFile.push(path.resolve(dir, file));
        }
    });
};
const fileorDir=(change)=>{
    let arr=[];
    const stat=fs.lstatSync(change);
    if(stat.isDirectory()){
        readDir(change,arr)
       return arr
    }else if(stat.isFile()){
        const ext=path.extname(change);
        if(ext==='.md'){
          return change;
        }
    }
}
const mdlinks=(insertPath,options)=>new Promise((resolve,reject)=>{
    const change= path.resolve(insertPath);
    const chan= fileorDir(change);
    readFile(chan)
    .then((arrObj)=>{
        if(options.stats&& !options.validate){
            const answer=answerStats(arrObj);
            resolve(answer);
        }else if(options.validate&& !options.stats){
            answerValidate(arrObj).then(res => {
                resolve(res)
            })
        }else if(options.validate&&options.stats){
            answerBoth(arrObj).then(res=>{
                resolve(res);
            });
        }else{
            resolve(arrObj);
        }
    })
    .catch(e=>(e.code))
})
module.exports=mdlinks;