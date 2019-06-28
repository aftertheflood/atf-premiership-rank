const getSheetData = require('../data');

function addRoutes(app){
  app.get('/', 
    getSheetData, 
    (req, res) => res.render('index.nj', {data:req.data, date:new Date()}))
  return app;
}

module.exports = addRoutes;