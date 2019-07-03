const { getSheetData, rankTeams, decorateClubData } = require('../model');

function addRoutes(app){
  app.get('/', 
    getSheetData,
    rankTeams,
    (req, res) => res.render('index.nj', {data:req.data, date:new Date()}));

  app.get('/table.json', 
    getSheetData,
    rankTeams, 
    (req, res) => res.json(req.data.results));

  app.get('/club/:clubid.json',
    getSheetData,
    rankTeams,
    decorateClubData,
    (req, res) => {
      console.log(Object.keys(req.data.selectedClub))
      res.json(req.data.selectedClub)
    });

  return app;
}

module.exports = addRoutes;