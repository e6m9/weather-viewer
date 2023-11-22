fetch('https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={2ee7bf2ceaf4b8438eed774d0a68a53a}')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    var results = data.results
    for (var i = 0; i < 10; i++) {
    }
  });