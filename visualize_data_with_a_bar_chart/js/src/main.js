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

d3.json("./data/GDP-data.json")
  .then(function(data) {
    console.log(data);
  });
