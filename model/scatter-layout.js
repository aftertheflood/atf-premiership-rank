const {scaleLinear} = require('d3');
const {coords2vector} = require('./vector-line');
module.exports = (data, line, config)=>{
  const plotWidth = config.width - (config.margin.left + config.margin.right);
  const plotHeight = config.height - (config.margin.bottom + config.margin.top);

  const scaleX = scaleLinear()
    .domain(config.xDomain)
    .range([0, plotWidth]);

  const scaleY = scaleLinear()
    .domain(config.yDomain)
    .range([plotHeight, 0]);

  const regressionLine = [
    [scaleX(line[0][0]), scaleY(line[0][1])],
    [scaleX(line[1][0]), scaleY(line[1][1])]
  ];

  const regressionAngle = coords2vector(regressionLine[0],regressionLine[1]).angle * 57.29578; //radians to degrees

  points = data.map(d=>({
    dataSet: { wagebill:d.wagebill, points:d.points, club:d.club, code:d.code },
    coords: [scaleX(d['points']), scaleY(d['wagebill'])]
  }));
  const xMid = config.xDomain[0] + (config.xDomain[1]-config.xDomain[0])/2;
  const regressionLabelCoords = [scaleX(xMid), scaleY(line.predict(xMid))];

  return {
    height: config.height,
    width: config.width,
    margin: config.margin,
    points,
    plotWidth,
    plotHeight,
    regressionAngle,
    regressionLine,
    regressionLabelCoords,
    regressionLabel:'wages -- points',
    xLabel: 'Points',
    yLabel: 'Wage Bill',
  };
}