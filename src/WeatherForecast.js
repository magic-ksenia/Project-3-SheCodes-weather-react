import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherForecastDay from "./WeatherForecastDay";
import "./WeatherForecast.css";
import Loader from "react-loader-spinner";

export default function WeatherForecast(props) {
  let [loaded, setLoaded] = useState(false);
  let [forecastApiData, setForecastApiData] = useState(null);

  useEffect(() => {
    setLoaded(false);
  }, [props.coordinates]);

  // Search daily forecast by coordinates (API call)
  function handleResponse(response) {
    setForecastApiData(response.data.daily);
    setLoaded(true);
  }

  function loadForecast() {
    const apiKey = "2ccfd3ff79016dcd8763eb6a62db444b";
    let unit = "metric";
    let lat = props.coordinates.lat;
    let lon = props.coordinates.lon;
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${apiKey}&units=${unit}`;
    axios.get(apiUrl).then(handleResponse);
  }

  if (loaded) {
    return (
      <div className="WeatherForecast">
        <div className="row">
          {forecastApiData.map(function (dailyForecast, index) {
            if (index < 5) {
              return (
                <div className="col" key={index}>
                  <WeatherForecastDay
                    dayData={dailyForecast}
                    unit={props.unit}
                  />
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
    );
  } else {
    loadForecast();
    return (
      <div className="loading">
        <h6>Loading...</h6>
        <Loader
          type="ThreeDots"
          color="#ffc107"
          height={100}
          width={100}
          timeout={90000}
        />{" "}
      </div>
    );
  }
}
