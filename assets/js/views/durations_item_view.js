/**
 * Created by migel on 22.08.16.
 */
var app = app || {};

app.DurationsItemView = Marionette.ItemView.extend({
  initialize: function (options) {
    this.data = options.data;
    this.days_data = options.days_data;
  },
  render: function () {
    $('#main-region').highcharts({
      title: {
        text: 'Day/Duration chart',
        x: -20
      },
      xAxis: {
        title: {
          text: 'Created at'
        },
        categories: this.days_data
      },
      yAxis: {
        tickInterval: 500,
        title: {
          text: 'Duration'
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      series: [{
        name: 'duration',
        color: 'orange',
        data: this.data
      }]
    });
  }
});
