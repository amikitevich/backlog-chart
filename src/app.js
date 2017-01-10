var margin = {top: 10, right: 20, bottom: 30, left: 30};
var width = 400 - margin.left - margin.right;
var height = 565 - margin.top - margin.bottom;

let data = [
  {
    id: 1,
    title: 'title1',
    backlogValue: 30,
    backlogEfforts: 40,
    backlogScore: 10
  },
  {
    id: 2,
    title: 'title2',
    backlogValue: 60,
    backlogEfforts: 40,
    backlogScore: -20
  },
  {
    id: 1,
    title: 'title3',
    backlogValue: 10,
    backlogEfforts: 60,
    backlogScore: 50
  },

];

let rectData = [
  {x: 0, y: 0, title: 'Quick wins'},
  {x: width / 2, y: 0, title: 'Big bets'},
  {x: 0, y: height / 2, title: 'Maybes'},
  {x: width / 2, y: height / 2, title: 'Time sinks'}
]

let backlogLimits = [0, 100];

//scales

let svg = d3.select('.chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)
;

let rectsG = svg.selectAll('g')
  .data(rectData)
  .enter()
  .append('g')
  .attr('transform', data => `translate(${data.x}, ${data.y})`)
;

let rects = rectsG
  .append('rect')
  .attr('width', width / 2)
  .attr('height', height / 2)
  .style('fill', 'lightblue')
  .style('stroke', 'green')
;

rectsG
  .append('text')
  .data(rectData)
  // .enter()
  .style('text-anchor', 'middle')
  .style('fill', 'black')
  .attr('x', 30)
  .attr('y', height / 2 - 10)
  .text(data => data.title);

// let rect = svg.append('rect')
//   .attr('x', width /2)
//   .attr('width', width / 2)
//   .attr('height', height / 2)
//   .style('fill', 'lightblue')
//   .style('stroke', 'green');

// svg
//   .append('text')
//   .style('text-anchor', 'middle')
//   .style('fill', 'black')
//   .attr('y', 265)
//   .attr('x', 265)
//   .text(x => 'test')
//
// ;
//
// svg.append('rect')
//   .attr('y', height /2)
//   .attr('width', width / 2)
//   .attr('height', height / 2)
//   .style('fill', 'lightblue')
//   .style('stroke', 'green');
//
// svg.append('rect')
//   .attr('y', height / 2)
//   .attr('x', width /2)
//   .attr('width', width / 2)
//   .attr('height', height / 2)
//   .style('fill', 'lightblue')
//   .style('stroke', 'green');

let yScale = d3.scaleLinear()
  .domain(backlogLimits)
  .range([height, 0])
let yAxis = d3.axisLeft(yScale);
svg.call(yAxis);

let xScale = d3.scaleLinear()
  .domain(backlogLimits)
  .range([0, width])
;

var xAxis = d3.axisBottom(xScale);
svg
  .append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(xAxis);


//scales END


var rScale = d3.scaleSqrt()
  .domain([0, 40])
  .range([0, 40]);

var circles = svg
  .selectAll('.ball')
  .data(data)
  .enter()
  .append('g')
  .attr('class', 'ball')
  .attr('transform', d => {
    return `translate(${xScale(d.backlogEfforts)}, ${yScale(d.backlogValue)})`;
  });

circles
  .append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', 5)
  .style('fill-opacity', 0.5)
  .style('fill', 'steelblue');

circles
  .append('text')
  .style('text-anchor', 'middle')
  .style('fill', 'black')
  .attr('x', 20)
  .attr('y', 3)
  .text(d => d.title);


function responsivefy(svg) {
  // get container + svg aspect ratio
  var container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style("width")),
    height = parseInt(svg.style("height")),
    aspect = width / height;

  // add viewBox and preserveAspectRatio properties,
  // and call resize so that svg resizes on inital page load
  svg.attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMinYMid")
    .call(resize);

  // to register multiple listeners for same event type,
  // you need to add namespace, i.e., 'click.foo'
  // necessary if you call invoke this function for multiple svgs
  // api docs: https://github.com/mbostock/d3/wiki/Selections#on
  d3.select(window).on("resize." + container.attr("id"), resize);

  // get width of container and resize svg to fit it
  function resize() {
    var targetWidth = parseInt(container.style("width"));
    svg.attr("width", targetWidth);
    svg.attr("height", Math.round(targetWidth / aspect));
  }
}
