CanvasCharts.prototype.drawVBars = function(data, stepValue){
    // Create the gradient for the line:
    this.createGradient();

    // Start a little away from the y-axis:
    var baseX = this.startX + 12;

    // Draw a line for each data entry:
    for(var i = 0 ; i < data.length ; i += 1){
        // From the bottom up to the current data point:
        this.drawLine(
            baseX, this.containerHeight - 45,
            baseX, this.containerHeight - 45 - data[i],
            {
                "lineWidth": this.barHeight,
                "strokeStyle": this.barGradient
            }
        );

        x += stepValue;
    }
};
