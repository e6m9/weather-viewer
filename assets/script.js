var baseWeatherAPI = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=imperial&appid=2ee7bf2ceaf4b8438eed774d0a68a53a';
var baseGeoAPI = 'http://api.openweathermap.org/geo/1.0/direct?q=&limit=1&appid=2ee7bf2ceaf4b8438eed774d0a68a53a'


function getLocation() {
  var cityName = document.getElementById('searchField').value;

  if (cityName !== '') {
    var geoAPI = 'http://api.openweathermap.org/geo/1.0/direct?q=&limit=' + cityName + '&limit=1&appid=2ee7bf2ceaf4b8438eed774d0a68a53a';

    fetch(geoAPI)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.length > 0) {
          var lat = data[0].lat;
          var lon = data[0].lon;

          var weatherAPI = baseWeatherAPI.replace('{lat}', lat).replace('{long}', lon);

          console.log('Weather API:', weatherAPI);

          fetch(weatherAPI)
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              for (var i = 4; i < data.list.length; i += 8) {
                var temp = data.list[i].main.temp;
                var humid = data.list[i].main.humidity;
                var icon = data.list[i].weather[0].icon;
                var wind = data.list[i].wind.speed;
                var date = data.list[i].dt_text;
              }
            })

            // 1, 4, 7 10, 13  5th object out of 4, 12, 20, 28, 36
            //[{0,1,2}, {3,4,5}, {6,7  ,8}, {9,10,11}, {12,13,14,15, 
            // 16, 17, 18, 19, 20, 21, 22, 23
        } else {
          console.log('no data in the api response');
        }
      })
      .catch(function (error) {
        console.error('error fetching api:', error);
      });
  } else {
    console.log('city missing dude');
  }
}

document.getElementById('searchBtn').addEventListener('click', getLocation());

