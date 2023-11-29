var baseCurrentAPI = 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=imperial&appid=2ee7bf2ceaf4b8438eed774d0a68a53a';
var baseWeatherAPI = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=imperial&appid=2ee7bf2ceaf4b8438eed774d0a68a53a';

var currentData = [];
var apiData = [];
var searchHistory = [];

function getLocation() {
  var cityName = document.getElementById('searchFld').value;

  var textBody = document.getElementById('textBox');
  var forecastRow = document.getElementById('forecastRow');
  textBody.innerHTML = '';
  forecastRow.innerHTML = '';

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

              addSearchToHistory(cityName);
              updateSearchHistoryDisplay();
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
                var wind = data.list[i].wind.speed;
                var humid = data.list[i].main.humidity;

                var forecastRow = document.getElementById('forecastRow');
                var forecastCol = document.createElement('div');
                forecastCol.classList.add('col-md-2', 'mb-4');

                var forecastBlock = document.createElement('div');
                forecastBlock.classList.add('card', 'text-center');

                forecastBlock.innerHTML =
                  '<h5>' + name + ' ' + date + '</h5>' +
                  '<img src="https://openweathermap.org/img/wn/' + icon + '.png" alt="Weather Icon">' +
                  '<p>Temperature: ' + temp + 'F</p>' +
                  '<p>Wind: ' + wind + 'MPH</p>' +
                  '<p>Humidity: ' + humid + '%</p>';
                  

                forecastCol.appendChild(forecastBlock);
                forecastRow.appendChild(forecastCol);

                apiData.push({
                  city: name,
                  date: date,
                  icon: icon,
                  temp: temp,
                  wind: wind,
                  humid: humid
                });
              }

              updateSearchHistoryDisplay();
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

function addSearchToHistory(search) {
  if (!searchHistory.includes(search)) {
    searchHistory.unshift(search);

    if (searchHistory.length > 8) {
      searchHistory.pop();
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }
}

function updateSearchHistoryDisplay() {
  var historyDiv = document.getElementById('searchHistory');
  historyDiv.innerHTML = '';
  for (var i = 0; i < searchHistory.length; i++) {
    var searchBtn = document.createElement('button');
    searchBtn.textContent = searchHistory[i];
    searchBtn.classList.add('btn', 'btn-secondary', 'mr-2');
    searchBtn.addEventListener('click', function () {
      document.getElementById('searchFld').value = this.textContent;
      getLocation();
    });
    historyDiv.appendChild(searchBtn);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var storedSearchHistory = localStorage.getItem('searchHistory');
  if (storedSearchHistory) {
    searchHistory = JSON.parse(storedSearchHistory);
    updateSearchHistoryDisplay();
  }
});


document.getElementById('searchBtn').addEventListener('click', getLocation);
