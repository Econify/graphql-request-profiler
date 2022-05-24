function waterfall(attachTo, data) {
  const maxData = Math.max(...data.map((d) => d.execEndTimeMs));
  const svgHeight = 2000;
  const svgWidth = 1300;
  const numTicks = 10;
  const barHeight = d3.min([50, svgHeight / data.length]);
  const leftMargin = 160;
  const lineHeight = data.length * barHeight;
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  var tooltip = d3
    .select(attachTo)
    .append('div')
    .style('position', 'absolute')
    .style('opacity', 0)
    .style('width', '400px')
    .style('background-color', 'black')
    .style('color', 'white');

  // Append the chart and pad it a bit
  var chart = d3
    .select(attachTo)
    .append('svg')
    .attr('class', 'chart')
    .attr('width', svgWidth + leftMargin)
    .attr('height', svgHeight);

  // Set the x-axis scale
  var x = d3
    .scaleLinear()
    .domain([0, maxData + 20])
    .range(['0px', `${svgWidth - leftMargin}px`]);

  // X-axis Label
  chart
    .append('g')
    .attr('transform', 'translate(' + svgWidth * 0.5 + ',15)')
    .attr('class', 'gAxisLabel')
    .append('text')
    .text('Time (ms)');

  // The main graph area
  chart = chart
    .append('g')
    .attr('transform', 'translate(' + leftMargin + ',30)')
    .attr('class', 'gMainGraphArea');

  // Set the y-axis scale
  chart
    .append('g')
    .attr('transform', 'translate(' + leftMargin + ',15)')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'rectWF')
    .attr('x', function (d, i) {
      return x(d.execEndTimeMs - (d.execEndTimeMs - d.execStartTimeMs));
    })
    .attr('y', function (d, i) {
      return i * barHeight;
    })
    .style('fill', function (d, i) {
      return colorScale(i);
    })
    .attr('height', barHeight)
    .on('mouseover', function (event, d) {
      d3.selectAll('.rectWF').style('opacity', 0.2);
      d3.select(this).style('opacity', 1);
      return tooltip.style('opacity', 1).text(JSON.stringify(d, null, 2));
    })
    .on('mousemove', function (event) {
      return tooltip
        .style('opacity', 1)
        .style('top', event.pageY + 20 + 'px')
        .style('left', event.pageX + 'px');
    })
    .on('mouseout', function () {
      d3.selectAll('.rectWF').style('opacity', 1);
      return tooltip.style('opacity', 0);
    })
    // .transition()
    // .duration(1000)
    .attr('width', function (d, i) {
      return x(d.execEndTimeMs - d.execStartTimeMs);
    });

  // Set the values on the bars
  chart
    .append('g')
    .attr('transform', 'translate(' + leftMargin + ',15)')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'bar')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('x', function (d) {
      return x(d.execEndTimeMs - (d.execEndTimeMs - d.execStartTimeMs) / 2);
    })
    .attr('y', function (d, i) {
      return i * barHeight + barHeight * 0.5;
    })
    .style('pointer-events', 'none')
    .text(function (d) {
      return `${d.execEndTimeMs - d.execStartTimeMs}ms`;
    });

  // Set the vertical lines for axis
  chart
    .append('g')
    .attr('transform', 'translate(' + leftMargin + ',15)')
    .selectAll('line')
    .data(x.ticks(numTicks))
    .enter()
    .append('line')
    .attr('x1', x)
    .attr('x2', x)
    .attr('y1', 0)
    .attr('y2', 0)
    .transition()
    .duration(1500)
    .attr('y2', lineHeight)
    .style('stroke', '#ccc');

  // Set the numbering on the lines for axis
  chart
    .append('g')
    .attr('transform', 'translate(' + leftMargin + ',15)')
    .selectAll('.rule')
    .data(x.ticks(numTicks))
    .enter()
    .append('text')
    .attr('class', 'rule')
    .attr('x', x)
    .attr('y', 0)
    .attr('dy', -3)
    .attr('text-anchor', 'middle')
    .text(String);

  const ll = chart.append('g').attr('class', 'gAxis');

  // Set the base line at the left-most corner
  ll.append('line')
    .attr('x1', leftMargin)
    .attr('x2', leftMargin)
    .attr('y1', 15)
    .attr('y2', 15 + lineHeight)
    .style('stroke', '#000');

  ll.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('x', leftMargin - 10)
    .attr('y', function (d, i) {
      return i * barHeight + barHeight * 0.8;
    })
    .attr('dx', -5)
    .attr('dy', '0')
    .attr('text-anchor', 'end')
    .attr('alignment-baseline', 'middle')
    .text(function (d) {
      return d.location;
    });
}

waterfall('body', window.data);
