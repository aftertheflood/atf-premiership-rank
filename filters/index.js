require('../text/md-require');
const markDownText = require('../text/index')

const abbreviateNumber = (n)=>{
  const num = {
    number:n,
    order:''
  }
  if (n>1000000){
    num.number = n/100000;
    num.order = 'm';
  }else if(n>1000){
    num.number = n/1000;
    num.order = 'k';
  }
  return num;
}

function formatter(classList, s){
  console.log('formatter', classList, s);
  let formatted = s;
  if(classList.indexOf('currency') > -1){
    const numParts = abbreviateNumber(Number(formatted));
    formatted = `${numParts.order}£${numParts.number.toLocaleString()}`;
  }else if(classList.indexOf('round3') > -1){
    formatted = String(Math.round(Number(s) * 100) / 100);
    while(formatted.length < 4){
      formatted = `${formatted}0`;
    }
  }
  return `${formatted}`;
}

function addFilters(env){
  env.addFilter('md', function(key){
    return markDownText[key].html
  });

  env.addFilter('table', function(data, config) {
    /* config looks like this...  {
      columns: ['club','points','position','wage bill'],
      columnClasses: [...],
      headings: [...]
      headings: []
      sort: 'points',
      rowClass: 'code'
    } */
    const rows = data.map(row => {
      const cells = config.columns.map((property,i)=>`<td class="${property} ${config.columnClasses[i]}">${formatter(config.columnClasses[i], row[property])}</td>`);
      return `<tr class="${row[config.rowClass]}">${cells.join('')}</tr>`;
    });
    const headings = `<tr>${config.headings.map(heading => `<th>${heading}</th>`).join('')}</tr>`;

    return `<table>${headings} ${rows.join('')}</table>`;
  });
}

module.exports = addFilters;