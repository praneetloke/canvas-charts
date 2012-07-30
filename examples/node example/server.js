var express = require('express');
var canvas = require('canvas');
var canvasCharts = require('../../canvas-charts.js');
var app = express.createServer();
var io = require('socket.io').listen(app);
var crypto = require('crypto');
var redis = require('redis'),
redisClient = redis.createClient();

//redis stuff
redisClient.on('error', function(err){
	console.log("redis error!");
	console.log(err);
});
//

app.configure(function(){
    app.use(express.bodyParser());
    app.set('views', __dirname + '/views');
});

app.get("/", function(req, res){
	res.sendfile(__dirname + '/views/client.html');
});

io.sockets.on('connection', function (socket) {
	console.log("socket connected");
	socket.on('generate graph', function (req) {
		console.log("request received...");
		//generate the md5 checksum hash
		var temp = req.xaxis.join() + "," + req.yaxis.join() + "," + req.data.join() + "," + req.width + "," + req.height;
		var data = req.data;
		var xaxis = req.xaxis;
		var yaxis = req.yaxis;
		console.log("md5 input string: " + temp);
		var hash = crypto.createHash('md5').update(temp).digest("hex");
		//check if redis already has the value for this hash
		redisClient.get(hash, function(err,  res){
			//console.log("*********got from redis: " + res);
			//if value is undefined then draw it
			if(typeof res === 'undefined' || res == null){
				var obj = {
				"gradientColor1": "#cd9603",
				"gradientColor2": "#f1de3f",
				"bgFillStyle": "#efefef",
				"borderStrokeStyle": "#000",
				"textFillStyle": "#000",
				"font": "Normal 12pt Helvetica Nueue Light",
				"lineStrokeStyle": "#000",
				"chartType": req.graphType
				};
				canvasCharts.configure(obj);
				//it is a good idea to set the height and width of the canvas based on your data array length
				//var height = (data.length < 5) ? data.length * 80 : data.length * 50;
				
				//but for an example...
				var height = (data.length < 5) ? 300 : 500;
				var width = xaxis.length * 80;
				//#graph is the id of the div that will hold the graph as either an img or canvas element itself...see showChart() in the source to modify it's behavior as needed
				var canvasCreated = canvasCharts.createCanvas(null, width, height);
				if(!canvasCreated){
					socket.emit('response', { 'error': "Could not create a canvas element. What are you using?" });
				}
				if(graphType == "" || graphType == "hbar"){
					canvasCharts.drawChart(xaxis, 90, yaxis, 35, data);
				}
				else if(graphType == "line"){
					canvasCharts.drawChart(yaxis, 50, xaxis, 35, data);
				}
				data = canvasCharts.showChart();
				//add this to redis
				redisClient.set(hash, data);
				redisClient.expire(hash, 60 * 60);
			}
			else{
				console.log("redis has what we need");
			}
			//res.writeHead(200, { 'Content-Type': 'text/html' });
			//res.end(canvasCharts.showChart());
			console.log("writing response...");
			socket.emit('response', { 'data': res });
			canvasCharts.destroyCanvas();
		});
	});
});

app.listen(8888);