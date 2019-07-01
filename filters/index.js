function addFilters(env){
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
      const cells = config.columns.map((property,i)=>`<td class="${property} ${config.columnClasses[i]}">${row[property]}</td>`);
      return `<tr class="${row[config.rowClass]}">${cells.join('')}</tr>`;
    });
    const headings = `<tr>${config.headings.map(heading => `<th>${heading}</th>`).join('')}</tr>`;

    return `<table>${headings} ${rows.join('')}</table>`;
  });
}

module.exports = addFilters;