
var dropzone;
var canvas;
var ctx;

var tools;
var file_info;
var img_size;
var download_button;

var name;
var size;
var finished_data = null;


function preprocess(dataString)
{
	data = [];
	for(var i = 0; i < dataString.length; i++)
	{
		data.push(dataString.charCodeAt(i));
	}
	return data;
}

function render()
{
	var px = parseInt(img_size.value);
	canvas.setAttribute("width", px);
	canvas.setAttribute("height", px);

	if(finished_data != null)
	{
		file_info.innerHTML = name + " (" + size + " bytes)";
		ctx.fillStyle = "rgb(0,0,20)";
		ctx.fillRect(0,0,px,px);
		ctx.fillStyle = "rgb(255,255,255)";

		finished_data.forEach(function(v, x, y) {
			ctx.globalAlpha = v;
			var x = Math.map(x, 0, finished_data.x - 1, 0, px - 1);
			var y = Math.map(y, 0, finished_data.y - 1, 0, px - 1);
			var w = px / finished_data.x;
			ctx.fillRect(x, y, w, w);
		});
	}
}

function drop(e)
{
	e.stopPropagation();
	e.preventDefault();

	var files = e.dataTransfer.files;

	if(files.length >= 1)
	{
		var f = files[0];
		var reader = new FileReader();
		
		reader.onloadend = function(e) {
			dropzone.style.opacity = 0;
			tools.style.opacity = 1;
			
			var dataString = e.target.result;
			finished_data = analyze(preprocess(dataString)); //the "big" calls
			render();
		}

		name = f.name;
		size = f.size;
    	reader.readAsBinaryString(f);
	}
}

function dragOver(e)
{
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
}

function download(e)
{
	var dt = canvas.toDataURL('image/png');
    this.href = dt;
    this.setAttribute("download", name + ".png");
}

/*
 * Main functions
 */
function dependency_check()
{
	if (window.File && window.FileReader && window.FileList && window.Blob)
	{
		init();
	}
	else
	{
		alert('The File APIs are not supported by your browser');
	}
}

function init()
{
	dropzone = document.querySelector("#drop-zone");
	canvas = document.querySelector("canvas");
	ctx = canvas.getContext("2d");
	tools = document.querySelector("span.tools");
	file_info = tools.querySelector("div.file-info");
	img_size = tools.querySelector("input[type=number]");
	download_button = tools.querySelector("#download-image");

	// Setup the dnd listeners.
	dropzone.addEventListener('dragover', dragOver, false);
	dropzone.addEventListener('drop', drop, false);
	download_button.addEventListener('click', download);
	img_size.addEventListener('change', render);
}

window.onload = dependency_check;
