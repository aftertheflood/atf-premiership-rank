const express = require('express');
const nunjucks = require('nunjucks');
const app = express()
const port = 3000

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

function getData(req, res, next){
  req.data = [1,2,3,4,5,6,7,8,9];
  next();
}

app.get('/', getData, (req, res) => res.render('index.nj', {data:req.data, date:new Date()}))

app.listen(port, () => console.log(`http://localhost:${port}!`))