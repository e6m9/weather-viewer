var weatherAPI = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=2ee7bf2ceaf4b8438eed774d0a68a53a';
var geoAPI = 'http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=2ee7bf2ceaf4b8438eed774d0a68a53a'
fetch
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    var results = data.results
    for (var i = 0; i < 10; i++) {
    }
  });

//replace "lat" 'long' 'city name' etc with variables? q={' + variable + '},


  // var tableBody = document.getElementById('repo-table');
  // var fetchButton = document.getElementById('fetch-button');
  
  // function getApi() {
  //   // fetch request gets a list of all the repos for the node.js organization
  //   var requestUrl = 'https://api.github.com/orgs/nodejs/repos';
  
  //   fetch(requestUrl)
  //     .then(function (response) {
  //       return response.json();
  //     })
  //     .then(function (data) {
  //       console.log(data)
  //       //Loop over the data to generate a table, each table row will have a link to the repo url
  //       for (var i = 0; i < data.length; i++) {
  //         // Creating elements, tablerow, tabledata, and anchor
  //         var createTableRow = document.createElement('tr');
  //         var tableData = document.createElement('td');
  //         var link = document.createElement('a');
  
  //         // Setting the text of link and the href of the link
  //         link.textContent = data[i].html_url;
  //         link.href = data[i].html_url;
  
  //         // Appending the link to the tabledata and then appending the tabledata to the tablerow
  //         // The tablerow then gets appended to the tablebody
  //         tableData.appendChild(link);
  //         createTableRow.appendChild(tableData);
  //         tableBody.appendChild(createTableRow);
  //       }
  //     });
  // }
  
  // fetchButton.addEventListener('click', getApi);
  