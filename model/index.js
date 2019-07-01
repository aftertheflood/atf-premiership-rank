const fetch = require('node-fetch');
const { extent, scaleLinear} = require('d3');
const { vector2coords, coords2vector } = require('./vector-line');
const lineIntersection = require('./line-intersection');


const docID = '1o7Qg6ElbqI1lo2rfoA_OQAro34NksZmrp_hXdSM9JIE';
const dataSheet = 'data%202018';
const teamDetails = 'dictionary/club%20details-by-code';
const sortOrder = 'dictionary/sort%20order-by-turnover';

const appRoot = 'https://atf-exprecsv.herokuapp.com/data/';
const dataURL = `${appRoot}${docID}/${dataSheet}.json`;
const teamDataURL = `${appRoot}${docID}/${teamDetails}.json`;
const sortOrderURL = `${appRoot}${docID}/${sortOrder}.json`;

function magnitude([x, y]){
  return Math.sqrt(x*x + y*y)
}

function getSheetData(req, res, next){
  const dataGet = fetch(dataURL);
  const teamsGet = fetch(teamDataURL);
  const sortOrderGet = fetch(sortOrderURL);

  Promise.all([dataGet, teamsGet, sortOrderGet])
    .then( ([results, teams, sort]) => {
      return Promise.all([
        results.json(),
        teams.json(),
        sort.json()
      ]);
    })
    .then(([results, teams, sort]) => {
      req.data = { results, teams, sort };
      next();
    });
}

function rankTeams(req, res, next){
  // Wage Weighting 0-1
  // 0 is 100% property x 1 is 100% property y
  const weighting = 0.5;

  const propX = d=> Number(d['points']); // high points total is good
  const propY = d=> Number(d['wagebill']); // low wage bill is good 

  // work out the scales to normalise the values to between 0 and 1
  const xDomain = extent(req.data.results, propX);
  const yDomain = extent(req.data.results, propY);

  const xScale = scaleLinear().range([0, 1])
    .domain(xDomain);

  const yScale = scaleLinear().range([1, 0]) // low wages are good so flip the range
    .domain(yDomain);

  // create the vector
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
    const intersection =  lineIntersection(rankLineCoords,teamNormalCoords);

    row._rankDistance = magnitude(intersection);
    row._rankingIntersection = intersection;
    return row;
  });

  rankedData = rankedData.sort((a,b) => (a._rankDistance - b._rankDistance))
    .map((d,i)=>{ 
      d._rank = rankedData.length - i;
      return d;
    })
  
  req.rankedResults = rankedData;

  next();
}

module.exports = { getSheetData, rankTeams };