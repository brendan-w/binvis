//Written by Brendan Whitfield


"use strict";


/*
 * Array2D Constructor
 * 
 * new Array2D(<Array2D>);
 * new Array2D(<x>, <y>;)
 */
var Array2D = function() {

	/*
	 * Properties / Settings
	 */

	var _this = this;
	this.default_value = 0;

	/*
	 * Constructor
	 */
	var construct = function() {
		this.__assert__.totalArgs("constructor", [1,2,3], arguments);

		switch(arguments.length)
		{
			case 1: //copy constructor
				_this.__assert__.isArray2D("constructor", arguments[0]);

				var old = arguments[0];
				_this.__build__(old.x, old.y, old.default_value);

				_this.forEach(function(v, x, y, a) {
					a[x][y] = old[x][y];
				});
				break;

			case 2: //normal Array2D constructor
				_this.__assert__.areNumbers("constructor", arguments[0], arguments[1]);
				_this.__assert__.validDimensions("constructor", arguments[0], arguments[1]);
				_this.__build__(arguments[0], arguments[1], 0);
				break;

			case 3: //normal Array2D constructor, with default value parameter
				_this.__assert__.areNumbers("constructor", arguments[0], arguments[1]);
				_this.__assert__.validDimensions("constructor", arguments[0], arguments[1]);
				_this.__build__.apply(_this, arguments);
				break;
		}
	};

	//Start
	construct.apply(this, arguments);
}; //End constructor


/*
 * Internal functions
 */

Array2D.prototype.__assert__ = {
	totalArgs:function(sourceName, nums, args) {
		for(var i = 0; i < nums.length; i++)
		{
			if(nums[i] === args.length) { return; }
		}
		throw "Array2D Error [" + sourceName + "]: wrong number of arguments";
	},

	areNumbers:function(sourceName) {
		for(var i = 1; i < arguments.length; i++)
		{
			if(isNaN(arguments[i]))
			{
				throw "Array2D Error [" + sourceName + "]: argument not a number";
			}
		}
	},

	isFunction:function(sourceName, callback) {
		if((callback === undefined) || !(callback instanceof Function))
		{
			throw "Array2D Error [" + sourceName + "]: callback is not a function";
		}
	},

	inBounds:function(sourceName, x, y, w, h) {
		switch(arguments.length)
		{
			case 3:
				if(!this.inBounds(x, y))
				{
					throw "Array2D Error [" + sourceName + "]: array index (" + x + ", " + y + ") out of bounds";
				}
				break;
			case 5:
				if(!this.inBounds(x, y, w, h))
				{
					throw "Array2D Error [" + sourceName + "]: rectangular area (" + x + ", " + y + ", " + w + ", " + h + ") out of bounds";
				}
				break;

		}
	},

	validDimensions:function(sourceName, x, y) {
		if((x <= 0) || (y <= 0))
		{
			throw "Array2D Error [" + sourceName + "]: can't create array with dimensions (" + x + ", " + y + ")";
		}
	},

	isArray2D:function(sourceName, obj) {
		if(!(obj instanceof Array2D))
		{
			throw "Array2D Error [" + sourceName + "]: parameter must be an Array2D object";
		}
	}
};


Array2D.prototype.__build__ = function(nx, ny, def) {

	this.x = nx;
	this.y = ny;
	this.default_value = def !== undefined ? def : this.default_value;

	for(var x = 0; x < this.x; x++)
	{
		this[x] = {};
		for(var y = 0; y < this.y; y++)
		{
			this[x][y] = this.default_value;
		}
	}
};


/*
 * API functions
 */

//inBounds(x, y)
//inBounds(x, y, w, h)
Array2D.prototype.inBounds = function(x, y, w, h) {
	this.__assert__.totalArgs("inBounds", [2,4], arguments);
	switch(arguments.length)
	{
		case 2:
			return (x >= 0) && (x < this.x) && (y >= 0) && (y < this.y);
			break;
		case 4:
			return this.inBounds(x, y) && this.inBounds(x+w-1, y+h-1);
			break;
	}
};

Array2D.prototype.forEach = function(callback) {
	this.__assert__.totalArgs("forEach", [1], arguments);
	this.__assert__.isFunction("forEach", callback);

	for(var x = 0; x < this.x; x++)
	{
		for(var y = 0; y < this.y; y++)
		{
			callback(this[x][y], x, y, this);
		}
	}
};

Array2D.prototype.forGroup = function(x, y, w, h, callback) {
	this.__assert__.totalArgs("forGroup", [5], arguments);
	this.__assert__.areNumbers("forGroup", x, y, w, h);
	this.__assert__.isFunction("forGroup", callback);
	this.__assert__.inBounds("forGroup", x, y, w, h);

	for(var cx = x; cx < x+w; cx++)
	{
		for(var cy = y; cy < y+h; cy++)
		{
			callback(this[cx][cy], cx, cy, this);
		}
	}
};

Array2D.prototype.forRow = function(y, callback) {
	this.__assert__.totalArgs("forRow", [2], arguments);
	this.__assert__.areNumbers("forRow", y);
	this.__assert__.isFunction("forRow", callback);
	this.__assert__.inBounds("forRow", 0, y);

	for(var x = 0; x < this.x; x++)
	{
		callback(this[x][y], x, y, this);
	}
};

Array2D.prototype.forCol = function(x, callback) {
	this.__assert__.totalArgs("forCol", [2], arguments);
	this.__assert__.areNumbers("forCol", x);
	this.__assert__.isFunction("forCol", callback);
	this.__assert__.inBounds("forCol", x, 0);

	for(var y = 0; y < this.y; y++)
	{
		callback(this[x][y], x, y, this);
	}
};


//fill()
//fill(value)
Array2D.prototype.fill = function(value) {
	value = value === undefined ? this.default_value : value;

	this.forEach(function(v, x, y) {
		this[x][y] = value;
	});
};


Array2D.prototype.setGroup = function(x, y, w, h, value) {
	this.__assert__.totalArgs("setGroup", [4, 5], arguments);
	this.__assert__.areNumbers("setGroup", x, y, w, h);

	value = value === undefined ? this.default_value : value;

	for(var cx = x; cx < x+w; cx++)
	{
		for(var cy = y; cy < y+h; cy++)
		{
			this[cx][cy] = value;
		}
	}
};

Array2D.prototype.row = function(y) {
	this.__assert__.totalArgs("row", [1], arguments);
	this.__assert__.areNumbers("row", y);
	this.__assert__.inBounds("row", 0, y);

	var array = new Array();
	for(var x = 0; x < this.x; x++)
	{
		array[x] = this[x][y];
	}
	return array;
};



Array2D.prototype.col = function(x) {
	this.__assert__.totalArgs("col", [1], arguments);
	this.__assert__.areNumbers("col", x);
	this.__assert__.inBounds("col", x, 0);

	var array = new Array();
	for(var y = 0; y < this.y; y++)
	{
		array[y] = this[x][y];
	}
	return array;
};

//setRow(y)
//setRow(y, value)
Array2D.prototype.setRow = function(y, value) {
	this.__assert__.totalArgs("setRow", [1, 2], arguments);
	this.__assert__.areNumbers("setRow", y);
	this.__assert__.inBounds("setRow", 0, y);

	value = value === undefined ? this.default_value : value;

	for(var x = 0; x < this.x; x++)
	{
		this[x][y] = array[x];
	}
};

//setCol(y)
//setCol(y, value)
Array2D.prototype.setCol = function(x, value) {
	this.__assert__.totalArgs("setCol", [1, 2], arguments);
	this.__assert__.areNumbers("setCol", x);
	this.__assert__.inBounds("setCol", x, 0);

	value = value === undefined ? this.default_value : value;

	for(var y = 0; y < this.y; y++)
	{
		this[x][y] = array[y];
	}
};



Array2D.prototype.spliceRow = function(array) {

};

Array2D.prototype.spliceCol = function(array) {
	
};

//resize(_x)
//resize(_x, _y)
//resize(_x, _y, x_)
//resize(_x, _y, x_, y_)
Array2D.prototype.resize = function(_x, _y, x_, y_) {
	this.__assert__.totalArgs("resize", [1,2,3,4], arguments);

	_x = (_x === undefined) || (isNaN(_x)) ? 0 : _x;
	_y = (_y === undefined) || (isNaN(_y)) ? 0 : _y;
	x_ = (x_ === undefined) || (isNaN(x_)) ? 0 : x_;
	y_ = (y_ === undefined) || (isNaN(y_)) ? 0 : y_;

	//compute new dimensions
	var nx = this.x + _x + x_;
	var ny = this.y + _y + y_;

	if((nx < 1) || (ny < 1))
	{
		console.log("Resize Error: contraction not possible, will result in zero sized array"); return this;
	}
	else if((nx !== 0) && (ny !== 0)) //if it requires any changing
	{
		//save a copy of this array, and rebuild for new dimensions
		this.__build__(nx, ny, this.default_value);
		var _this = this; //because of callback function below

		existingData.forEach(function(v, x, y) {
			//destination coordinates
			var dx = x + x_;
			var dy = y + y_;
			if(_this.inBounds(dx, dy))
			{
				_this[dx][dy] = existingData[x][y];
			}
		});

	}
};

Array2D.prototype.crop = function(x, y, w, h) {
	this.__assert__.totalArgs("crop", [4], arguments);
	this.__assert__.areNumbers("crop", x, y, w, h);
	this.__assert__.inBounds("crop", x, y, w, h);

	this.resize((x+w)-this.x, (y+h)-this.y, -x, -y);
};

//shift(x, y)
//shift(x, y, wrap)
Array2D.prototype.shift = function(x, y, wrap) {
	this.__assert__.totalArgs("shift", [2,3], arguments);
	this.__assert__.areNumbers("shift", x, y);

	wrap = (wrap === undefined) || (typeof wrap !== "boolean") ? true : wrap;

	if((x !== 0) && (y !== 0))
	{
		this.resize(-x, -y, x, y);
	}
};

Array2D.prototype.rotate = function(clockwise) {

};

Array2D.prototype.invertX = function() {
	var _this = this;
	var existingData = new Array2D(this);
	existingData.forEach(function(v, x, y, a) {
		_this[x][y] = existingData[a.x - x - 1][y];
	});
};

Array2D.prototype.invertY = function() {
	var _this = this;
	var existingData = new Array2D(this);
	existingData.forEach(function(v, x, y, a) {
		_this[x][y] = existingData[x][a.y - y - 1];
	});
};

//log()
//log(renderFunction)
Array2D.prototype.log = function(renderFunction) {

	if((renderFunction === undefined) || !(renderFunction instanceof Function))
	{
		renderFunction = function(data) { return data; }; //default render function
	}

	function genChars(c, l)
	{
		var str = "";
		for(var i = 0; i < l; i++) { str += c; }
		return str;
	}

	function padLeft(str, len)
	{
		var space = genChars(" ", len - str.length);
		str = space + str;
		return str;
	}

	function padRight(str, len)
	{
		var space = genChars(" ", len - str.length);
		str = str + space;
		return str;
	}

	var maxYWidth = String(this.y - 1).length;
	var maxElementWidth = 0;
	this.forEach(function(v) {
		var width = String(v).length;
		if(width > maxElementWidth)
		{
			maxElementWidth = width;
		}
	});

	var header = genChars(" ", maxYWidth + 1) + genChars("_", (maxElementWidth + 1) * this.x) + "_";
	console.log(header);

	for(var y = 0; y < this.y; y++)
	{
		var line = padLeft(String(y), maxYWidth) + "| ";
		for(var x = 0; x < this.x; x++)
		{
			var element = String(renderFunction(this[x][y], x, y, this));
			line += padRight(element, maxElementWidth + 1);
		}
		console.log(line);
	}
};
