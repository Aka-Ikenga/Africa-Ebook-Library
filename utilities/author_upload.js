const Book = require("../models/Books")
const Author = require("../models/Authors")
const {bucketUpload} = require("./bucket_upload")
const fs = require("fs")
const path = require('path')
const connectDB = require('../config/db')
const dotenv  = require('dotenv');


dotenv.config({path:'./config/config.env'});
connectDB()

let dir = process.argv[2]

async function authorUpload(dir) {
    try{
        let files = await fs.promises.readdir(dir)
        for await (let i of files){
            let contents = await fs.promises.readdir(path.join(dir, i))
            let obj = {}
            for await (let j of contents){
                if(j.includes('json')){
                    let meta = path.join(dir, i, j)
                    let fo = fs.readFileSync(meta)
                    obj = {...JSON.parse(fo), ...obj}
                    let iso = obj.birthdate.replace(/(\d{1,2})-(\d{1,2})-(\d{2,4})/, '$3-$2-$1')
                    obj.birthdate = new Date(iso)
                }
                else{
                    obj.imageUrl =  await bucketUpload(path.join(dir, i, j))
                }
            }
            let author = await Author.findOneAndUpdate({name: obj.name}, obj, {new: true, upsert: true, fields: {_id: 1, books: 1}})
            let books = await Book.find({authors: author._id}).select({_id: 1})
            books.forEach((a,b,c) => {return c[b] = a._id})
            author.books = books
            await author.save()

        }
    }
    catch(e){
        console.log(e)
    }
    finally {
        console.log('Complete')
    }

}

authorUpload(dir).then().catch(err => console.log(err))
