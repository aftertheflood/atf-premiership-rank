const {getSheetData, rankTeams} = require('../model');

function addRoutes(app){
  app.get('/', 
    getSheetData,
    rankTeams,
    (req, res) => res.render('index.nj', {data:req.data, date:new Date()}));

  app.get('/table.json', 
    getSheetData, 
    (req, res) => res.json(req.data.results));

  app.get('/club/:clubid.json',
    getSheetData,
    (req, res) => {
      console.log(Object.keys(req.data))
      res.json(req.data.teams[req.params.clubid])
    });

  return app;
}

module.exports = addRoutes;