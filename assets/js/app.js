var app = app || {};
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

function main() {
  var sessionCollection = new app.SessionCollection(dataObject.data);
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
  var __r = app.date_duration_data_parse(crt, dur, days);
  var __ret = app.date_status_data_parse(crt, sum_sts, days);

  var dur_sum = __r.dur_sum;
  var passed_arr = __ret.passed_arr;
  var error_arr = __ret.error_arr;

  var failed_err_cp = JSON.parse(JSON.stringify(__ret.failed_arr));

  var stopped_arr = __ret.stopped_arr;
  var date_duration_data = [];
  for (var i = 0; i < uniq_days.length; i++) {
    date_duration_data.push([uniq_days[i], dur_sum[i]]);
  }

  var duration_view = new app.DurationsItemView({data: date_duration_data, days_data: uniq_days});
  duration_view.render();
  var status_view = new app.StatusesItemView({
    days_data: uniq_days,
    passed: passed_arr,
    error: error_arr,
    failed: __ret.failed_arr,
    stopped: stopped_arr,
    abnormal: app.standart_deviation(__ret.failed_arr),
    container: '#container'
  });
  status_view.render();
  var status_view_irq = new app.StatusesItemView({
    days_data: uniq_days,
    passed: passed_arr,
    error: error_arr,
    failed: __ret.failed_arr,
    stopped: stopped_arr,
    abnormal: app.iqr(failed_err_cp),
    container: '#container2'
  });
  status_view_irq.render();
}