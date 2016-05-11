var dataObject = {};

function handleFileSelect(evt) {
  var file = evt.target.files[0];
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: function (results) {
      dataObject = results;
      main();
    }
  });
}

$(document).ready(function () {
  $("#csv-file").change(handleFileSelect);
});

function date_duration_data_parse(crt, dur, days) {
  var dur_sum = [];
  for (var i = 0; i < crt.length;) {
    var cnt = dur[i];
    var flag = 1;
    for (var j = i + 1; j < crt.length; j++) {
      if (days[i] == days[j]) {
        cnt = cnt + dur[j];
        flag++;
      }
    }
    dur_sum.push(cnt);
    if (flag > 1) {
      i = i + flag;
    } else {
      i++;
    }
  }
  return {dur_sum: dur_sum}
}

function date_status_data_parse(crt, sum_sts, days) {
  var passed_arr = [];
  var error_arr = [];
  var failed_arr = [];
  var stopped_arr = [];
  for (var i = 0; i < crt.length;) {
    var passed_cnt = 0;
    var error_cnt = 0;
    var failed_cnt = 0;
    var stopped_cnt = 0;
    var flag1 = 1;
    if (sum_sts[i] == 'passed') {
      passed_cnt++;
    } else if (sum_sts[i] == 'error') {
      error_cnt++;
    } else if (sum_sts[i] == 'failed') {
      failed_cnt++;
    } else if (sum_sts[i] == 'stopped') {
      stopped_cnt++;
    }
    passed_arr.push(passed_cnt);
    error_arr.push(error_cnt);
    failed_arr.push(failed_cnt);
    stopped_arr.push(stopped_cnt);
    for (var j = i + 1; j < crt.length; j++) {
      if (days[i] == days[j]) {
        if (sum_sts[j] == 'passed') {
          passed_arr[passed_arr.length - 1]++;
          flag1++;
        } else if (sum_sts[j] == 'error') {
          error_arr[error_arr.length - 1]++;
          flag1++;
        } else if (sum_sts[j] == 'failed') {
          failed_arr[failed_arr.length - 1]++;
          flag1++;
        } else if (sum_sts[j] == 'stopped') {
          stopped_arr[stopped_arr.length - 1]++;
          flag1++;
        }
      }
    }
    i += flag1;
  }
  return {passed_arr: passed_arr, error_arr: error_arr, failed_arr: failed_arr, stopped_arr: stopped_arr};
}

function main() {
  var SessionCharts = new Marionette.Application();
  SessionCharts.SessionCollection = Backbone.Collection.extend({});
  SessionCharts.DurationsItemView = Marionette.ItemView.extend({
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
  SessionCharts.StatusesItemView = Marionette.ItemView.extend({
    initialize: function (options) {
      //this.data = options.data;
      this.days_data = options.days_data;
      this.passed = options.passed;
      this.failed = options.failed;
      this.error = options.error;
      this.stopped = options.stopped
    },
    render: function () {
      $('#container').highcharts({
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
        }]
      });
    }
  });

  var sessionCollection = new SessionCharts.SessionCollection(dataObject.data);
  var dur = sessionCollection.pluck("duration");
  var crt = sessionCollection.pluck("created_at");
  var sum_sts = sessionCollection.pluck("summary_status");
  var arrays_object = [dur, crt, sum_sts];
  _.map(arrays_object, function (num) {
    return num.pop();
  });
  var days = _.map(crt, function (num) {
    return num.split(/\s/)[0];
  });
  var uniq_days = _.uniq(days);
  var __r = date_duration_data_parse(crt, dur, days);
  var __ret = date_status_data_parse(crt, sum_sts, days);
  var dur_sum = __r.dur_sum;
  var passed_arr = __ret.passed_arr;
  var error_arr = __ret.error_arr;
  var failed_arr = __ret.failed_arr;
  var stopped_arr = __ret.stopped_arr;
  var date_duration_data = [];
  for (var i = 0; i < uniq_days.length; i++) {
    date_duration_data.push([uniq_days[i], dur_sum[i]]);
  }
  var duration_view = new SessionCharts.DurationsItemView({data: date_duration_data, days_data: uniq_days});
  var status_view = new SessionCharts.StatusesItemView({
    days_data: uniq_days,
    passed: passed_arr,
    error: error_arr,
    failed: failed_arr,
    stopped: stopped_arr
  });
  duration_view.render();
  status_view.render();
}
