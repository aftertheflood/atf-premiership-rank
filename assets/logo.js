function update(){
		const shapes = [
				[[0,0],[0,6],[4,6]], //L
				[[3,0],[5,6],[6.5,.7],[8,6],[10,0]], //W
				[[9,6],[13,6],[13,0]] // L but backwards
		];
		const svg = d3.select('svg#logo');
		const size =svg.node().getBoundingClientRect(); 
		console.log(size);
		const xScale = d3.scaleLinear()
				.domain([0,13])
				.range([0,size.width]);
		const yScale = d3.scaleLinear()
				.domain([0,6])
				.range([0,size.height]);
		const line = d3.line()
				.x(d=>xScale(d[0]))
				.y(d=>yScale(d[1]))
		svg.selectAll('path')
				.data(shapes)
				.enter()
				.append('path')
				.attr('fill','none')
				.attr('stroke','white');
		
		svg.selectAll('path')
				// .attr('stroke-width',size.width/70)
				.attr('d', line);
}
window.addEventListener('resize', update);
update();
