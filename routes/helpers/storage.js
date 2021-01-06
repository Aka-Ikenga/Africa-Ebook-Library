const fs = require('fs');
const admin = require("firebase-admin");
const Multer = require('multer');

const Author = require('../../models/Authors')
const Book = require('../../models/Books');

const serviceAccount = require("../../config/africa-ebook-library-firebase-adminsdk-peafu-be706b8f8c");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    apiKey: "AIzaSyD-xF1WHFzcCWs2WdLcG7qWjYzPWVEUFI0",
    authDomain: "africa-ebook-library.firebaseapp.com",
    databaseURL: "https://africa-ebook-library.firebaseio.com",
    projectId: "africa-ebook-library",
    storageBucket: "africa-ebook-library.appspot.com",
    messagingSenderId: "481146609920",
    appId: "1:481146609920:web:d50210af1e2c61ffa153e5",
    measurementId: "G-MDFBS1QMKD"
});

const bucket = admin.storage().bucket();
const storage = Multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = Multer({ storage: storage, preservePath: true});

async function create(req, res, next){
    try{
        const urls = req.files.map( async (f) => {
            try {
                let [file] = await bucket.upload(f.path, {public: true});
                let [meta] = await file.getMetadata();
                await fs.unlink(f.path, err => {
                    if (err) {
                        console.error(err);
                    }
                });
                return meta.mediaLink;
            }
            catch(e)
            {
                console.error(e);
            }

        });
        let [a, b] = await Promise.all(urls);
        if (a && b){
            req.body.fileUrl = a.includes('cover') ? b : a;
            req.body.imageUrl = a.includes('cover') ? a: b;}

        let authors = req.body.author.split(',');
        authors.forEach(name => name.trim())
        req.body.author = authors;
        // upload to authors database by adding each of the book authors to the database
        let auth = authors.map(async name => {
            let author = await Author.findOneAndUpdate({name: name}, {name: name}, {upsert: true});
            // if(!author){
            //     author = await Author.create({name: name, books: [req.body.title]})
            //
            // }
            return author
        })
        let authIds = await Promise.all(auth.map(auth => auth._id))
        req.body.authors = authIds
        req.body.genres = req.body.genres.split(',');
        let book = await Book.create(req.body);
        authIds.forEach(async id => {
            let auth = await Author.findByIdAndUpdate(id, {$push:{books: book.id}})
        })
        return next();
    }
    catch(e){
        console.error(e);
        return next();
    }

}

module.exports = {upload, create, bucket};
