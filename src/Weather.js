import React, { useState } from "react";
import axios from "axios";
import WeatherInfo from "./WeatherInfo";
import WeatherForecast from "./WeatherForecast";
import Loader from "react-loader-spinner";
import "./Weather.css";

export default function Weather(props) {
  const [city, setCity] = useState(props.defaultCity);
  const [weatherApiData, setWeatherApiData] = useState({ loaded: false });
  const [unit, setUnit] = useState("celsius");

  // Integration of details from API
  function handleResponse(response) {
    setWeatherApiData({
      loaded: true,
      city: response.data.name,
      country: response.data.sys.country,
      coordinates: response.data.coord,
      date: response.data.dt * 1000,
      timezone: response.data.timezone,
      temperature: response.data.main.temp,
      feelslike: response.data.main.feels_like,
      wind: response.data.wind.speed,
      humidity: response.data.main.humidity,
      icon: response.data.weather[0].icon,
      description: response.data.weather[0].description,
    });
  }

  // Search current weather by city (API call)
  function searchWeather() {
    const apiKey = "2ccfd3ff79016dcd8763eb6a62db444b";
    let unit = "metric";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
    axios.get(apiUrl).then(handleResponse);
  }

  function handleSubmit(event) {
    event.preventDefault();
    searchWeather();
  }

  function updateCity(event) {
    setCity(event.target.value);
  }

  function currentLocationSearch(position) {
    const apiKey = "2ccfd3ff79016dcd8763eb6a62db444b";
    let unit = "metric";
    let currentLat = position.coords.latitude;
    let currentLong = position.coords.longitude;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLat}&lon=${currentLong}&appid=${apiKey}&units=${unit}`;
    axios.get(apiUrl).then(handleResponse);
  }

  function fetchLocation(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(currentLocationSearch);
  }

  if (weatherApiData.loaded) {
    return (
      <div className="Weather">
        <form onSubmit={handleSubmit}>
          <div className="row row-cols-3 gx-2 d-flex flex-nowrap">
            <div className="col-7">
              <input
                type="search"
                className="form-control "
                placeholder="Enter a city.."
                autoFocus="on"
                onChange={updateCity}
              />
            </div>
            <div className="col-auto">
              <button className="btn btn-warning" type="submit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#5C636A"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                </svg>
              </button>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-warning"
                type="button"
                onClick={fetchLocation}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#5C636A"
                  className="bi bi-geo-alt-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"></path>
                </svg>
              </button>
            </div>
          </div>
        </form>
        <WeatherInfo apiData={weatherApiData} unit={unit} setUnit={setUnit} />
        <WeatherForecast coordinates={weatherApiData.coordinates} unit={unit} />
      </div>
    );
  } else {
    searchWeather();
    return (
      <div className="loading">
        <h1>Loading...</h1>
        <Loader
          type="ThreeDots"
          color="#ffc107"
          height={120}
          width={120}
          timeout={90000}
        />
      </div>
    );
  }
}
