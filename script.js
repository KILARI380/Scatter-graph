// Load the dataset (replace this with the URL if necessary)
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").then(data => {

    // Set up chart dimensions
    const margin = { top: 50, right: 30, bottom: 50, left: 60 };
    const width = 900 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3.select("#scatterplot")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set the scales for x and y axes
    const x = d3.scaleLinear()
        .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)])  // X scale for years
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Seconds)])  // Y scale for times
        .range([height, 0]);

    // Format the y-axis ticks to display time in %M:%S format
    const timeFormat = d3.timeFormat("%M:%S");

    // Add X axis
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format("d")));

    // Add Y axis with formatted time ticks
    svg.append("g")
        .attr("id", "y-axis")
        .call(d3.axisLeft(y).ticks(10).tickFormat(d => {
            const minutes = Math.floor(d / 60);
            const seconds = Math.floor(d % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }));

    // Create the dots for the scatterplot
    const tooltip = d3.select("#tooltip");

    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.Year))  // X position based on year
        .attr("cy", d => y(d.Seconds))  // Y position based on time in seconds
        .attr("r", 5)  // Radius of the dot
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => d.Seconds)
        .on("mouseover", function(event, d) {
            tooltip.style("display", "block")
                .attr("data-year", d.Year)
                .html(`${d.Name}: ${d.Nationality}<br>Year: ${d.Year}<br>Time: ${d.Time}`);
            
            // Get position of the mouse and place the tooltip accordingly
            const [xPos, yPos] = d3.pointer(event);
            tooltip.style("left", xPos + 10 + "px")
                .style("top", yPos - 25 + "px");
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
        });

    // Add title
    svg.append("text")
        .attr("id", "title")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .style("text-anchor", "middle")
        .style("font-size", "24px")
        .text("Scatterplot of Cyclist Times vs Year");

});
