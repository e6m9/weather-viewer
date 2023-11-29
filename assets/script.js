// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// DONE set up dayJS and UNIX to format the date
// DONE generate elements to occupy resultsBox
// DONE generate elements to occupy forecastBox
// use localStorage to save search history
// generate elements to display search history
// style document with 2 elements in one row, the second row being a column

var baseCurrentAPI = 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=imperial&appid=2ee7bf2ceaf4b8438eed774d0a68a53a';
var baseWeatherAPI = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=imperial&appid=2ee7bf2ceaf4b8438eed774d0a68a53a';

var currentData = [];
var apiData = [];

function getLocation() {
  var cityName = document.getElementById('searchFld').value;

  // add functionality to clear all created elements except for search history
  if (cityName !== '') {
    var geoAPI = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=2ee7bf2ceaf4b8438eed774d0a68a53a';

    fetch(geoAPI)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.length > 0) {
          var lat = data[0].lat;
          var lon = data[0].lon;

          var currentAPI = baseCurrentAPI.replace('{lat}', lat).replace('{lon}', lon);
          var weatherAPI = baseWeatherAPI.replace('{lat}', lat).replace('{lon}', lon);

          console.log('Current API:', currentAPI);
          console.log('Weather API:', weatherAPI);

          fetch(currentAPI)
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {

              // <div id="resultsBox">
              //   <div id="textCon"></div>
              //   <div id="forecastBox">
              //     <div id="forecastTable"></div>
              //   </div>
              // </div>

              var name = data.name;
              var unixTimeStamp = data.dt;
              var date = dayjs.unix(unixTimeStamp).format('M/DD/YYYY');
              var icon = data.weather[0].icon;

              var textBody = document.getElementById('textBox');

              var cityDate = document.createElement('h4');
              var iconImage = document.createElement('img');

              cityDate.textContent = name + '  ' + date;
              iconImage.src = 'https://openweathermap.org/img/wn/' + icon + '.png';
              iconImage.alt = 'weather icon';

              textBody.appendChild(cityDate);
              textBody.appendChild(iconImage);

              var temp = data.main.temp;
              var wind = data.wind.speed;
              var humid = data.main.humidity;

              textBody.innerHTML +=
                '<p>Temperature: ' + temp + 'F</p>' +
                '<p>Wind: ' + wind + 'MPH</p>' +
                '<p>Humidity: ' + humid + '%</p>';

              currentData.push({
                city: name,
                date: date,
                icon: icon,
                temp: temp,
                humid: humid,
                wind: wind
              });
              console.log('Current Weather:', currentData);
            });

          fetch(weatherAPI)
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              for (var i = 4; i < data.list.length; i += 8) {
                var name = document.getElementById('searchFld').value;
                var unixTimeStamp = data.list[i].dt;
                var date = dayjs.unix(unixTimeStamp).format('M/DD/YYYY');
                var icon = data.list[i].weather[0].icon;
                var temp = data.list[i].main.temp;
                var humid = data.list[i].main.humidity;
                var wind = data.list[i].wind.speed;

                var forecastBox = document.getElementById('forecastBox');

                var forecastBlock = document.createElement('div');
                forecastBlock.className = 'forecast-block';

                forecastBlock.innerHTML =
                  '<h5>' + name + ' ' + date + '</h5>' +
                  '<img src="https://openweathermap.org/img/wn/' + icon + '.png" alt="Weather Icon">' +
                  '<p>Temperature: ' + temp + 'F</p>' +
                  '<p>Wind: ' + wind + 'MPH</p>' +
                  '<p>Humidity: ' + humid + '%</p>';

                forecastBox.appendChild(forecastBlock);

                apiData.push({
                  city: name,
                  date: date,
                  icon: icon,
                  temp: temp,
                  humid: humid,
                  wind: wind
                });
              }

              console.log('API data:', apiData);
            });

        } else {
          console.log('No data in the API response');
        }
      })
      .catch(function (error) {
        console.error('Error fetching API:', error);
      });
  } else {
    console.log('City name is missing');
  }
}

document.getElementById('searchBtn').addEventListener('click', getLocation);
