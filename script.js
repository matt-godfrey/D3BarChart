
window.addEventListener('DOMContentLoaded', (event) => {
  

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
const req = new XMLHttpRequest();


let dataset = [];

  const svg = d3.select('svg')
        .attr('viewBox', '0 0 950 550');

    

  const width = +svg.attr('width');
  const height = +svg.attr('height');
  
 
  const padding = 20;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 }
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;


  let xScale;
  let yScale;
  let xAxisScale;
  let yAxisScale;

svg.append('text')
  .attr('class', 'y-label')
  .attr('x', '-200')
  .attr('y', '75')
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)')
  .text('Gross Domestic Product')



  let setScales = () => {

  yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, (d) => {
      return d.GDP 
    })])
    .range([0, height - padding]);

    xScale = d3.scaleLinear()
      .domain([0, dataset.length - 1])
      .range([margin.left + 20, width]);

    xAxisScale = d3.scaleTime()
      .domain([d3.min(dataset, (d) => {
        return new Date(d.date);
       
      }), d3.max(dataset, (d) => {
        return new Date(d.date);
       
      })])
      .range([padding, width - padding])


    yAxisScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, (d) => {
        return d.GDP
      })])
      .range([height - padding, 0])
}

let makeBars = (data) => {





let tooltipDiv = d3.select('#chart').append('div')
      .attr('class', 'tooltip')
      .attr('id', 'tooltip')
      .style('visibility', 'hidden')
      .style('position', 'absolute')
      // .style('width', 'auto' )
      // .style('height', 'auto')


  svg.selectAll('rect').data(dataset)
    .enter()
    .append('rect')
    .attr('x', (d, i) => {
      return xScale(i);
    })
    .attr('y', (d, i) => {
      return height - margin.bottom - yScale(d.GDP);
    })
    
    .attr('width', Math.floor(innerWidth / dataset.length))
    .attr('height', (d) => { return yScale(d.GDP) })
    .attr('fill', 'steelblue')
    .attr('data-date', (d) => {
      return d.date;
    })
    .attr('data-gdp', (d) => {
      return d.GDP;
    })
    .attr('class', 'bar')
    .on('mouseover', function (d, i) {

      let year = new Date(d.date).getFullYear();
      let month = new Date(d.date).getMonth();
     
      let str = getStr(month);

           tooltipDiv.transition()
                  .duration(50)
                  .style('visibility', 'visible')
                  .style('left', `${d3.event.pageX}`+"px")
                  .style('top', `${d3.event.pageY}`+"px")
                  .style('border', '1px solid black')
                  .style('height', '60px')
                  .style('width', '75px')
                  .style('border-radius', '5px')
                  .style('opacity', '0.6')
                  .style('background-color', 'gray')
                  .style('box-shadow', '2px 2px 2px 3px')

            tooltipDiv.text(year + " " + str + " $" + d.GDP + " Billion")
                      .attr('data-date', d.date)
    })
    .on('mouseout', function(d, i) {
      d3.select(this).transition()
           .duration(400)
           .attr('fill', 'steelblue')

           tooltipDiv.transition()
                  .style('visibility', 'hidden')

                  
    })
    
    

}

let getStr = (month) => {
  
  let str = "";
  if (month == 11) {
    
    str = "Q1"
    
  }
 else if (month == 2) {
    
    str = "Q2"
    
  }
  else if (month == 5) {
    
    str = "Q3"
    
  }
  else if (month == 8) {
    
    str = "Q4"
    
  } else {
    return
  }
return str
  
}

let setAxes = () => {

  let yAxis = d3.axisLeft(yAxisScale);
  let xAxis = d3.axisBottom(xAxisScale);
    svg.append('g')
      .call(xAxis)
      .attr('id', 'x-axis')
      .attr('transform', 'translate(20, ' + (height - margin.bottom) + ' )')
      
    svg.append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
      .attr('transform', 'translate(' + (margin.left + 20) + ', 0)')
      
}


req.open('GET', url, true);
req.send();
req.onload = function() {
    let json = JSON.parse(req.responseText);
   json.data.forEach(function(item, i) {
        dataset.push({date: item[0], GDP: item[1]});
        
    })
    

    setScales();
    setAxes();  
    makeBars(dataset); 
    

    }


})


