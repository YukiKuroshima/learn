const express = require('express');
const bodyParser = require('body-parser');
const MondoClient = require('mongodb').MongoClient;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
var db;

MondoClient.connect('mongodb://yk:3327@ds133922.mlab.com:33922/star-wars-quotes', (err, database) => {
  if (err) return console.log(err);
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000');
  })
});

app.get('/', (req, res) => {
  db.collection('quotes').find().toArray(function (err, results) {
    console.log(results)
  })

  db.collection('quotes').find().toArray((err, result) => {
    console.log()
    if (err) return console.log(err)

    res.render('index.ejs', { quotes: result })
  })
})

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err);

    console.log('saved to database');
    res.redirect('/');
  })
});


