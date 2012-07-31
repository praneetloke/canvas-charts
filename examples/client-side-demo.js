function demo(data, xaxis, yaxis, graphType) {
    //console.log(data);
    //console.log(axisx);
    //console.log(axisy);	
    
    //create the canvas chart instance
    var chartingCanvas = new CanvasCharts();
    if(chartingCanvas.isCanvasSupported()){
		var obj = {
			"gradientColor1": "#cd9603", 
			"gradientColor2": "#f1de3f", 
			"bgFillStyle": "#efefef", 
			"borderStrokeStyle": "#000",
			"textFillStyle": "#000",
			"font": "Normal 12pt Helvetica Nueue Light",
			"lineStrokeStyle": "#000",
			"chartType": graphType
		};
		chartingCanvas.configure(obj);
		//it is a good idea to set the height and width of the canvas based on your data array length
		//var height = (data.length < 5) ? data.length * 80 : data.length * 50;
		
		//but for an example...
		var height = (data.length < 5) ? 300 : 500;
		var width = xaxis.length * 80;
		//#graph is the id of the div that will hold the graph as either an img or canvas element itself...see showChart() in the source to modify it's behavior as needed
    	chartingCanvas.createCanvas(document.getElementById("graph"), width, height);
		if(graphType == "" || graphType == "hbar"){
			chartingCanvas.drawChart(xaxis, 90, yaxis, 35, data);
		}
		else if(graphType == "line"){
			chartingCanvas.drawChart(yaxis, 50, xaxis, 35, data);
		}
		else if(graphType == "vbar"){
			chartingCanvas.drawChart(yaxis, 50, xaxis, 35, data);
		}
    	chartingCanvas.showChart();
    }
	else{
		alert("canvas not supported! Please use a decent browser..");
		console.log("canvas not supported! Please use a decent browser..");
	}
}