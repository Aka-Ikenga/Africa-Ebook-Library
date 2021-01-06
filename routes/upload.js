const express = require('express');
const User = require('../models/Users')
const Author = require('../models/Authors')
const {listCountries} = require('@odusanya/african-countries');

const {upload, create} = require('./helpers/storage');
const {isAdmin} = require('./helpers/checkuser');

const router = express.Router();
let countries = listCountries().map(c => c['Country Name'])

router.get('/book', isAdmin, (req, res) => {
    res.render('books')
});

router.post('/book', isAdmin, upload.array('book', 2), create, (req, res) => {
    res.redirect('/upload/book');
    });


router.get('/author', (req, res) =>{
    res.render('authors', {countries: countries})
})

router.post('/author', isAdmin, async (req, res) => {
    console.log(req.body)
    await Author.findOneAndUpdate({name:req.body.name}, req.body, {upsert: true})
    res.render('authors')
})

module.exports = router;
