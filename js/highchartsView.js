define([], function () {

  var HighchartsView = Backbone.View.extend({

    initialize: function (config) {
      // default configuration
      this.config = {
        chart: {},
        xAxis: {
          type: 'datetime'
        },
        yAxis: [
          { // primary axis
            min: 0,
            max: 100,
            labels: {
              enabled: true
            },
            title: {
              text: 'Measure'
            }
          }, { // seconday axis
            min: 0,
            labels: {
              enabled: true
            },
            title: {
              text: 'Social'
            },
            opposite: true

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
        self.measureCollection.push(element);
        self.chart.addSeries({
          name: element.name,
          data: element.data,
          yAxis: element.yAxis
        }, redraw);
      }

      // apply
      if (measure.forEach === Array.prototype.forEach) {
        measure.forEach(addSeriesToChart);
      } else {
        addSeriesToChart(measure);
      }

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
          self.measureCollection.splice(measureIndex, 1);
          self.chart.series[measureIndex].remove(redraw);
        }

      }

      // apply
      if (measure.forEach === Array.prototype.forEach) {
        measure.forEach(removeSeriesFromChart);
      } else {
        removeSeriesFromChart(measure);
      }

      return this;
    }

  });
 
  return HighchartsView; 

});