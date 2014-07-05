
//maps a value from one range to another (linear interpolation)
Math.map = function(x, in_min, in_max, out_min, out_max) { return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min; };

function analyze(data)
{
	var output = new Array2D(256, 256, 0);
	for(var i = 0; i < data.length - 2; i++)
	{
		var curr = data[i];
		var next = data[i+1];

		output[curr][next]++;
	}

	normalize(output);
	return output;
}


/*
 * converts the data to a 0-255 scale, and then
 */
 /*
function normalize(data)
{
	var average = 0;

	data.forEach(function(v) {
		average += v;
	});

	average /= data.x * data.y;
	//average += 25;

	data.forEach(function(v, x, y, a) {
		//a[x][y] = Math.ceil(v / max);
		var val = (v / average);
		if(val > 1) { val = 1; }
		a[x][y] = val
	});
}
*/

function normalize(data)
{
	var max = 0;

	data.forEach(function(v) {
		if(v > max) { max = v; }
	});

	points = [0];
	data.forEach(function(v, x, y) {
		if(v != 0) //vast swaths of nothingness screws up the stats (I care most about the high end)
		{
			points.push(v);
		}
	});
	points.sort(function(a,b) { return a - b;});

	var Q1 = points[Math.round(points.length * 0.1)];
	var Q3 = points[Math.round(points.length * 0.9)];
	var IQR = Q3 - Q1;
	var thresh = 1.5 * IQR;

	var high = Q3 + thresh;
	high = high > max ? max : high;

	data.forEach(function(v, x, y, a) {
		var val = Math.map(v, 0, high, 0, 1);
		if(val > 1) { val = 1; }
		a[x][y] = val;
	});
}