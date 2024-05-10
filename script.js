const margin = {
    top: 100,
    right: 20,
    bottom: 30,
    left: 60
  }
const width = 920 - margin.left - margin.right;
const height = 630 - margin.top - margin.bottom;
const radius = 6;

const tooltip = d3
  .select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

const svgContainer = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "graph")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/*
Data Format:
{"Time":"36:50",
"Place":1,
"Seconds":2210,
"Name":"Marco Pantani",
"Year":1995,
"Nationality":"ITA",
"Doping":"Alleged drug use during 1995 due to high hematocrit levels",
"URL":"https://en.wikipedia.org/wiki/Marco_Pantani#Alleged_drug_use"}
*/
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
.then(data => {

    svgContainer
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -150)
      .attr('y', -40)
      .style("font-size", "18px")
      .text('Time in Minutes');

    years = data.map(athlete => {
        return athlete.Year;
    });

    const parseTime = d3.timeParse("%M:%S")

    timerDates = data.map(athlete => {
        return parseTime(athlete.Time);
    });

    const xScale = d3.scaleLinear()
        .domain([d3.min(years, (y) => y-1), d3.max(years, (y) => y+1)])
        .range([0, width]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

    svgContainer
        .append('g')
        .attr('class', 'x axis')
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .append('text')
        .attr('class', 'x-axis-label')
        .attr('x', width)
        .attr('y', -6)
        .style('text-anchor', 'end')
        .text('Year');

    const yScale = d3.scaleTime()
        .domain([d3.min(timerDates), d3.max(timerDates)])
        .range([0, height]);
    
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    svgContainer
        .append('g')
        .attr('class', 'y axis')
        .attr('id', 'y-axis')
        .call(yAxis)
        .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Best Time (minutes)');
    
    svgContainer
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("data-xvalue", (d) => d.Year)
        .attr("cx", (d) => xScale(d.Year))
        .attr("data-yvalue", (d) => parseTime(d.Time).toISOString())
        .attr("cy", (d) => yScale(parseTime(d.Time)))
        .attr("r", radius)
        .attr("fill", (d) => d.Doping === "" ? "rgb(255, 127, 14)" : "rgb(31, 119, 180)")
        .on("mouseover", (e, d) =>{
            const x = xScale(d.Year);
            const y = yScale(parseTime(d.Time));
            
            tooltip.transition().duration(200).style('opacity', 0.9);

            const dopingData = (d.Doping === "") ? "" : (
                "<br>" +
                "<br>" +
                d.Doping
            );

            tooltip
                .html(
                    d.Name + ": " + d.Nationality +
                    "<br>" +
                    "Year: " + d.Year + " Time: " + d.Time +
                    dopingData            
                )
                .attr("data-year", d.Year)
                .style('left', e.pageX + 'px')
                .style('top', e.pageY - 28 + 'px');
        })
        .on("mouseout", () => {
            tooltip.transition().duration(200).style('opacity', 0);
        });
    
    svgContainer
        .append("text")
        .attr("x", 420)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .style("font-size", "30px")
        .attr("id", "title")
        .text("Doping in Professional Bicycle Racing");
  
    svgContainer
        .append("text")
        .attr("x", 420)
        .attr("y", -25)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("35 Fastest times up Alpe d'Huez");

    const legend = svgContainer
        .append("g")
        .attr("id", "legend");
    
    const legendNoDoping = legend
        .append("g")
        .attr("class", "legend-label")
        .attr("transform", "translate(0, 230)")
    
    legendNoDoping
        .append("rect")
        .attr("x", 822)
        .attr("height", 18)
        .attr("width", 18)
        .attr("fill", "rgb(255, 127, 14)");
    
    legendNoDoping
        .append("text")
        .attr("x", 816)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text("No doping allegations");
    
    const legendDoping = legend
        .append("g")
        .attr("class", "legend-label")
        .attr("transform", "translate(0, 250)")
    
    legendDoping
        .append("rect")
        .attr("x", 822)
        .attr("height", 18)
        .attr("width", 18)
        .attr("fill", "rgb(31, 119, 180)");
    
    legendDoping
        .append("text")
        .attr("x", 816)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text("Riders with doping allegations");
        
});