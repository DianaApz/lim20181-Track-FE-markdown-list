#!/usr/bin/env node
const [,, ...args] = process.argv;
const mdlinks=require('./cli.js')
let options={
    validate:false,
    stats:false
}


if(args[0]&&args[1]!=='--validate'&&args[1]!=='--stats'&&args[2]!=='--validate'&&args[2]!=='--stats'){
    mdlinks(args[0],options)
    .then(res=>{
        let answer=res.forEach(obj=>{
            console.log(`${args[0]}  ${obj.href}   ${obj.text}`);
        })
    }).catch(error=>error.code)
} else if(args[1] === '--validate' && args[2]!=='--stats'){
    options.validate=true;
    mdlinks(args[0],options)
    .then(res=>{
        let answer=res.forEach(obj=>{
            console.log(`${args[0]} ${obj.href} ${obj.statusText} ${obj.status}`);
        })
    }).catch(error=>{})
}else if(args[1]==='--stats'&& args[2]!=='--validate'){
    options.stats=true;
    mdlinks(args[0],options)
    .then(res=>{
        console.log(`Total: ${res.total} Unique: ${res.unique}`)
    }).catch(error=>{})
}else if(args[1]==='--validate'&&args[2]==='--stats'||args[1]==='--stats'&&args[2]==='--validate'){
    options.stats=true;
    options.validate=true;
    mdlinks(args[0],options)
    .then(res=>{
        console.log(`Total: ${res.total} Unique: ${res.unique} Broken: ${res.broken}`)
    }).catch(error=>{})
}