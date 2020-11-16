const fs = require('fs');
const admin = require("firebase-admin");
const Multer = require('multer');
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
            catch
            {
                console.error();
            }

        });
        let [a, b] = await Promise.all(urls);
        if (a && b){
            req.body.fileUrl = a.includes('cover') ? b : a;
            req.body.imageUrl = a.includes('cover') ? a: b;}
        req.body.authors = req.body.authors.split(',');
        req.body.genres = req.body.genres.split(',');
        await Book.create(req.body);
        return next();
    }
    catch{
        console.error();
        return next();
    }

}

module.exports = {upload, create};
