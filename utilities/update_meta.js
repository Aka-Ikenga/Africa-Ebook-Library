const fs = require("fs")
const path = require('path')


const fpath = process.argv[2]
const update = process.argv[3]


async function updateMeta(fpath, update) {
    let upd = fs.readFileSync(update)
    upd = JSON.parse(upd)
    let dirs = await fs.promises.opendir(fpath)
    for await (let dir of dirs){
        let sub_dirs = await fs.promises.opendir(path.join(fpath, dir.name))
        for await (let file of sub_dirs){
            if(!(file.name.includes('json'))){continue}
            let fo = await fs.promises.readFile(path.join(fpath, dir.name ,file.name))
            let obj = JSON.parse(fo)
            obj = {...obj, ...upd}
            obj = JSON.stringify(obj)
            await fs.promises.writeFile(path.join(fpath, dir.name ,file.name), obj)
        }
    }

}


updateMeta(fpath, update)
