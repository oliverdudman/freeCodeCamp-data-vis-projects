const d3 = require("d3");

const w = 700;
const h = 500;
const padding = 50;
const yAxisPadding = 25;

var chart = d3.select("#chart")
  .attr("width", w)
  .attr("height", h);

var tooltip = d3.select("#tooltip");

d3.json("./data/cyclist-data.json")
  .then(function(json) {
    const xScale = d3.scaleTime()
                     .domain([d3.min(json, d => new Date(d.Year, 0)),
                              d3.max(json, d => new Date(d.Year, 0))])
                     .range([0 + padding + yAxisPadding, w - padding]);

    const yScale = d3.scaleLinear()
                     .domain([d3.min(json, d => d.Seconds), d3.max(json, d => d.Seconds)])
                     .range([0 + padding, h - padding]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(d => d3.timeFormat('%M:%S')(new Date(0).setSeconds(d)));

    chart.append("g")
         .attr("id", "x-axis")
         .attr("transform", `translate(0, ${h - padding})`)
         .call(xAxis);

    chart.append("g")
         .attr("id", "y-axis")
         .attr("transform", `translate(${padding + yAxisPadding}, 0)`)
         .call(yAxis);
  });
