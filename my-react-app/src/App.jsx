import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Replace "demo" with your own API key for production use
    fetch('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=QJ3OHFW9EIW6MV4R')
    // fetch('https://financialmodelingprep.com/stable/sp500-constituent')   
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Prepare chart data
  let chartData = null;
  if (data && data['Time Series (5min)']) {
    const timeSeries = data['Time Series (5min)'];
    const labels = Object.keys(timeSeries).reverse().slice(0, 20); // last 20 points
    const prices = labels.map(time => parseFloat(timeSeries[time]['1. open']));
    chartData = {
      labels,
      datasets: [
        {
          label: 'IBM Open Price',
          data: prices,
          fill: false,
          borderColor: '#1976d2', // more visible blue line
          backgroundColor: '#90caf9',
          tension: 0.1,
          borderWidth: 3,         // thicker line
          pointRadius: 4,         // slightly larger points
          // showLine: true,         // ensure line is shown
        },
      ],
    };
  }

  return (
    <div style={{
      width: '1020px',
      height: '800px',
      background: '#1976d2',
      borderRadius: '12px',
      margin: '60px auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.1rem',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      flexDirection: 'column'
    }}>
      <div style={{marginBottom: 20, fontSize: '1.5rem'}}>IBM 5min Open Price Chart</div>
      {chartData ? (
        <div style={{background: '#fff', borderRadius: 8, padding: 24, width: 900}}>
          <Line data={chartData} options={{responsive: true, plugins: {legend: {labels: {color: '#1976d2'}}}}} />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default App;