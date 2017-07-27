const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const moment = require('moment')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.locals.title = 'AmazonBay'

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'))

app.get('/', (req, res) => {
  fs.readFile(`${_dirname}/index.html`, (err, file) => {
    res.send(file)
    err.status(404).json({"message": "page not found"})
  })
})

app.get('/api/v1/inventory', (req, res) => {
  database('inventory').select()
    .then((items) => {
      res.status(200).json(items);
    })
    .catch((error) => {
      res.status(404).json({ 'Does not exist': error });
    });
});

app.post('/api/v1/orders', (req, res) => {
  const { order_total } = req.body
  const order_date = moment().format('YYYYMMDD')

  database('orders')
    .returning(['order_total', 'order_date'])
    .insert({ order_total, order_date })
      .then((insertedValues) => {
        res.status(201).json(insertedValues[0]);
      })
      .catch((err) => {
        res.status(400).json({"malformed request": err})
      });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} listening at ${app.get('port')}`);
});

module.exports = app;
