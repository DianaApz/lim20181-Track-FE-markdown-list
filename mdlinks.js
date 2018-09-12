#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const myMarked = require('marked');
const renderer = new myMarked.Renderer();
const fetch = require('node-fetch');

const answerBoth = (arr) => {
    let fails = 0
    let arrlink = arr.map((obj) => obj.href);
    const uniques = Array.from(new Set(arrlink));
    return validateStatus(arrlink).then(arrayObj => {
        const obj = {
            total: arrlink.length,
            unique: uniques.length
        }
        arrayObj.forEach(el => {
            if (el.status === 200) {
            } else {
                fails++
            }
        })
        obj.broken = fails;
        return obj;
    }).catch(er => ('er'))
}
const answerStats = (arrObj) => {
    const arrlink = arrObj.map((obj) => obj.href);
    const uniques = Array.from(new Set(arrlink));
    const obj = {
        total: arrlink.length,
        unique: uniques.length
    }
    return obj;
}
const validateStatus = (arrlink) => {
    return Promise.all(arrlink.map(link => {
        const obj = {
            href: link,
        }
        return fetch(link)
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    obj.statusText = 'OK';
                    obj.status = 200;
                    return obj
                } else {
                    obj.statusText = 'FAIL';
                    obj.status = 400;
                    return obj
                }
            }).catch(e => {
                if (e) {
                    obj.statusText = 'FAIL';
                    obj.status = 400;
                    return obj
                }
            })
    }))
}
const answerValidate = (arr) => {
    let arrlink = arr.map((obj) => obj.href);
    return validateStatus(arrlink).then(arrayObj => { return arrayObj });
}
const getlinksDir = (filemd, arrResult) => new Promise((resolve, reject) => {
    let arrObj = filemd.forEach((md) => {
        const content = fs.readFileSync(md);
        let string = content.toString();
        renderer.link = function (href, title, text) {
            arrResult.push({
                href: href,
                text: text,
            });
        };
        myMarked(string, { renderer: renderer })
        resolve(arrResult);
    })
})
const readFile = (filemd) => new Promise((resolve, reject) => {
    if (Array.isArray(filemd)) {
        let arrResult = []
        getlinksDir(filemd, arrResult)
            .then(res => {
                resolve(res)
            })
            .catch(e => 'er')
    } else {
        let arrResult = [];
        const content = fs.readFileSync(filemd);
        let string = content.toString();
        renderer.link = function (href, title, text) {
            arrResult.push({
                href: href,
                text: text,
                file: filemd
            });
        };
        myMarked(string, { renderer: renderer })
        resolve(arrResult);
    }
});
const readDir = (dir, arrFile) => {
    let files = fs.readdirSync(dir);
    files.forEach((file) => {
        const ext = path.extname(file);
        if (fs.statSync(path.resolve(dir, file)).isDirectory()) {
            readDir(path.resolve(dir, file), arrFile);
        }
        else if (ext === '.md') {
            arrFile.push(path.resolve(dir, file));
        }
    });
};
const fileorDir = (identifyPath) => {
    let arr = [];
    const stat = fs.lstatSync(identifyPath);
    if (stat.isDirectory()) {
        readDir(identifyPath, arr)
        return arr
    } else if (stat.isFile()) {
        const ext = path.extname(identifyPath);
        if (ext === '.md') {
            return identifyPath;
        }
    }
}
const mdlinks = (insertPath, options) => new Promise((resolve, reject) => {
    const currentPath = path.resolve(insertPath);
    const identifyPath= fileorDir(currentPath);
    readFile(identifyPath)
        .then((arrObj) => {
            if (options.stats && !options.validate) {
                const answer = answerStats(arrObj);
                resolve(answer);
            } else if (options.validate && !options.stats) {
                answerValidate(arrObj).then(res => {
                    resolve(res);

                })
            } else if (options.validate && options.stats) {
                answerBoth(arrObj).then(res => {
                    resolve(res);
                });
            } else {
                resolve(arrObj);
            }
        })
        .catch(e => (e.message))
})
module.exports = mdlinks;