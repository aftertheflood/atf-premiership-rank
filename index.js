
const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const helmet = require('helmet')
const addRoutes = require('./routes');
const addFilters = require('./filters');

app.use(helmet());

const env = nunjucks.configure('views', { autoescape: true, express: app });

addFilters(env);
addRoutes(app);

const port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log(`ATF Premiership Rank is running on ${port}`);
});
