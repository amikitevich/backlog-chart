var margin = {top: 10, right: 20, bottom: 30, left: 30};
var width = 600 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

generateTaskMock = (i) => {

  let value = Math.floor(Math.random() * 100 * i) % 100;
  let effort = Math.floor(Math.random() *  100 * i) % 100;
  let score = value - effort;

  return {
    id: i,
    title: 'title' + i,
    backlogValue: value,
    backlogEfforts: effort,
    backlogScore: score
  }
};

let data = [];
for (let i=0; i<100; i++) {
  data[i] = generateTaskMock(i);
}


setTimeout( _ => {
  data[1].backlogValue = 100;
  data[1].title = 'Timeout';
  console.log(d3.select('#ball_1'), 'ball 1');
  d3.select('#ball_1')
    .transition()
    .duration(1000)
    .call(taskTransform);
}, 2000);
window.data = data;

let rectData = [
  {x: 0, y: 0, title: 'Quick wins'},
  {x: width / 2, y: 0, title: 'Big bets'},
  {x: 0, y: height / 2, title: 'Maybes'},
  {x: width / 2, y: height / 2, title: 'Time sinks'}
]

let backlogLimits = [0, 100];

let tip = d3.tip().attr('class', 'd3-tip').html(d => {
  console.log(d);
  return d.title;
});

//scales

let svg = d3.select('.chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .call(responsivefy)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)
  // .on('click', setTimeout(tip.hide, 10))
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

svg.call(tip);

var rScale = d3.scaleSqrt()
  .domain([0, 40])
  .range([0, 40]);

let drag = d3.drag()
  .subject(function(d) { return {x: d[0], y: d[1]}; })
  .on("drag", dragged);

function dragged(d) {
  d.backlogValue = yScale.invert(d3.event.y);
  d.backlogEfforts = xScale.invert(d3.event.x);
  if (this.nextSibling) this.parentNode.appendChild(this);
  d3.select(this).call(taskTransform)
}

var circles = svg
  .selectAll('.ball')
  .data(data)
  .enter()
  .append('g')
  .attr('class', 'ball')
  .attr('id', d => 'ball_'+ d.id)
  .call(taskTransform)
  .call(drag)
;

circles
  .append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', width / 40)
  .style('fill-opacity', 0.5)
  .style('fill', 'steelblue')
  .on('click', () => {d3.event.stopPropagation(); return tip.show;})
;

circles
  .append('text')
  .style('text-anchor', 'middle')
  .style('fill', 'black')
  .attr('y', 4)
  .text(d => d.backlogScore);
;

function taskTransform(taskCircle) {
  return taskCircle
    .attr('transform', d => {
    return `translate(${xScale(d.backlogEfforts)}, ${yScale(d.backlogValue)})`
  });
}

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
