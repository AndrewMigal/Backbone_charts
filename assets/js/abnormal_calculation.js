/**
 * Created by migel on 22.08.16.
 */
var app = app || {};

app.standart_deviation =function (failed_arr) {
  var sum = failed_arr.reduce(function (a, b) {
    return a + b;
  });

  var mean = sum / failed_arr.length;

  function sample_variance() {
    var m = mean;
    var i = failed_arr.length,
        v = 0;

    while (i--) {
      v += Math.pow((failed_arr[i] - m), 2);
    }
    v /= failed_arr.length;
    return v;
  }

  var standart_deviation = Math.sqrt(sample_variance());

  var failed_arr1 = failed_arr;
  abnormal_arr = clearAbnormals(failed_arr1);

  for (var i = 0; i < failed_arr.length; i++) {
    current_deviation = failed_arr[i] - mean;
    if (current_deviation > 0 && current_deviation > 2 * standart_deviation) {
      abnormal_arr[i] = failed_arr[i];
      failed_arr1[i] = 0;
    }
  }
  return abnormal_arr;
};

function clearAbnormals(failed_arr) {
  var abnormal_arr = [];
  for (var i = 0; i < failed_arr.length; i++) {
    abnormal_arr[i] = 0;
  }
  return abnormal_arr;
}

app.iqr = function (failed_arr) {
  var failed_arr_iqr = [];
  failed_arr_iqr = JSON.parse(JSON.stringify(failed_arr));
  failed_arr_iqr.sort(function (a, b) {
    return a - b
  });

  var l = failed_arr_iqr.length;
  var LQ = failed_arr_iqr[Math.round(l / 4)];
  var UQ = failed_arr_iqr[Math.round(3 * l / 4)];
  var IQR = UQ - LQ;

  abnormal_arr = clearAbnormals(failed_arr);
  for (var i = 0; i < failed_arr.length; i++) {
    current_deviation = failed_arr[i] - UQ;
    if (current_deviation > 0 && current_deviation > 1.5 * IQR) {
      abnormal_arr[i] = failed_arr[i];
      failed_arr[i] = 0;
    }
  }
  return abnormal_arr;
};



