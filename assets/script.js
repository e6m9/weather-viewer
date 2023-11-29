// set APIs as variables to be edited in order to be used
var baseCurrentAPI = 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=imperial&appid=2ee7bf2ceaf4b8438eed774d0a68a53a';
var baseWeatherAPI = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=imperial&appid=2ee7bf2ceaf4b8438eed774d0a68a53a';

// set up arrays for grabbing API endpoints and using them to generate html elements
var currentData = [];
var apiData = [];
var searchHistory = [];

// function to get the lat and lon from the geo API which takes city names
function getLocation() {
  var cityName = document.getElementById('searchFld').value;

  // grabs the html elements that are populated and then empties them so it can repopulate them
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

          // replaces lat and lon in the base API's with the lat and lon pulled from the geo API response
          var currentAPI = baseCurrentAPI.replace('{lat}', lat).replace('{lon}', lon);
          var weatherAPI = baseWeatherAPI.replace('{lat}', lat).replace('{lon}', lon);

          // converts the unix time in the response to a readable format, grabs the relevant data from the API, and creates elements to display that data
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

              var weatherHeader = document.createElement('div');
              weatherHeader.style.display = 'flex';
              weatherHeader.style.paddingTop = '4px';

              var cityDate = document.createElement('h4');
              var iconImage = document.createElement('img');

              cityDate.textContent = name + '  ' + date;
              iconImage.src = 'https://openweathermap.org/img/wn/' + icon + '.png';
              iconImage.alt = 'weather icon';
              iconImage.style.width = '5%';

              weatherHeader.appendChild(cityDate);
              weatherHeader.appendChild(iconImage);
              textBody.appendChild(weatherHeader);

              var temp = data.main.temp;
              var wind = data.wind.speed;
              var humid = data.main.humidity;

              textBody.innerHTML +=
                '<p>Temp: ' + temp + 'F</p>' +
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

              //  adds the data points to the history array and updates the history display
              addSearchToHistory(cityName);
              updateSearchHistoryDisplay();
            });

          // gets a response from the forecast API, puts the data into an array, creates elements to display the data, and saves the data to the history array
          fetch(weatherAPI)
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {

              var forecastBox = document.getElementById('forecastBox');
              var forecastHead = forecastBox.querySelector('h4');
          
              if (forecastHead) {
                forecastHead.innerHTML = '5-Day Forecast';
              }

              for (var i = 4; i < data.list.length; i += 8) {
                var unixTimeStamp = data.list[i].dt;
                var date = dayjs.unix(unixTimeStamp).format('M/DD');
                var icon = data.list[i].weather[0].icon;
                var temp = data.list[i].main.temp;
                var wind = data.list[i].wind.speed;
                var humid = data.list[i].main.humidity;

                var forecastRow = document.getElementById('forecastRow');
                var forecastCol = document.createElement('div');
                forecastCol.classList.add('col', 'mb-4');

                var forecastBlock = document.createElement('div');
                forecastBlock.classList.add('card', 'text-center');
                forecastBlock.style.paddingTop = '3px';
                forecastBlock.style.backgroundColor = 'rgb(20, 39, 71)';
                forecastBlock.style.color = 'white';

                forecastBlock.innerHTML =
                  '<h5>' +  date + '</h5>' +
                  '<img src="https://openweathermap.org/img/wn/' + icon + '.png" alt="Weather Icon">' +
                  '<p>Temp: ' + temp + 'F</p>' +
                  '<p>Wind: ' + wind + 'MPH</p>' +
                  '<p>Humidity: ' + humid + '%</p>';


                forecastCol.appendChild(forecastBlock);
                forecastRow.appendChild(forecastCol);

                apiData.push({
                  date: date,
                  icon: icon,
                  temp: temp,
                  wind: wind,
                  humid: humid
                });
              }

              updateSearchHistoryDisplay();
            });

          //if a city name is not entered correctly, the console logs a response, or if there is an error, it is logged in the console
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

// takes the search term, cityName, and adds it to the history array only if it isn't already there. A limit of 8 search terms has been set, anymore than that and the oldest one will be popped out of the array
function addSearchToHistory(search) {
  if (!searchHistory.includes(search)) {
    searchHistory.unshift(search);

    if (searchHistory.length > 8) {
      searchHistory.pop();
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }
}

// adds buttons to the history display labeled with the cityName from the history array
function updateSearchHistoryDisplay() {
  var historyDiv = document.getElementById('searchHistory');
  historyDiv.innerHTML = '';

  var historyContainer = document.createElement('div');
  historyContainer.classList.add('mt-2');

  for (var i = 0; i < searchHistory.length; i++) {
    var searchBtn = document.createElement('button');
    searchBtn.textContent = searchHistory[i];
    searchBtn.classList.add('btn', 'btn-secondary', 'mb-2', 'w-100');
    searchBtn.addEventListener('click', function () {
      document.getElementById('searchFld').value = this.textContent;
      getLocation();
    });
    historyContainer.appendChild(searchBtn);
  }
  historyDiv.appendChild(historyContainer);
}

// waits until all the html is loaded onto the page and then grabs the saved items in local storage to display them 
document.addEventListener('DOMContentLoaded', function () {
  var storedSearchHistory = localStorage.getItem('searchHistory');
  if (storedSearchHistory) {
    searchHistory = JSON.parse(storedSearchHistory);
    updateSearchHistoryDisplay();
  }
});

// adds event listener to the search button to run getLocation
document.getElementById('searchBtn').addEventListener('click', getLocation);

// adds event listener and function to clear the searchFld on click
document.getElementById('searchFld').addEventListener('click', function () {
  document.getElementById('searchFld').value = '';
})
