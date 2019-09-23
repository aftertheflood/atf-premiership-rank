const fetch = require('node-fetch');
const { extent, scaleLinear} = require('d3');
const { regressionLinear } = require('d3-regression');
const { vector2coords, coords2vector } = require('./vector-line');
const lineIntersection = require('./line-intersection');
const scatterLayout = require('./scatter-layout');


const seasonKey = 2019;
const docID = '1o7Qg6ElbqI1lo2rfoA_OQAro34NksZmrp_hXdSM9JIE';
const dataSheet = `data%20${seasonKey}`;
const teamDetails = 'dictionary/club%20details-by-code';
const sortOrder = 'dictionary/sort%20order-by-turnover';
const configuration = 'dictionary/configuration-by-key';

const appRoot = 'https://atf-exprecsv.herokuapp.com/data/';
const dataURL = `${appRoot}${docID}/${dataSheet}.json`;
const teamDataURL = `${appRoot}${docID}/${teamDetails}.json`;
const sortOrderURL = `${appRoot}${docID}/${sortOrder}.json`;
const configurationURL = `${appRoot}${docID}/${configuration}.json`;

function magnitude([x, y]){
  return Math.sqrt(x*x + y*y)
}

function decorateClubData(req, res, next){
  if(req.params.clubid != undefined){
    const clubRow = req.data.results.filter(d=>(d.code.toLowerCase() == req.params.clubid.toLowerCase()));
    if(clubRow.length<1){
      res.status(404);
      next(new Error('404: Club not found'));
      return;
    }
    req.data.selectedClub = req.data.teams[req.params.clubid][0];
    req.data.selectedClub.data = clubRow[0];
    next();
  }
  next();
}

function getSheetData(req, res, next){

  const dataGet = fetch(dataURL);
  const teamsGet = fetch(teamDataURL);
  const sortOrderGet = fetch(sortOrderURL);
  const configurationGet = fetch(configurationURL);

  Promise.all([dataGet, teamsGet, sortOrderGet, configurationGet])
    .then( ([results, teams, sort, config]) => {
      return Promise.all([
        results.json(),
        teams.json(),
        sort.json(),
        config.json()
      ]);
    })
    .then(([results, teams, sort, config]) => {
      req.data = { results, teams, sort, config };
      next();
    })
    .catch(err=>{
      res.status(500);
      next(new Error('500: Unable to retrieve data'))
    });
}

function rankTeams(req, res, next){
  // Wage Weighting 0-1
  // 0 is 100% property x 1 is 100% property y
  const propY = d=> Number(d['points']);    // high points total is good
  const propX = d=> Number(d['wagebill']);  // low wage bill is good 

  // work out the scales to normalise the values to between 0 and 1
  const xDomain = extent(req.data.results, propX);
  const yDomain = extent(req.data.results, propY);

  const xScale = scaleLinear().range([1, 0]) // TODO flip
    .domain(xDomain);

  const yScale = scaleLinear().range([0, 1]) 
    .domain(yDomain);

  const regressionLine = regressionLinear()
    .x(propX)
    .y(propY)
    (req.data.results);

  /***  create the vector ***/

  /***  create the vector ***/

  // either use a weigting to make a rank vector   
  const weighting = 0.5;
  const rankVector = {
    angle: (Math.PI/2) * weighting,
    origin: [0, 0],
    length: 1 //length doesn't really matter
  };
  const rankLineCoords = vector2coords(rankVector.angle, rankVector.length, rankVector.origin);

  let rankedData = req.data.results.map(row=>{
    const teamNormal = {
      angle: Math.PI/2 + rankVector.angle,
      origin: [ xScale(propX(row)), yScale(propY(row)) ],
      length: 1
    }
    const teamNormalCoords = vector2coords(teamNormal.angle, teamNormal.length, teamNormal.origin);
    const intersection =  lineIntersection(rankLineCoords, teamNormalCoords);
    
    
    const domainIntersection = [xScale.invert(intersection[0]), yScale.invert(intersection[1])];
    row._rankDistance = magnitude(domainIntersection);

    row._rankingIntersection = domainIntersection;
    return row;
  });

  rankedData = rankedData.sort((a,b) => (b._rankDistance - a._rankDistance))
    .map((d,i)=>{ 
      d._rank = rankedData.length - i;
      d._rankDifference = d.position - d._rank;
      return d;
    });
  req.regressionLine = regressionLine;
  req.rankLineCoords = rankLineCoords;
  req.rankingDomain = {
    x: xScale.domain(),
    y: yScale.domain()
  }
  req.descaledRankingLine = [
    [xScale.invert(rankLineCoords[0][0]), yScale.invert(rankLineCoords[0][1])],
    [xScale.invert(rankLineCoords[1][0]), yScale.invert(rankLineCoords[1][1])]
  ];
  req.rankingLine = rankLineCoords
  req.rankedResults;

  next();
}

module.exports = { 
  decorateClubData, 
  getSheetData, 
  rankTeams, 
  scatterLayout 
};