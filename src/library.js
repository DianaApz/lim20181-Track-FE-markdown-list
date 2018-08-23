#! / usr / bin / env node
//get files()
const [,,...args]=process.argv;
console.log(args);


const changeAbs=(insertPath)=>{
    if(path.isAbsolute(insertPath)){
        return insertPath;
    } else {
        const pathAbs= path.resolve(insertPath);
        return pathAbs
    }
}
changeAbs('../README.md');