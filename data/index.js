const fetch = require('node-fetch');

function getData(req, res, next){
  req.data = [1,2,3,4,5,6,7,8,9];
  next();
}

module.exports = getData;