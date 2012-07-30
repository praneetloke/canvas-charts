CanvasCharts.prototype.drawLineSeries = function(data, stepValue){
    var x = this.startX;
    //create the gradient for the line
    this.createGradient();
    //number of data points we need to plot
    var length = data.length;
    for(var i = 0 ; i < length ; i += 1){
        //we will be advancing one more than the for() loop so check length
        if( i != length - 1){
            //draw a circle to "plot" the data point
            this.drawCircle(x, (this.containerHeight - data[i]), 3, {"fillStyle": "#58c3f4"});
            //draw line from the current data point to the next one
            this.drawLine(x, (this.containerHeight - data[i]), (x + stepValue), (this.containerHeight - data[i+1]), {"lineCap": "round", "lineWidth": 1.25, "strokeStyle": this.barGradient});
            x += stepValue;
        }
    }
};