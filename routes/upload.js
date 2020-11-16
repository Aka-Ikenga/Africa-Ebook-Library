const express = require('express');

const {upload, create} = require('./helpers/storage');
const {isAdmin} = require('./helpers/checkuser');

const router = express.Router();

router.get('/upload', (req, res) => {
    res.render('index')
});

router.post('/', isAdmin, upload.array('book', 2), create, (req, res) => {
    res.redirect('/admin/upload');
    });

module.exports = router;
