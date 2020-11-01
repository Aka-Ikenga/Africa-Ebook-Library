var express = require('express');
var router = express.Router();
const books = require('../models/Books')
/* GET home page. */
router.get('/api/', async (req, res, next) => {
  console.log(req.query, req.query.id, req.query.author)
  books_ = await books.find().lean()
  res.send(books_);
});

module.exports = router;
