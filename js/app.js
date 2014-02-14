define(['js/highchartsView.js'], function (HighchartsView) {
  
  function createFakeDataHighchart(num, yr, name, multiplier) {
    // variables
    var seriesCollection = [];

    function makeNewValues(years, multiplier) {
      var values = [];  
      for (var i = 0, len = years*365; i < len; i++) {
        var tempDate = new Date(24*1000*3600*(i+1))
        values.push([
            Date.UTC(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate()),
            (Math.random() * multiplier)
          ]);
      }
      return values;
    }

    // create a series
    for (var i = 0; i < num; i++) {
      seriesCollection.push({
        name: 'series' + name,
        data: makeNewValues(yr ? yr : 1, multiplier)
      });
    }

    return seriesCollection;
  }

  var chartView1 = new HighchartsView({
    el: '#chart1'
  });

  chartView1.render();

  $('#redraw').click(function (e) {
    chartView1.redrawChart();
  });

  var name = 0;
  $('#addMeasure').click(function (e) {
    var measure = createFakeDataHighchart(1,1, name++, 100)[0];

    var chartMeasure = JSON.parse(JSON.stringify(measure));
    chartMeasure.uid = Date.now().toString();
    chartMeasure.yAxis = 0;

    chartView1.addMeasure(chartMeasure);
    $('body').append('<button class="removeMeasure" id="' + chartMeasure.uid + '">Click to Remove Measure ' + chartMeasure.name + '</button>')
    $('#' + chartMeasure.uid).click(function (e) {
      chartView1.removeMeasure(chartMeasure);
      this.remove();
    });
  });

  $('#addDachis').click(function (e) {
    var measure = createFakeDataHighchart(1,1, name++, 586461613)[0];

    var chartMeasure = JSON.parse(JSON.stringify(measure));
    chartMeasure.uid = Date.now().toString();
    chartMeasure.yAxis = 1;

    chartView1.addMeasure(chartMeasure);
    $('body').append('<button class="removeMeasure" id="' + chartMeasure.uid + '">Click to Remove Dachis ' + chartMeasure.name + '</button>')
    $('#' + chartMeasure.uid).click(function (e) {
      chartView1.removeMeasure(chartMeasure);
      this.remove();
    });
  });

});