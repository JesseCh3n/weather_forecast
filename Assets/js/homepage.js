var cityFormEl = document.querySelector('#cityname');
var cityButtonsEl = document.querySelector('#city-buttons');
var nameInputEl = document.querySelector('#username');
var repoContainerEl = document.querySelector('#repos-container');
var repoSearchTerm = document.querySelector('#repo-search-term');

const apiKey = 'dc15af11a8ecbd28152e9f41d885f99a';

var formSubmitHandler = function (event) {
  event.preventDefault();

  let cityname = cityFormEl.value.trim();

  if (cityname) {
    getUserRepos(cityname);
    const cities = readCitiesFromStorage();
    cities.push = cityname;
    saveCityToStorage(cities);
  } else {
    alert('Please enter a city name');
  }
};

var buttonClickHandler = function (event) {
  var city = event.target.getAttribute('data-language');

  if (language) {
    getFeaturedRepos(language);

    repoContainerEl.textContent = '';
  }
};

getCityWeather = function (place) {
  var apiUrl1 = 'http://api.openweathermap.org/geo/1.0/direct?q=' + place + '&limit=1&appid=' + apiKey;

  fetch(apiUrl1)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          let lat = data.lat;
          let lon = data.lon;
          var apiUrl2 = 'api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=metric&';
          fetch(apiUrl2)
            .then(function (response) {
              if (response.ok) {
                response.json().then(function (data) {
                  console.log(data);
                  displayWeather();
                })
              } else {
                alert('Error: ' + response.statusText);
              }
            })
            .catch(function (error) {
              alert('Unable to connect to openweathermap.org');
            })
        })
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to openweathermap.org');
    });
};

function readCitiesFromStorage() {
  let cities = localStorage.getItem('cities');
  if (cities) {
    cities = JSON.parse(cities);
  } else {
    let text = ' ';
    cities = [text];
  }
  return cities;
}

function saveCityToStorage(cities) {
  localStorage.setItem('cities', JSON.stringify(cities));
}

function displayButton() {
  let cities = localStorage.getItem('cities');
  if (readCitiesFromStorage) {
    for (i=0; i<cities.length; i++) {
      let btn = document.createElement("button");
      btn.setAttribute('class', 'btn');
      btn.innerHTML = cities[i];
      cityButtonsEl.appendChild(btn);
    }
  }
}

var displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    repoContainerEl.textContent = 'No repositories found.';
    return;
  }

  repoSearchTerm.textContent = searchTerm;

  for (var i = 0; i < repos.length; i++) {
    var repoName = repos[i].owner.login + '/' + repos[i].name;

    var repoEl = document.createElement('div');
    repoEl.classList = 'list-item flex-row justify-space-between align-center';

    var titleEl = document.createElement('span');
    titleEl.textContent = repoName;

    repoEl.appendChild(titleEl);

    var statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';

    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    repoEl.appendChild(statusEl);

    repoContainerEl.appendChild(repoEl);
  }
};

userFormEl.addEventListener('submit', formSubmitHandler);
languageButtonsEl.addEventListener('click', buttonClickHandler);
