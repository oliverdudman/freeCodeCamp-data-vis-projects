const d3 = require("d3");

const w = 500;
const h = 200;

var chart = d3.select("#chart")
  .attr("width", w)
  .attr("height", h);

chart.append("text")
  .attr("y", 150)
  .attr("x", 200)
  .attr("id", "title")
  .text("United States GDP");

chart.append("g")
  .attr("id", "x-axis")


d3.json("./data/GDP-data.json")
  .then(function(json) {
    console.log(json);

    const xScale = d3.scaleTime()
                     .domain([d3.min(json.data, d => new Date(d[0])),
                              d3.max(json.data, d => new Date(d[0]))])
                     .range([0, w]);
    const yScale = d3.scaleLinear().domain([0, d3.max(json.data, d => d[1])]).range([h, 0]);
  });
