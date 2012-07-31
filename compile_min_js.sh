#!/bin/bash

echo "YUI Compressing canvas-charts.js"
java -jar yuicompressor-2.4.7.jar --type js canvas-charts.js  > canvas-charts.min.js