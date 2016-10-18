angular.module('weather.services', [])


.factory('GetWeather', function($http) {
  let fetch = function (url) {
    console.log('about to make get request with ', url)
    return $http({
      method: 'GET',
      url: url
    }).then(data => {
      return data.data;
    })
  }
  return {
    fetch: fetch
  }
})

.factory('SaveWeather', function($http) {
  let dbInsert = function(name, type, data) {
    var insert = {
      name: name,
      type: type,
      weatherData: data
    }
    return $http({
      method: 'POST',
      url: '/save',
      data: insert
    }).then(res => {
      return res;
    }, err => {
      alert(err.data)
    })
  };
  let getAll = function () {
    return $http({
      method: 'GET',
      url: '/save'
    }).then(res => {
      return res;
    })
  }
  return {
    getAll: getAll,
    dbInsert: dbInsert
  }
})

.factory('ColorRange', function() {
  //setting color map
  let pick = function(temp) {
    let ref = {
      xcold: { //10
        red: 20, green: 80, blue: 240
      },
      cold: { //25
        red: 60, green: 190, blue: 240
      },
      mcold: { //40
        red: 25, green: 220, blue: 120
      },
      med: { //55
        red: 220, green: 200, blue: 30
      },
      mhot: { //70
        red: 230, green: 160, blue: 20
      },
      hot: { //85
        red: 240, green: 60, blue: 20
      },
      xhot: { //100
        red: 200, green: 0, blue: 40
      }
    };
    //mixing colors
    if (temp < 10) {
      return `rgb(${ref.cold.red}, ${ref.cold.green}, ${ref.cold.blue})`
    } else if (temp > 100) {
      return `rgb(${ref.hot.red}, ${ref.hot.green}, ${ref.hot.blue})`
    } else {
      if (temp < 25){
        var percent = (temp - 10) / 15;
        var low = 'xcold';
        var high = 'cold';
      } else if (temp < 40) {
        var percent = (temp - 25) / 15;
        var low = 'cold';
        var high = 'mcold';
      } else if (temp < 55) {
        var percent = (temp - 40) / 15;
        var low = 'mcold';
        var high = 'med';
      } else if (temp < 70) {
        var percent = (temp - 55) / 15;
        var low = 'med';
        var high = 'mhot';
      } else if (temp < 85) {
        var percent = (temp - 70) / 15;
        var low = 'mhot';
        var high = 'hot';
      } else {
        var percent = (temp - 85) / 15;
        var low = 'hot';
        var high = 'xhot';
      }
      let red = ref[low].red + (ref[high].red - ref[low].red) * percent;
      let green = ref[low].green + (ref[high].green - ref[low].green) * percent;
      let blue = ref[low].blue + (ref[high].blue - ref[low].blue) * percent;
      return `rgb(${parseInt(red)}, ${parseInt(green)}, ${parseInt(blue)})`;
    }
  }
  return {
    pick: pick
  };
})