const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const port = process.env.PORT || 3000;
const addRoutes = require('./routes');

nunjucks.configure('views', { autoescape: true, express: app });

addRoutes(app);

app.listen(port, function(){
  console.log(`ATF Premiership Rank is running on ${port}`);
});
