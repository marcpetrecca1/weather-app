import { WeatherObject } from './model';

export const isWeatherGood = (
  temperatures: number[],
  precipitationProbs: number[],
  humidities: number[]
) => {
  const isTemperatureGood = temperatures.every(
    (temp) => temp >= 60 && temp <= 75
  );
  const isPrecipitationGood = precipitationProbs.every((prob) => prob <= 10);
  const isHumidityGood = humidities.every((hum) => hum >= 25 && hum <= 75);
  return isTemperatureGood && isPrecipitationGood && isHumidityGood;
};

export const parseWeatherData = (hour: number, apiObject: WeatherObject) => {
  const dataForDisplayedHours = apiObject.days[0].hours
    ? [
        apiObject.days[0].hours?.[hour],
        apiObject.days[0].hours?.[hour + 1],
        apiObject.days[0].hours?.[hour + 2],
        apiObject.days[0].hours?.[hour + 3],
      ]
    : [];

  if (hour !== 20 && apiObject.days[0].hours) {
    dataForDisplayedHours.push(apiObject.days[0].hours?.[hour + 4]);
  }

  const data = {
    temperatures: dataForDisplayedHours?.map((hourData) => hourData.temp),
    precipitationProbs: dataForDisplayedHours?.map(
      (hourData) => hourData.precipprob
    ),
    humidities: dataForDisplayedHours?.map((hourData) => hourData.humidity),
    condition: apiObject.days[0].conditions,
    tempMax: apiObject.days[0].tempmax,
    tempMin: apiObject.days[0].tempmin,
  };
  return {
    ...data,
    isWeatherGood: isWeatherGood(
      data.temperatures,
      data.precipitationProbs,
      data.humidities
    ),
  };
};

export const getChartLabels = (hour: number) => {
  const labelsDictionary = {
    0: ['12am', '1am', '2am', '3am', '4am'],
    4: ['4am', '5am', '6am', '7am', '8am'],
    8: ['8am', '9am', '10am', '11am', '12pm'],
    12: ['12pm', '1pm', '2pm', '3pm', '4pm'],
    16: ['4pm', '5pm', '6pm', '7pm', '8pm'],
    20: ['8pm', '9pm', '10pm', '11pm', '12am'],
  };
  //@ts-ignore
  return labelsDictionary[hour];
};
