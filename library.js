#!/usr/bin/env node
//get files()
const [,, ...args] = process.argv;
const path=require('path');
const fs=require('fs')
// let dir=process.cwd();


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
const fileOrDir=(insertPath)=>{
    const change= changeAbs(insertPath);
    fs.lstat(change, (err, stats) =>{
        if (err) {
            throw("Error");
        } else if(stats.isDirectory()){
            console.log('es carpeta')
            // const answer=readDir(change);
        } else if(stats.isFile()){
           const ext=path.extname(change);
            // if(ext==='.md'){
                console.log('es archivo')
            //   readFile(change);
            // }
        }
   });
}


let answer=fileOrDir(args[0]);
// console.log(answer);