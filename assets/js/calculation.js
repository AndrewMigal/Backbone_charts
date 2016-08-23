/**
 * Created by migel on 22.08.16.
 */
var app = app || {};

app.date_duration_data_parse = function (crt, dur, days) {
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
};

app.date_status_data_parse = function (crt, sum_sts, days) {
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