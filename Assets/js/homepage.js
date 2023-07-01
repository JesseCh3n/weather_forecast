var cityFormEl = document.querySelector('#city-form');
var cityButtonsEl = document.querySelector('#city-buttons');
var cityInputEl = document.querySelector('#cityname');
var date0El = document.querySelector('#date0');
var icon0El = document.querySelector('#icon0');
var temp0El = document.querySelector('#temp0');
var wind0El = document.querySelector('#wind0');
var hum0El = document.querySelector('#hum0');
var date1El = document.querySelector('#date1');
var icon1El = document.querySelector('#icon1');
var temp1El = document.querySelector('#temp1');
var wind1El = document.querySelector('#wind1');
var hum1El = document.querySelector('#hum1');
var date2El = document.querySelector('#date2');
var icon2El = document.querySelector('#icon2');
var temp2El = document.querySelector('#temp2');
var wind2El = document.querySelector('#wind2');
var hum2El = document.querySelector('#hum2');
var date3El = document.querySelector('#date3');
var icon3El = document.querySelector('#icon3');
var temp3El = document.querySelector('#temp3');
var wind3El = document.querySelector('#wind3');
var hum3El = document.querySelector('#hum3');
var date4El = document.querySelector('#date4');
var icon4El = document.querySelector('#icon4');
var temp4El = document.querySelector('#temp4');
var wind4El = document.querySelector('#wind4');
var hum4El = document.querySelector('#hum4');
var date5El = document.querySelector('#date5');
var icon5El = document.querySelector('#icon5');
var temp5El = document.querySelector('#temp5');
var wind5El = document.querySelector('#wind5');
var hum5El = document.querySelector('#hum5');

const apiKey = 'dc15af11a8ecbd28152e9f41d885f99a';
let tempCity = {
  name: ''
};
let fetchName = "";

var formSubmitHandler = function (event) {
  event.preventDefault();
  tempCity.name = '';
  let cityname = cityInputEl.value.trim();
  console.log(cityname);
  console.log(typeof(cityname));

  if (cityname) {
    getCityWeather(cityname);
    
    //console.log(cityname);
    let cities = readCitiesFromStorage();
    if (cities == null) {
      tempCity.name = getCityWeather(cityname);
      cities = [tempCity];
      saveCityToStorage(cities);
      displayButton();
      //console.log(cities);
    } else {
      if (!checkDuplicate(cityname, cities)) {
        tempCity.name = getCityWeather(cityname);
        console.log(tempCity.name);
        cities.push(tempCity);
        console.log(cities);
        saveCityToStorage(cities);
        displayButton();
        console.log(cities);
      }
    }
  } else {
    alert('Please enter a city name');
  }
};

var buttonClickHandler = function (event) {
  let element = event.target;
  if (element.matches("button") == true) {
    let cityname = element.textContent;
    getCityWeather(cityname);
  }
};

var getCityWeather = function (place) {
  fetchName = '';
  var apiUrl1 = 'http://api.openweathermap.org/geo/1.0/direct?q=' + place + '&limit=1&appid=' + apiKey;
  console.log(apiUrl1);

  fetch(apiUrl1)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data[0].name);
          console.log(data[0].lat);
          console.log(data[0].lon);
          fetchName = data[0].name;
          let lat = data[0].lat;
          let lon = data[0].lon;
          var apiUrl2 = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=metric';
          console.log(apiUrl2);
          fetch(apiUrl2)
            .then(function (response) {
              if (response.ok) {
                response.json().then(function (data) {
                  console.log(data);
                  const d = dayjs(data.list[0].dt_txt.split(" ")[0]).format('DD MMM YYYY');
                  date0El.innerHTML = d;
                  const icn = data.list[0].weather[0].icon;
                  var iconUrl = 'https://openweathermap.org/img/wn/' + icn + '@2x.png';
                  icon0El.href = iconUrl;
                  temp0El.innerHTML = data.list[0].main.temp + '&deg;C';
                  wind0El.innerHTML = data.list[0].wind.speed + 'mph';
                  hum0El.innerHTML = data.list[0].main.humidity + '%';

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
    return fetchName;
};

function readCitiesFromStorage() {
  let cities = localStorage.getItem('cities');
  if (cities) {
    cities = JSON.parse(cities);
  }
  return cities;
}

function saveCityToStorage(cities) {
  localStorage.setItem('cities', JSON.stringify(cities));
}

function checkDuplicate(name1, names) {
  for (i=0; i < names.length; i++) {
    console.log(names.length);
    if (name1 == names[i].name) {
      return true;
    }
  }
  return false;
}

function displayButton() {
  cityButtonsEl.innerHTML = "";
  let cities = readCitiesFromStorage();
  if (cities == null) {
    return;
  } else {
    for (i=0; i<cities.length; i++) {
      let btn = document.createElement("button");
      btn.setAttribute('class', 'btn');
      btn.innerHTML = cities[i].name;
      console.log(btn.innerHTML);
      console.log(cities[i].name);
      cityButtonsEl.appendChild(btn);
    }
  }
}


displayButton();
cityFormEl.addEventListener('submit', formSubmitHandler);
cityButtonsEl.addEventListener('click', buttonClickHandler);

