var CanvasCharts = function(){
    this.container = null;
    this.containerWidth = '';
    this.containerHeight = '';
    this.canvasEl = null;
    this.context = null;
    //text rotation doesn't work!
    this.rotate = false;
    this.angle = 0;
    //
    this.gradientColor1 = "#cdeb8e";
    this.gradientColor2 = "#a5c956";
    this.textFillStyle = "#666";
    this.lineStrokeStyle = "#000";
    this.borderStrokeStyle = "#000";
    this.bgFillStyle = "#fff";
    this.font = "";
    this.startX = 45;
    this.xAxisStart = 10;
    this.yAxisLeft = 40;
    this.xAxisLineWidth = 1;
    this.yAxisLineWidth = 1;
    //the defaults will be calculated once the container height is known
    this.startY = 0;

    //this height is for each bar that will be drawn in the canvas
    this.barHeight = 10;
    //default is a horizontal bar chart
    this.chartType = "hbar";
};

CanvasCharts.prototype.configure = function(obj){
    if(obj.hasOwnProperty("bgFillStyle")){
        this.bgFillStyle = obj.bgFillStyle;
    }
    if(obj.hasOwnProperty("borderStrokeStyle")){
        this.borderStrokeStyle = obj.borderStrokeStyle;
    }
    if(obj.hasOwnProperty("rotate")){
        this.rotate = obj.rotate;
    }
    if(obj.hasOwnProperty("angle")){
        this.angle = obj.angle;
    }
    if(obj.hasOwnProperty("textFillStyle")){
        this.textFillStyle = obj.textFillStyle;
    }
    if(obj.hasOwnProperty("lineStrokeStyle")){
        this.lineStrokeStyle = obj.lineStrokeStyle;
    }
    if(obj.hasOwnProperty("startX")){
        this.startX = obj.startX;
    }
    if(obj.hasOwnProperty("xAxisStart")){
        this.xAxisStart = obj.xAxisStart;
    }
    if(obj.hasOwnProperty("yAxisLeft")){
        this.yAxisLeft = obj.yAxisLeft;
    }
    if(obj.hasOwnProperty("startY")){
        this.startY = obj.startY;
    }
    if(obj.hasOwnProperty("chartType")){
        this.chartType = obj.chartType;
    }
    if(obj.hasOwnProperty("gradientColor1")){
        this.gradientColor1 = obj.gradientColor1;
    }
    if(obj.hasOwnProperty("gradientColor2")){
        this.gradientColor2 = obj.gradientColor2;
    }
    if(obj.hasOwnProperty("font")){
        this.font = obj.font;
    }
    //set to true to draw the actual data point as text next to the bar
    if(obj.hasOwnProperty("drawDataText")){
        this.drawDataText = obj.drawDataText;
    }
};

CanvasCharts.prototype.isCanvasSupported = function(){
    return !!document.createElement('canvas').getContext;
};

CanvasCharts.prototype.createCanvas = function(container, width, height){
    this.containerWidth = width;
    this.containerHeight = height;
    if(container != null){
    //resize the container to make sure the container that encompasses the canvas is as big
        container.style.width = this.containerWidth + "px";
        container.style.height = this.containerHeight + "px";
    }
    //
    this.container = container;
    var canvasEl = null;
    if(typeof document !== 'undefined'){
        canvasEl = document.createElement('canvas');
    }
    //if you are using this for a node app then add var Canvas = require('canvas'); to your server
    else if(typeof canvas !== 'undefined'){
        canvasEl = new canvas(this.containerWidth, this.containerHeight);
    }

    if(canvasEl == null){
        console.log("Could not create a canvas element! What are you using?");
        return false;
    }
    this.canvasEl = canvasEl;
    canvasEl.id = "canvas1";
    //set the actual drawing size
    canvasEl.width = this.containerWidth;
    canvasEl.height = this.containerHeight;
    //set the canvas size
    canvasEl.style.width = this.containerWidth + "px";
    canvasEl.style.height = this.containerHeight + "px";
    if(this.startY == 0){
        this.startY = this.containerHeight - 70;
    }
    this.context = canvasEl.getContext('2d');
    var context = this.context;
    // scale 2x for devices with twice the pixel ratio (Retina)
    if(window.devicePixelRatio == 2) {
        //set the actual drawing size
        canvasEl.width = this.containerWidth * 2;
        canvasEl.height = this.containerHeight * 2;
        context.scale(2, 2);
    }
    this.drawRectBorder(0, 0, this.containerWidth, this.containerHeight, this.borderStrokeStyle);
    this.drawRect(0, 0, this.containerWidth, this.containerHeight, this.bgFillStyle);
    //set text baseline and font type
    context.font = "normal 12px sans-serif";
    context.textBaseline = 'top';
    return true;
};

CanvasCharts.prototype.drawRectBorder = function(startX, startY, endX, endY, strokeStyle){
    var context = this.context;
    context.strokeStyle = strokeStyle;
    context.strokeRect(startX, startY, endX, endY);
};

CanvasCharts.prototype.drawRect = function(startX, startY, endX, endY, bgFillStyle){
    var context = this.context;
    context.fillStyle = bgFillStyle;
    context.fillRect(startX, startY, endX, endY);
};

/*Draws a horizontal bar graph with all labels.*/
CanvasCharts.prototype.drawChart = function(xAxis, xAxisStep, yAxis, yAxisStep, data){
    var context = this.context;
    if(context != null){
        //first draw the x-axis and its labels
        this.drawLine(this.xAxisStart, this.containerHeight - 40, this.containerWidth - 10, this.containerHeight - 40, {"lineWidth": this.xAxisLineWidth});
        if(xAxisStep != null && xAxis != null){
            this.drawXAxisLabels(xAxis, xAxisStep, this.containerHeight - 30, this.rotate, this.angle);
        }
        //draw the y-axis and its labels
        this.drawLine(this.yAxisLeft, 10, this.yAxisLeft, this.containerHeight - 10, {"lineWidth": this.yAxisLineWidth});
        if(yAxis != null && yAxisStep != null){
            this.drawYAxisLabels(yAxis, yAxisStep, 10);
        }

        this.xScale = (this.containerWidth - this.startX)/xAxis[xAxis.length-1];
        if(this.chartType == "hbar"){
            //now draw the bars
            this.drawHBars(data, yAxisStep);
        }
        else if(this.chartType == "line"){
            if(typeof this.drawLineSeries === 'function'){
                this.drawLineSeries(data, xAxisStep);
            }
            else{
                console.log("Could not find the line drawing function. Did you forget to add the 'cc.line.js' file?");
            }
        }
        else if(this.chartType == "vbar"){
            if(typeof this.drawVBars === 'function'){
                this.drawVBars(data, xAxisStep);
            }
            else{
                console.log("Could not find the vbars drawing function. Did you forget to add the 'cc.vbar.js' file?");
            }
        }
    }
    else{
        console.log("Context is null. Cannot draw!");
    }
};

CanvasCharts.prototype.drawXAxisLabels = function(labels, stepValue, y, rotate, angle){
    if(!labels){
        return;
    }
    var length = labels.length;
    var startX = this.startX;
    var context = this.context;
    if(rotate){
        this.rotateCanvas(context, angle);
    }
    for(var i = 0 ; i < length ; i += 1){
        if(i == 0){
            this.drawText(labels[i], startX, y);
            //console.log("startX: " + startX);
        }
        else {
            startX += stepValue;
            this.drawText(labels[i], startX, y);
        }
    }
    if(rotate){
        //restore canvas to original orientation
        context.restore();
    }
};

CanvasCharts.prototype.drawYAxisLabels = function(labels, stepValue, x){
    if(!labels){
        return;
    }
    var length = labels.length;
    var startY = this.startY;
    for(var i = 0 ; i < length ; i += 1){
        if(i == 0){
            this.drawText(labels[i], x, startY);
        }
        else {
            startY -= stepValue + 10;
            this.drawText(labels[i], x, startY);
        }
    }
};

CanvasCharts.prototype.drawText = function(text, x, y){
    var context = this.context;
    if(this.font != ""){
        context.font = this.font;
    }
    context.fillStyle = this.textFillStyle;
    context.fillText(text, x, y);
};

CanvasCharts.prototype.rotateCanvas = function(context, angle){
     context.save();
     //context.translate(newx, newy);
     context.rotate(angle);
};

CanvasCharts.prototype.drawLine = function(startX, startY, endX, endY, config){
    var context = this.context;
    if(config){
        context.strokeStyle = (config.hasOwnProperty("strokeStyle")) ? config.strokeStyle : this.lineStrokeStyle;
        context.lineWidth = (config.hasOwnProperty("lineWidth")) ? config.lineWidth : 1;
        context.lineCap = (config.hasOwnProperty("lineCap")) ? config.lineCap : "square";
    }
    else{
        context.strokeStyle = this.lineStrokeStyle;
        context.lineWidth = 10;
        context.lineCap = "square";
    }
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
    context.closePath();
};

CanvasCharts.prototype.drawCircle = function(x, y, radius, config){
    var strokeStyle = "#000000";
    var fillStyle = "#000000";
    if(config){
        strokeStyle = (config.hasOwnProperty("strokeStyle"))? config.strokeStyle : "#000000";
        fillStyle = (config.hasOwnProperty("fillStyle"))? config.fillStyle : "#000000";
    }
    var context = this.context;
    // Create the yellow face
    context.strokeStyle = strokeStyle;
    context.fillStyle = fillStyle;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI*2, true);
    context.closePath();
    context.stroke();
    context.fill();
};

CanvasCharts.prototype.createGradient = function(){
    var context = this.context;
    var barGradient = context.createLinearGradient(0, 0, 300, 0);
    barGradient.addColorStop(0, this.gradientColor1);
    barGradient.addColorStop(1, this.gradientColor2);
    this.barGradient = barGradient;
};

CanvasCharts.prototype.drawHBars = function(data, yStepSize){
    if(!data){
        console.log("data is undefined! Please pass an array containing at least one number.");
        return;
    }
    //create the gradient for the bars we will draw
    this.createGradient();
    var context = this.context;
    var y = this.startY + 10;
    var startX = this.startX + 1;
    var length = data.length;
    var obj = {"lineWidth": this.barHeight, "strokeStyle": this.barGradient};
    for(var i = 0 ; i < length ; i += 1){
        var endX = startX + (this.xScale * data[i]);
        this.drawLine(startX, y, endX, y, obj);
        if(this.drawDataText){
            this.drawText(data[i], endX + 8, y - 10);
        }
        //update the y co-ordinate
        y -= yStepSize + 10;
    }
};

/**
* Draws the canvas element inside the container element(recommended for
* future gesture events).
*/
CanvasCharts.prototype.showChart = function(){
    /*var img = document.createElement("IMG");
    img.id = "imageChart";
    img.width = this.containerWidth;
    img.height = this.containerHeight;*/

    //container is not null so insert the canvas into it
    if(this.container != null && this.canvasEl != null){
        this.container.innerHTML = "";
        //comment this line and uncomment the rest if you want to use an IMG element instead of a canvas to display the graph.
        this.container.appendChild(this.canvasEl);
        /*img.src = this.canvasEl.toDataURL();
        this.container.appendChild(img);*/
    }
    //no container..return the dataURL
    else{
        return this.canvasEl.toDataURL();
    }
};

CanvasCharts.prototype.destroyCanvas = function(){
    this.context = null;
    this.canvasEl = null;
    //empty the html inside the container
    this.container.innerHTML = "";
    this.container = null;
    console.log("canvas destroyed");
};

if(typeof module !== "undefined"){module.exports = new CanvasCharts();}
