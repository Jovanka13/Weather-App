let date = new Date();

let days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

let day = days[date.getDay()];

let hour = date.getHours();
if (hour < 10) {
    hour = `0${hour}`;
}

let minutes = date.getMinutes();
if (minutes < 10) {
    minutes = `0${minutes}`;
}

let currentDate = document.querySelector('#currentDate');
currentDate.innerHTML = `${day}, ${hour}:${minutes}`;

function searchCity(event) {
    event.preventDefault();
    let searchInput = document.querySelector('#search-input');
    let cityName = document.querySelector('#cityName');
    cityName.innerHTML = `${searchInput.value}`;

    let apiKey = "048b78666f0472fc710ab69d71249f35";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&units=metric`;
    

    axios.get(`${apiUrl}&appid=${apiKey}`).then(showCurrentWeather);
}

let form = document.querySelector('#search-form');
form.addEventListener('submit', searchCity);


//Forecast function
function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return days[day];
}

function displayForecast(response) {
    let forecast = response.data.daily;
    let forecastElement = document.querySelector('#weatherForecast');
    let forecastHTML = `<div class="row">`;

    forecast.forEach(function (forecastDay, index) {
        if (index > 0 && index < 6) {
            forecastHTML += `<div class="col">
                                <div class="row d-flex justify-content-center weeklyTemps">
                                    <span class="col-2 tempElement">${Math.round(forecastDay.temp.max)}°</span>
                                </div> 
                                
                                <div class="row d-flex justify-content-center weeklyTempsIcons">
                                    <span class="col-2 pictureWeather"><img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"></span>
                                </div>
                                <div class="row d-flex justify-content-center weekDays">
                                    <span class = "col-2 dayElement">${formatDay(forecastDay.dt)}</span>
                                </div>
                             </div>`;
        }
    });
    forecastHTML += `</div>`;
    forecastElement.innerHTML = forecastHTML;
}


//Forecast coordinates
function getForecast(coordinates) {
    let apiKey = "048b78666f0472fc710ab69d71249f35";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(displayForecast);
}

function showCurrentWeather(response) {
    let city = document.querySelector('#cityName');
    city.innerHTML = response.data.name;

    let todaysTemp = Math.round(response.data.main.temp);
    let h3 = document.querySelector('#currentTemperature');
    h3.innerHTML = `${currentTemperature}`;

    celsiusTemp = Math.round(response.data.main.temp);
    
    let windSpeed = response.data.wind.speed;
    let speedWind = document.querySelector('#windSpeed');
    speedWind.innerHTML = `Wind speed: ${windSpeed}mps`;

    let humidity = response.data.main.humidity;
    let humidityWeather = document.querySelector('#humidity');
    humidityWeather.innerHTML = `Humidity: ${humidity}%`;

    let humanPerception = Math.round(response.data.main.feels_like);
    let feelsLike = document.querySelector('#feelsLike');
    feelsLike.innerHTML = `Feels Like: ${humanPerception}°`;

    let weatherDescription = response.data.weather[0].main;
    let weatherDetails = document.querySelector('#cloudyOrNot');
    weatherDetails.innerHTML = `${weatherDescription}`;

    let weatherIcon = document.querySelector = document.querySelector('#iconWeather');
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);

    getForecast(response.data.coord);
}


//Locates the user and automatically display the data
function changeLocation(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiKey = "048b78666f0472fc710ab69d71249f35";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    axios.get(apiUrl).then(showCurrentWeather);
}

navigator.geolocation.getCurrentPosition(changeLocation);


//Default search
function defaultSearch(city) {
    let apiKey = "048b78666f0472fc710ab69d71249f35";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    axios.get(apiUrl).then(showCurrentWeather);
}

defaultSearch("Kavadarci");








