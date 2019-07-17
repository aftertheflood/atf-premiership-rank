const LRU = require('lru-cache');

const cache = new LRU({
  max: 500,
  length:  (n, key) => (n * 2 + key.length),
  dispose: (key, n) => { n="" },
  maxAge: 1000 * 60 * 60 
});

const { getSheetData, rankTeams, decorateClubData, scatterLayout } = require('../model');

const cacheGet = (req, res, next)=>{
  const cacheValue = cache.get(req.url);
  if(cacheValue){
    console.log('retrieved from cache!')
    res.send(cacheValue);
  }else{
    console.log('not cached')
    next();
  }
}

function addRoutes(app){
  app.get('/',
    cacheGet,
    getSheetData,
    rankTeams,
    (req, res) => {
      res.render( 'index.html.nj', {
        data:req.data,
        gameWeek: req.data.config['game week'][0].value,
        season: req.data.config['season name'][0].value,
        date:new Date() },
        (err, markup) => {
          cache.set(req.url, markup);
          res.send(markup);
        });
    });
  
  
  app.get('/graphic-table',
    cacheGet,
    getSheetData,
    rankTeams,
    (req, res) => res.render('graphic-table.html.nj', 
      {data:req.data, date:new Date()},
      (err, markup) => {
        cache.set(req.url, markup);
        res.send(markup);
      }));

  app.get('/table', 
    cacheGet,
    getSheetData,
    rankTeams,
    (req, res) => res.render('detail-table.html.nj', 
      {data:req.data, date:new Date()},
      (err, markup) => {
        cache.set(req.url, markup);
        res.send(markup);
      }));

  app.get('/table.json',
    cacheGet,
    getSheetData,
    rankTeams, 
    (req, res) => res.json(req.data.results,
      (err, markup) => {
        cache.set(req.url, markup);
        res.send(markup);
      }));

  app.get('/club/:clubid.json',
    cacheGet,
    getSheetData,
    rankTeams,
    decorateClubData,
    (req, res) => res.json(req.data.selectedClub,
      (err, markup) => {
        cache.set(req.url, markup);
        res.send(markup);
      }));

  app.get('/scatter-plot.svg',
    cacheGet,
    getSheetData,
    rankTeams,
    (req, res) => {
      res.set('Content-Type','image/svg+xml');
      res.render('scatter.svg.nj', 
        scatterLayout(req.rankedResults, req.regressionLine, { 
          width: 500, 
          height: 500,
          margin: { top: 20, left: 50, bottom: 50, right: 20 },
          xDomain: req.rankingDomain.x,
          yDomain: req.rankingDomain.y,
          yLabel: 'Points',
          xLabel: 'Wage Bill'
        }),
        (err, markup) => {
          cache.set(req.url, markup);
          res.send(markup);
        });
    });

  app.get('/club/:clubid.svg',
    cacheGet,
    getSheetData,
    rankTeams,
    decorateClubData,
    (req, res) => {
      res.set('Content-Type','image/svg+xml');
      res.render('club.svg.nj',
        { club: req.data.selectedClub, imageWidth: 330, imageHeight: 80 },
        (err, markup) => {
          cache.set(req.url,markup);
          res.send(markup);
        });
    });

  return app;
}

module.exports = addRoutes;