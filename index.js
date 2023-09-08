function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes},`;
}

//For Weather Info:Temp, Place, Humidity, Wind, Icon.
function displayTemperature(response) {
  let temperature = document.querySelector("#temperature");
  temperature.innerHTML = Math.round(response.data.main.temp);
  let city = document.querySelector("#place");
  city.innerHTML = response.data.name;
  let state = document.querySelector("#state");
  state.innerHTML = response.data.weather[0].description;
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.main.humidity;
  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed);
  let date = document.querySelector("#date");
  date.innerHTML = formatDate(response.data.dt * 1000);
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);

  celsius = Math.round(response.data.main.temp);

  //forecast
  getForecast(response.data.coord);
}

// Search Engine and Search Button
function search(city) {
  let apiKey = "dff5c692192605ee5ed7f95b423ae857";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayTemperature);
}
search("Abuja");

function handleSubmit(event) {
  event.preventDefault();
  let input = document.querySelector("#input");
  search(input.value);
}
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

// current location button
function searchLocation(position) {
  let apikey = "dff5c692192605ee5ed7f95b423ae857";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apikey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let current = document.querySelector("#current");
current.addEventListener("click", getCurrentLocation);

// For Temperature Conversion
function dislpayFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperature = document.querySelector("#temperature");
  let fahrenheitTemperature = (celsius * 9) / 5 + 32;
  temperature.innerHTML = Math.round(fahrenheitTemperature);
}
let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", dislpayFahrenheit);

let celsius = null;

function dislpayCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperature = document.querySelector("#temperature");
  temperature.innerHTML = celsius;
}
let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", dislpayCelsius);

//For week Days Forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weekdays");
  let forecastHTML = "";

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        ` <li>
            <div class="day">${formatDay(forecastDay.dt)}</div>
           
            <div class="emoji">
              <img
                src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png"
                alt=""
                width="42"
                id="icon"
              />
            </div>
            <div class="temp">${Math.round(
              forecastDay.temp.max
            )}° <span class="last">${Math.round(
          forecastDay.temp.min
        )}°</span></div>
          </li>`;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

// For weekdays forecast
function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "dff5c692192605ee5ed7f95b423ae857";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude={part}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}
