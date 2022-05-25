/* eslint-disable no-undef */
function waterfall(root, data) {
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  const maxData = Math.max(...data.map((d) => d.execEndTimeMs));
  const leftMargin = 160;
  const svgHeight = 2000;
  const svgWidth = 1300;
  const numTicks = 10;
  const barHeight = d3.min([50, svgHeight / data.length]);
  const lineHeight = data.length * barHeight;

  const tooltip = d3.select(root).append('div').attr('class', 'tooltip');

  const waterfall = d3
    .select(root)
    .append('svg')
    .attr('class', 'waterfall')
    .attr('width', svgWidth + leftMargin)
    .attr('height', svgHeight);

  // Set the x-axis scale
  const x = d3
    .scaleLinear()
    .domain([0, maxData + 20])
    .range(['0px', `${svgWidth - leftMargin}px`]);

  // X-axis Label
  waterfall
    .append('g')
    .attr('transform', 'translate(' + svgWidth * 0.5 + ',15)')
    .attr('class', 'title')
    .append('text')
    .text('Time (ms)');

  // The main graph area
  const waterfallArea = waterfall
    .append('g')
    .attr('transform', 'translate(' + leftMargin + ',30)')
    .attr('class', 'gMainGraphArea');

  waterfallArea
    .append('g')
    .attr('transform', `translate(${leftMargin},15)`)
    .selectAll('line')
    .data(x.ticks(numTicks))
    .enter()
    .append('line')
    // .attr('class')
    .attr('x1', x)
    .attr('x2', x)
    .attr('y1', 0)
    .attr('y2', 0)
    .transition()
    .duration(1500)
    .attr('y2', lineHeight)
    .style('stroke', '#ccc');

  // Create the bars
  waterfallArea
    .append('g')
    .attr('transform', `translate(${leftMargin},15)`)
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'rectWF')
    .attr('x', function (d) {
      return x(d.execEndTimeMs - (d.execEndTimeMs - d.execStartTimeMs));
    })
    .attr('y', function (_, i) {
      return i * barHeight;
    })
    .style('fill', function (_, i) {
      return colorScale(i);
    })
    .attr('height', barHeight)
    .on('mouseover', function (event, d) {
      d3.selectAll('.rectWF').style('opacity', 0.2);
      d3.select(this).style('opacity', 1);
      return tooltip.style('opacity', 1).html(`
      <div>${Object.keys(d)
        .map((key) => '<p>' + key + ': ' + d[key] + '</p>')
        .join('')}</div>
      `);
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
  waterfallArea
    .append('g')
    .attr('transform', `translate(${leftMargin},15)`)
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
    .text(function (d) {
      return `${d.execEndTimeMs - d.execStartTimeMs}ms`;
    });

  // Set the numbering on the lines for axis
  waterfallArea
    .append('g')
    .attr('transform', `translate(${leftMargin},15)`)
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

  const ll = waterfallArea.append('g').attr('class', 'gAxis');

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
