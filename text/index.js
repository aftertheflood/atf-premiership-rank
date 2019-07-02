const fs = require('fs');

module.exports = fs.readdirSync('./text')
  .filter(d=>d.indexOf('.md')>-1)
  .reduce((dict, current)=>{
    dict[current.split('.')[0]] = require(`./${current}`);
    return dict;
  },{});