var express = require('express');
var router = express.Router();
const books = require('../models/Books');


router.get('/', (req, res) => {
  res.redirect('/auth/login')
});

router.get('/api/', async (req, res) => {

  const books_ = await books.find().lean()
  res.send(books_);
});

router.post('/api/', async (req, res) => {
  console.log(req.body)
  await books.create(req.body)
  res.send('ok')

})

module.exports = router;
