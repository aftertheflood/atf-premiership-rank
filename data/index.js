const fetch = require('node-fetch');

const docID = '1o7Qg6ElbqI1lo2rfoA_OQAro34NksZmrp_hXdSM9JIE';
const dataSheet = 'data%202018';
const teamDetails = 'dictionary/club%20details-by-code';
const sortOrder = 'dictionary/sort%20order-by-turnover';

const appRoot = 'https://atf-exprecsv.herokuapp.com/data/';
const dataURL = `${appRoot}${docID}/${dataSheet}.json`;
const teamDataURL = `${appRoot}${docID}/${teamDetails}.json`;
const sortOrderURL = `${appRoot}${docID}/${sortOrder}.json`;

function getData(req, res, next){
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

module.exports = getData;