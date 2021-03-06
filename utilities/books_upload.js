const Book = require("../models/Books")
const Author = require("../models/Authors")
const {bucketUpload} = require("./bucket_upload")
const fs = require("fs")
const path = require('path')
const connectDB = require('../config/db')
const dotenv  = require('dotenv');


dotenv.config({path:'./config/config.env'});
let conn = connectDB()

let dir = process.argv[2]

async function booksUpload(dir) {
    try{
        let files = await fs.promises.readdir(dir)
        for await (let i of files){
            let contents = await fs.promises.readdir(path.join(dir, i))
            let obj = {}
            for await (let j of contents){
                if(j.includes('json')){
                    let meta = path.join(dir, i, j)
                    let fo = fs.readFileSync(meta)
                    obj = {...obj, ...JSON.parse(fo)}
                    let authors = obj.authors.map(async name => {
                        let author = await Author.findOneAndUpdate({name: name}, {name: name}, {upsert: true})
                        return author._id
                    })
                    obj.authors = await Promise.all(authors)
                }
                else if(j.includes('cover')){
                    obj.imageUrl = await bucketUpload(path.join(dir, i, j))
                }
                else{
                    obj.fileUrl =  await bucketUpload(path.join(dir, i, j))
                }
            }
            console.log(obj)
            await Book.create(obj)
        }
    }
    catch(e){
        console.log(e)
    }
    finally {
        console.log('Complete')
    }

}

booksUpload(dir)
