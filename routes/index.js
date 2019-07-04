const { getSheetData, rankTeams, decorateClubData, calculateRegression } = require('../model');

function addRoutes(app){
  app.get('/', 
    getSheetData,
    rankTeams,
    (req, res) => res.render('index.html.nj', {data:req.data, date:new Date()}));

  app.get('/table.json', 
    getSheetData,
    rankTeams, 
    (req, res) => res.json(req.data.results));

  app.get('/club/:clubid.json',
    getSheetData,
    rankTeams,
    decorateClubData,
    (req, res) => res.json(req.data.selectedClub));

  app.get('/scatter-plot.svg',
    getSheetData,
    rankTeams,
    calculateRegression,
    (req, res) => {
      console.dir('scatter', res.headersSent)
      res.set('Content-Type','image/svg+xml');
      res.render('scatter.svg.nj', { imageWidth: 500, imageHeight: 500 })
    });

  app.get('/club/:clubid.svg',
    getSheetData,
    rankTeams,
    decorateClubData,
    (req, res) => {
      res.set('Content-Type','image/svg+xml');
      res.render('club.svg.nj', { club: req.data.selectedClub, imageWidth: 300, imageHeight: 80 });
    });

  return app;
}

module.exports = addRoutes;