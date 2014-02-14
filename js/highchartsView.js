define([], function () {

  var HighchartsView = Backbone.View.extend({

    initialize: function (config) {
      // default configuration
      this.config = {
        chart: {
          zoomType: 'xy'
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: [
          { // primary axis
            min: 0,
            max: 100,
            labels: {
              enabled: false
            },
            title: {
              text: ''
            },
            // alignTicks: false

          }, { // seconday axis
            min: 0,
            labels: {
              enabled: false
            },
            title: {
              text: ''
            },
            opposite: true,
            // alignTicks: false
          }
        ],
        legend: {enabled: false},
        title: {text: ''},
        tooltip: {
          enabled: false
        },
        series: [{}]
      }

      this.measureCollection = [];
      this.axesCollection = [{id: 0, count: 0, min: 0, max: 0}, {id: 1, count: 0, min: 0, max: 0}];

      return this;
    },

    render: function () {
      this.config.chart.renderTo = this.el.id;
      this.chart = new Highcharts.Chart(this.config);
      this.chart.series = [];
      return this;
    },

    redrawChart: function () {
      this.chart.redraw();
      return this;
    },

    addMeasure: function (measure, redraw) {
      // no measures
      if (measure === null || measure === undefined) {
        return this; 
      }

      // default redraw to true unless false
      if (redraw !== false) {
        redraw = true;
      }

      // reference funcitons
      var self = this;
      var addSeriesToChart = function (element, index, array) {
        // keep track of measures
        self.measureCollection.push(element);

        // add series to highchart
        self.chart.addSeries({
          name: element.name,
          data: element.data,
          yAxis: element.yAxis
        }, redraw);

        // count those linked to axis
        var axis = _.findWhere(self.axesCollection, {id: element.yAxis});
        axis.count++;
      }

      // apply
      if (measure.forEach === Array.prototype.forEach) {
        measure.forEach(addSeriesToChart);
      } else {
        addSeriesToChart(measure);
      }

      self.updateAxes();

      return this;
    },

    removeMeasure: function (measure, redraw) {

      // no measures
      if (measure === null || measure === undefined) {
        return this; 
      }

      // default redraw to true unless false
      if (redraw !== false) {
        redraw = true;
      }

      var self = this;
      var removeSeriesFromChart = function (element, index, array) {

        var measureIndex, measureFound = false;
        for (var i = 0, len = self.measureCollection.length; i < len; i++) {
          if (self.measureCollection[i].uid === measure.uid) { 
            measureFound = true;
            measureIndex = i;
          } 
        }

        if (measureFound) {
          // remove measures from view and highchart
          self.measureCollection.splice(measureIndex, 1);
          self.chart.series[measureIndex].remove(redraw);

          // count those linked to axis
          var axis = _.findWhere(self.axesCollection, {id: element.yAxis});
          axis.count--;
        }

      }

      // apply
      if (measure.forEach === Array.prototype.forEach) {
        measure.forEach(removeSeriesFromChart);
      } else {
        removeSeriesFromChart(measure);
      }

      self.updateAxes();

      return this;
    },

    updateAxes: function () {

      var self = this;
      
      // update min/max
      for (var i = 0; i < self.measureCollection.length; i++) {
        self.axesCollection[self.measureCollection[i].yAxis].min = self.axesCollection[self.measureCollection[i].yAxis].min < self.chart.series[i].dataMin 
          ? self.axesCollection[self.measureCollection[i].yAxis].min
          : self.chart.series[i].dataMin
          ;
        self.axesCollection[self.measureCollection[i].yAxis].max = self.axesCollection[self.measureCollection[i].yAxis].max > self.chart.series[i].dataMax 
          ? self.axesCollection[self.measureCollection[i].yAxis].max
          : self.chart.series[i].dataMax
          ;
      }

      // hide / show left axis based on count
      if (self.axesCollection[0].count === 0) {
        self.axesCollection[0].min = 0;
        self.axesCollection[0].max = 0;
        self.chart.yAxis[0].update({
          labels: {
            enabled: false
          }
        });
      } else {
        self.chart.yAxis[0].update({
          labels: {
            enabled: true
          },
          min: self.axesCollection[0].min,
          max: self.axesCollection[0].max
        });
      }

      // hide / show right axis based on count
      if (self.axesCollection[1].count === 0) {
        self.axesCollection[1].min = 0;
        self.axesCollection[1].max = 0;
        self.chart.yAxis[1].update({
          labels: {
            enabled: false
          }
        });
      } else {
        self.chart.yAxis[1].update({
          labels: {
            enabled: true
          },
          min: self.axesCollection[1].min,
          max: self.axesCollection[1].max
        });
      }

      return this;
    }

  });
 
  return HighchartsView; 

});