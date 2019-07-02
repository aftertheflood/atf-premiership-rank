
const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const port = process.env.PORT || 3000;
const addRoutes = require('./routes');
const addFilters = require('./filters');


const env = nunjucks.configure('views', {
  autoescape: true,
  express: app
});

addFilters(env);

addRoutes(app);

app.listen(port, function(){
  console.log(`ATF Premiership Rank is running on ${port}`);
});
