const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const helmet = require('helmet')
const compression = require('compression')

const addRoutes = require('./routes');
const addFilters = require('./filters');

app.use(helmet({
  contentSecurityPolicy:{
    directives:{
      defaultSrc: ["'self'", 'www.aftertheflood.com', 'aftertheflood.com', 'tools.aftertheflood.com'],
      styleSrc: ["'self'", 'www.aftertheflood.com', 'aftertheflood.com', 'tools.aftertheflood.com'],
      scriptSrc: ["'self'", "'unsafe-inline'", 'www.aftertheflood.com', 'aftertheflood.com', 'tools.aftertheflood.com', 'www.googletagmanager.com', 'www.google-analytics.com']
    }
  }
}));

app.use('/assets', express.static('assets'))

app.use(compression());

const env = nunjucks.configure('views', { autoescape: true, express: app });

addFilters(env);
addRoutes(app);

app.use(function (err, req, res, next) {
  console.error(err.message, new Date());
  console.log(err.stack);
  res.render('error.html.nj', {message: err.message});
});

const port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log(`ATF Premiership Rank is running on ${port}`);
});
