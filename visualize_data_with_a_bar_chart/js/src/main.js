const d3 = require("d3");

const w = 500;
const h = 200;
const padding = 50;

var chart = d3.select("#chart")
  .attr("width", w)
  .attr("height", h);

chart.append("text")
  .attr("y", 150)
  .attr("x", 200)
  .attr("id", "title")
  .text("United States GDP");

d3.json("./data/GDP-data.json")
  .then(function(json) {
    console.log(json);

    const xScale = d3.scaleTime()
                     .domain([d3.min(json.data, d => new Date(d[0])),
                              d3.max(json.data, d => new Date(d[0]))])
                     .range([0 + padding, w - padding]);
    const yScale = d3.scaleLinear().domain([0, d3.max(json.data, d => d[1])]).range([h - padding, 0 + padding]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    chart.append("g")
         .attr("id", "x-axis")
         .attr("transform", "translate(0, " + (h - padding) + ")")
         .call(xAxis);

    chart.append("g")
         .attr("id", "y-axis")
         .attr("transform", "translate(" + padding + ", 0)")
         .call(yAxis);
  });
