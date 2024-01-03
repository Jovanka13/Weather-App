function currentTime() {
  let date = new Date(); 
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  let session = "AM";

  let days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  
  let day = days[date.getDay()];

  if(hh === 0){
      hh = 12;
  }
  if(hh > 12){
      hh = hh - 12;
      session = "PM";
   }

   hh = (hh < 10) ? "0" + hh : hh;
   mm = (mm < 10) ? "0" + mm : mm;
   ss = (ss < 10) ? "0" + ss : ss;
    
  let time = `${day}, ${hh}:${mm}:${ss} ${session}`; 

  document.querySelector("#currentDate").innerHTML = time; 
  let t = setTimeout(() => {currentTime()}, 1000);
}

currentTime();


let form = document.querySelector("#search-form");
form.addEventListener("submit", onFormSubmit);
getWeather("Skopje");

function onFormSubmit(event) {
  event.preventDefault();
  if(document.querySelector("#search-input").value.length > 0) {
    searchCity();
  } else {
    alert("City field is empty");
  }
}

function searchCity() {
  let searchInput = document.querySelector("#search-input");
  let cityName = document.querySelector("#cityName");
  cityName.innerHTML = `${searchInput.value}`;

  getWeather(searchInput.value);
}

function getWeather(city) {
  let apiKey = "048b78666f0472fc710ab69d71249f35";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;

  fetch(`${apiUrl}&appid=${apiKey}`)
    .then((response) => response.json())
    .then((data) => showCurrentWeather(data));
}

function showCurrentWeather(response) {
  
  if (response.cod === "404") {
    document.querySelector("#search-input").value = '';
    document.querySelector("#cityName").innerHTML = '';
    alert("Enter a valid city name.");
    return;
  }

  let city = document.querySelector("#cityName");
  city.innerHTML = response.name;

  let todayTemp = Math.round(response.main.temp);
  let h3 = document.querySelector("#currentTemperature");
  h3.innerHTML = `${todayTemp}`;

  let windSpeed = response.wind.speed;
  let speedWind = document.querySelector("#windSpeed");
  speedWind.innerHTML = `Wind speed: ${windSpeed}mps`;

  let humidity = response.main.humidity;
  let humidityWeather = document.querySelector("#humidity");
  humidityWeather.innerHTML = `Humidity: ${humidity}%`;

  let humanPerception = Math.round(response.main.feels_like);
  let feelsLike = document.querySelector("#feelsLike");
  feelsLike.innerHTML = `Feels Like: ${humanPerception}°`;

  let weatherDescription = response.weather[0].main;
  let weatherDetails = document.querySelector("#cloudyOrNot");
  weatherDetails.innerHTML = `${weatherDescription}`;

  let weatherIcon = document.querySelector("#iconWeather");
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
  );

  getForecast(response.coord);
}

function getForecast(coords) {
  let apiKey = "048b78666f0472fc710ab69d71249f35";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${
    coords.lat
  }&lon=${coords.lon}&exclude=${[
    "hourly",
    "current",
    "alerts",
    "minutely",
  ]}&units=metric&appid=${apiKey}`;
  fetch(`${apiUrl}`)
    .then((response) => response.json())
    .then((data) => displayForecast(data));
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return days[day];
}

function displayForecast(response) {
  // console.log(response);
  let forecast = response.daily;

  let forecastElement = document.querySelector("#weatherForecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach((dayForecast, index) => {
    if (index > 0 && index < 7) {
      forecastHTML += `<div class="col gy-5">
                                <div class="weeklyTemps">
                                    <span class="tempElementMax">${Math.round(
                                      dayForecast.temp.max
                                    )}°</span>
                                    <span class="tempElementMin">${Math.round(
                                      dayForecast.temp.min
                                    )}°</span>
                                </div> 
                                <div>
                                <img src="http://openweathermap.org/img/wn/${
                                 dayForecast.weather[0].icon
                               }@2x.png" alt="" class="bg-primary rounded" width="50">
                               </div>
                                <div class ="dayElement">${formatDay(
                                  dayForecast.dt
                                )}</div>
                        </div>`;
    }
  });

  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
