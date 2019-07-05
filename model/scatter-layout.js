const {scaleLinear} = require('d3');

module.exports = (data, line, config)=>{
  const plotWidth = config.width - (config.margin.left + config.margin.right);
  const plotHeight = config.height - (config.margin.bottom + config.margin.top);
  
  console.log('domain', config.xDomain, config.yDomain)

  const scaleX = scaleLinear()
    .domain(config.xDomain)
    .range([0,plotWidth]);

  const scaleY = scaleLinear()
    .domain(config.yDomain)
    .range([plotHeight, 0]);

  console.log(line);
  const regressionLine = [
    [scaleX(line[0][0]), scaleY(line[0][1])],
    [scaleX(line[1][0]), scaleY(line[1][1])]
  ];

  points = data.map(d=>({
    dataSet: { wagebill:d.wagebill, points:d.points, club:d.club, code:d.code },
    coords: [scaleX(d['points']), scaleY(d['wagebill'])]
  }));

  return {
    height: config.height,
    width: config.width,
    margin: config.margin,
    points,
    plotWidth,
    plotHeight,
    regressionLine,
    xLabel: 'Points',
    yLabel: 'Wage Bill'
  };
}