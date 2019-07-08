const { getSheetData, rankTeams, decorateClubData, scatterLayout } = require('../model');

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
    (req, res) => {
      res.set('Content-Type','image/svg+xml');
      res.render('scatter.svg.nj', scatterLayout(req.rankedResults, req.regressionLine, { 
        width: 500, 
        height: 500,
        margin: { top: 20, left: 50, bottom: 50, right: 20 },
        xDomain: req.rankingDomain.x,
        yDomain: req.rankingDomain.y,
        yLabel: 'Points',
        xLabel: 'Wage Bill'
       }))
    });

  app.get('/club/:clubid.svg',
    getSheetData,
    rankTeams,
    decorateClubData,
    (req, res) => {
      res.set('Content-Type','image/svg+xml');
      res.render('club.svg.nj', { club: req.data.selectedClub, imageWidth: 330, imageHeight: 80 });
    });

  return app;
}

module.exports = addRoutes;