/**
 * Created by migel on 22.08.16.
 */
var app = app || {};

app.StatusesItemView = Marionette.ItemView.extend({
  initialize: function (options) {
    this.days_data = options.days_data;
    this.passed = options.passed;
    this.failed = options.failed;
    this.error = options.error;
    this.stopped = options.stopped;
    this.abnormal = options.abnormal;
    this.container = options.container;
  },

  render: function () {
    $(this.container).highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Date/summary status chart'
      },
      xAxis: {
        categories: this.days_data
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Statuses amount'
        }
      },
      legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor: 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            formatter: function () {
              if (this.y != 0) {
                return this.y;
              }
            },
            color: 'white',
            style: {
              textShadow: '0 0 3px black'
            }
          }
        }
      },
      series: [{
        name: 'passed',
        color: 'green',
        data: this.passed
      }, {
        name: 'failed',
        color: 'red',
        data: this.failed
      }, {
        name: 'error',
        color: 'orange',
        data: this.error
      }, {
        name: 'stopped',
        color: 'black',
        data: this.stopped
      }, {
        name: 'abnormal',
        color: 'blue',
        data: this.abnormal
      }]
    });
  }
});