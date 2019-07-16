require('../text/md-require');

const { interpolateWarm, scaleSequential } = require('d3')
const imageURL = (clubid)=>`https://aftertheflood.com/wp-content/uploads/2019/07/${clubid}.png`;
const markDownText = require('../text/index')

const millions = (n)=>{
  return n/1000000;
}

const colourScale = scaleSequential(interpolateWarm)
  .domain([-17,12]);

function formatter(classList, s) {
  let formatted = s;
  if(classList.indexOf('millions') > -1){
    formatted = millions(Number(formatted)).toLocaleString();
  }else if(classList.indexOf('round3') > -1){
    formatted = String(Math.round(Number(s) * 100) / 100);
    while(formatted.length < 4){
      formatted = `${formatted}0`;
    }
  }else if(classList.indexOf('color') > -1){
    return `${s} <div style="background-color:${colourScale(s)}; display:inline-block; height:100%">&nbsp;&nbsp;&nbsp;</div>`
  }
  return `${formatted}`;
}

function addFilters(env){
  env.addFilter('dataSet', obj => Object.entries(obj).map(([k,v])=>`data-${k}="${v}"`).join(' '));
  env.addFilter('logo', imageURL);
  env.addFilter('signed', s => String(`${s >= 0 ? '+' : ''}${s}`));
  env.addFilter('md', (key) => markDownText[key].html);
  env.addFilter('localeString', s => Number(s).toLocaleString());
  env.addFilter('table', function(data, config) {
    /* quite a complicated filter:
    config looks like this...  {
      columns: ['club','points','position','wage bill'],
      columnClasses: [...],
      headings: [...]
      headings: []
      sort: 'points',
      rowClass: 'code'
    } */
    const rows = data.map(row => {
      const cells = config.columns
        .map((property,i)=>`<td class="${property} ${config.columnClasses[i]}">${formatter(config.columnClasses[i], row[property])}</td>`);
      return `<tr class="${row[config.rowClass]}">${cells.join('')}</tr>`;
    });
    const headings = `<tr>${config.headings.map((heading,i) => `<th class="${config.columnClasses[i]} ${config.columns[i]}">${heading}</th>`).join('')}</tr>`;

    return `<table>
      <thead>${headings}</thead>
      <tbody>${rows.join('')}</tbody>
    </table>`;
  });
}

module.exports = addFilters;