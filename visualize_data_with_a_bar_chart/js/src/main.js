const d3 = require("d3");

const w = 700;
const h = 500;
const padding = 50;

var chart = d3.select("#chart")
  .attr("width", w)
  .attr("height", h);

var tooltip = d3.select("#tooltip");

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
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(json.data, d => d[1])])
                     .range([h - padding, 0 + padding]);

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

    chart.selectAll("rect")
         .data(json.data)
         .enter()
         .append("rect")
         .attr("class", "bar")
         .attr("y", d => yScale(d[1]))
         .attr("x", d => xScale(new Date(d[0])))
         .attr("height", d => h - padding - yScale(d[1]))
         .attr("data-date", d => d[0])
         .attr("data-gdp", d => d[1])
         .attr("width", 3)
         .on("mousemove", d => {
           let tooltipW = parseInt(tooltip.style("width"));
           let chartX2 = document.getElementById("chart").getBoundingClientRect().right;
           let x = d3.event.clientX;
           if (x + tooltipW >= chartX2) {
             x = chartX2 - tooltipW;
           }
           tooltip.attr("data-date", d[0])
                  .style("opacity", "1")
                  .style("top", d3.event.clientY - (parseInt(tooltip.style("height")) + 15) + "px")
                  .style("left", x + "px")
                  .html(`GDP: ${d[1]}<br/> Date: ${d[0]}`);


         })
         .on("mouseleave", () => {
           tooltip.style("opacity", "0");
         });
  });
