CanvasCharts.prototype.drawVBars = function(data, stepValue){
    //start a little away from the y-axis
    var x = this.startX + 10;
    //create the gradient for the line
    this.createGradient();
    //number of data points we need to plot
    var length = data.length;
    for(var i = 0 ; i < length ; i += 1){
        //draw line from the current data point to the next one
        this.drawLine(x, (this.containerHeight - 45), x, (this.containerHeight - data[i]), {"lineWidth": this.barHeight, "strokeStyle": this.barGradient});
        x += stepValue;
    }
};
