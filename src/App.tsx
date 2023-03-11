import React, { ChangeEvent, useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import { Chart } from './components/Chart';
import HourSelect from './components/HourSelect';
import { WeatherObject, StartingLocation } from './model';
import './styles.css';
import Loading from './components/Loading';
import { parseWeatherData, getChartLabels } from './utils';
import LocationSearchInput from './components/LocationSearchInput';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherObject | null>(null);
  const [weatherNextWeek, setWeatherNextWeek] = useState<WeatherObject | null>(
    null
  );
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [hour, setHour] = useState<number>(
    Math.floor(new Date().getHours() / 4) * 4
  );

  const [location, setLocation] = useState<StartingLocation>({
    latitude: '',
    longitude: '',
  });

  const getError = (error: unknown) => {
    if (error instanceof Error) return error.message;
    return String(error);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDate(value);
  };

  const getWeather = async () => {
    const unixDate = new Date(date).valueOf() / 1000;
    const currentDay = new Date(date).getDate();
    const followingWeek = new Date(date);
    followingWeek.setDate(currentDay + 8);
    const unixNextWeek = followingWeek.valueOf() / 1000;
    try {
      const request = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location.latitude},${location.longitude}/${unixDate}?key=${process.env.API_KEY}`
      );
      const response = await request.json();
      setWeather({ ...response });
      const request2 = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location.latitude},${location.longitude}/${unixNextWeek}?key=${process.env.API_KEY}`
      );
      const response2 = await request2.json();
      setWeatherNextWeek({ ...response2 });
    } catch (error) {
      console.log(getError(error));
    }
  };

  useEffect(() => {
    if (location.latitude.length > 0) {
      getWeather();
    }
  }, [date, location]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationObject = {
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        };
        setLocation(locationObject);
      },
      (error) => {
        // default is coordinates for NYC
        setLocation({
          latitude: '40.7128',
          longitude: '74.0060',
        });
      }
    );
  }, []);

  const handleLeftArrow = () => {
    const currentDay = new Date(date).getDate();
    const yesterday = new Date(date);
    yesterday.setDate(currentDay - 1);
    setDate(yesterday.toISOString().slice(0, 10));
  };

  const handleRightArrow = () => {
    const currentDay = new Date(date).getDate();
    const tomorrow = new Date(date);
    tomorrow.setDate(currentDay + 1);
    setDate(tomorrow.toISOString().slice(0, 10));
  };

  return (
    <div className='App'>
      <header className='header'>
        <span className='title'>Weather.io</span>
        <NavBar />
      </header>
      <section className='inputs_container'>
        <img
          src='/assets/leftDouble.png'
          className='arrow'
          onClick={handleLeftArrow}
        />
        <div>
          <LocationSearchInput setLocation={setLocation} />
          <input
            type='date'
            step='1'
            onChange={(e) => handleDateChange(e)}
            value={date}
            required
          />
          <HourSelect hour={hour} setHour={setHour} />
        </div>
        <img
          src='/assets/rightDouble.png'
          className='arrow'
          onClick={handleRightArrow}
        />
      </section>
      {(!weather || !weatherNextWeek) && location.latitude.length === 0 && (
        <Loading />
      )}
      {weather && weatherNextWeek && location.latitude.length > 0 && (
        <div className='chart_container'>
          <Chart
            chartData={parseWeatherData(hour, weather)}
            labels={getChartLabels(hour)}
            day={'Today'}
          />
          <Chart
            chartData={parseWeatherData(hour, weatherNextWeek)}
            labels={getChartLabels(hour)}
            day={'A Week From Today'}
          />
        </div>
      )}
    </div>
  );
};

export default App;
