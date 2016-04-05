// Delay closure for the keyup
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

$("#target").keyup(function() {
	// Clear the SVG canvas with jQuery
	$(".chart").empty();
	// Nice little status update
	$("#status").html("Retrieving Information...");

	delay(function() {
  	generateGraph($("#target").val());
  	$("#status").html("Retrieving Information... Done");
  }, 1000);
});

function generateGraph(searchEntry) {

	// Set the margins and sizing of the container
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // Set the scale and range of the X and Y axis
    var x = d3.scale.ordinal()
    	.rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	// Make the container the set height and width and move is so there are margins
	var chart = d3.select(".chart")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	   .append("g")
	   	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var apiURL = "https://api.github.com/search/users?q=" + searchEntry;
	d3.json(apiURL, function (error, data) {
		// Set variable users to point to values of usernames from JSON
		var users = data.items;

		// Merge the logins into one string
		var userLogins = "";
		for (var i = 0; i < 5; i++) {
			userLogins+= (users[i].login).toLowerCase();
		}

		// Counter function and variables
		var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', 'Other'];
		var letterCount = [];

		function countingFunction(str, letter) {
			var count = 0;
			for (var i = 0; i < str.length; i++) {
				if (str[i] == letter) { count++ };
			}
			return count;
		}

		// Turn it into an object with count
		for (var i = 0; i < alphabet.length-1; i++) {
			var tempObj = {};
			tempObj['name'] = alphabet[i];
			tempObj['count'] = countingFunction(userLogins, alphabet[i]);
			letterCount.push(tempObj);
		}

		// Get the count for 'Others'
		function nonAlphaCount() {
			var AlphaTally = 0;
			letterCount.forEach(function(c) {
				AlphaTally += c.count;
			})
			return userLogins.length - AlphaTally;
		}
		console.log(nonAlphaCount);
		var AlphaObj = {};
		AlphaObj['name'] = 'Other';
		AlphaObj['count'] = nonAlphaCount();
		letterCount.push(AlphaObj);

		// Set the values of the X and Y access scales
		x.domain(letterCount.map(function(d) { return d.name; }));
		y.domain([0, d3.max(letterCount, function(d) { return d.count; })]);

		// Append the two axes to the chart
		chart.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

		chart.append("g")
	      .attr("class", "y axis")
	      .call(yAxis);

	    // Add the bars
		chart.selectAll(".bar")
			.data(letterCount)
		.enter().append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { return x(d.name); })
		      .attr("y", function(d) { return y(d.count); })
		      .attr("height", function(d) { return height - y(d.count); })
		      .attr("width", x.rangeBand());
	})

};