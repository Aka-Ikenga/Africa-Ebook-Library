const Book = require("../models/Books")
const Author = require("../models/Authors")
const {bucket} = require("./bucket_upload")
const fs = require("fs")
const path = require('path')
const connectDB = require('../config/db')
const dotenv  = require('dotenv');


dotenv.config({path:'./config/config.env'});
connectDB()

let dir = process.argv[1]  //"C:\\Users\\Ichinga Samuel\\WebstormProjects\\AfricanClassics\\Africa Ebook Library Project\\Books"
let files = fs.readdirSync(dir)
for(let i of files){
    let contents = fs.readdirSync(path.join(dir, i))
    for(let j of contents){
        let obj
        if(j.includes('json')){
            let meta = path.join(dir, i, j)
            let fo = fs.readFileSync(meta)
            obj = JSON.parse(fo)
            let authors = obj.authors.map(async name => {
                let author = await Author.findOneAndUpdate({name: name}, {name: name}, {upsert: true})
                return author._id
            })
            obj.authors = Promise.all(authors)
        }
        else if(j.includes('cover')){
            obj.imageUrl = Promise.resolve(bucket(path.join(dir, i, j)))
        }
        else{
            obj.fileUrl = Promise.resolve(bucket(path.join(dir, i, j)))
        }
        Book.create(obj)
    }
}

