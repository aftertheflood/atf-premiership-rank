const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const port = process.env.PORT || 3000;
const addRoutes = require('./routes');

const env = nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// register custom helper
env.addFilter('shorten', function(str, count) {
  return str.slice(0, count || 5);
});

env.addFilter('table', function(data, config) {
  console.log(data);
  /* config looks like this...  {
    columns: ['club','points','position','wage bill'],
    sort: 'points',
    rowClass: 'code'
  } */
  const rows = data.map(row => {
    const cells = config.columns.map(property=>`<td class="${property}">${row[property]}</td>`);
    return `<tr class="${row[config.rowClass]}">${cells.join('')}</tr>`;
  });

  console.log(rows);
  return `<table>${rows.join('')}</table>`;
});


addRoutes(app);

app.listen(port, function(){
  console.log(`ATF Premiership Rank is running on ${port}`);
});
