const {getSheetData, rankTeams} = require('../model');

function addRoutes(app){
  app.get('/', 
    getSheetData,
    rankTeams,
    (req, res) => res.render('index.nj', {data:req.data, date:new Date()}));

  app.get('/table.json', 
    getSheetData, 
    (req, res) => res.json(req.data.results));

  return app;
}

module.exports = addRoutes;