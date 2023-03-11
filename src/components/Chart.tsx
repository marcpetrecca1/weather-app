import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  labels: string[];
  chartData: {
    temperatures: number[];
    precipitationProbs: number[];
    humidities: number[];
    condition: string;
    tempMax: number;
    tempMin: number;
    isWeatherGood: boolean;
  };
  day: string;
}

export const Chart: React.FC<ChartProps> = ({ labels, chartData, day }) => {
  const isDataPresent =
    chartData.temperatures.length ||
    chartData.precipitationProbs.length ||
    chartData.humidities.length;

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.25,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: chartData.isWeatherGood
          ? 'Great Weather!'
          : 'Not So Great Weather!',
      },
    },
    scales: {
      temp: {
        type: 'linear' as const,
        display: true,
        ticks: {
          callback: function (value: any) {
            return value + ' F°';
          },
        },
        position: 'left' as const,
      },
      percentage: {
        type: 'linear' as const,
        display: true,
        ticks: {
          callback: function (value: any) {
            return value + '%';
          },
        },
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Temp',
        data: chartData.temperatures,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'temp',
      },
      {
        label: 'Precip',
        data: chartData.precipitationProbs,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'percentage',
      },
      {
        label: 'Humidity',
        data: chartData.humidities,
        borderColor: 'green',
        backgroundColor: '#00d400',
        yAxisID: 'percentage',
      },
    ],
  };

  return (
    <div className='chart_wrapper'>
      <div>
        <h4>{`${day} - ${chartData.condition}`}</h4>
        <p>{`Low: ${chartData.tempMin}  °F High: ${chartData.tempMax}  °F`}</p>
      </div>
      {isDataPresent ? (
        <div>
          <Line options={options} data={data} />
        </div>
      ) : (
        <p>No hourly data available</p>
      )}
    </div>
  );
};
