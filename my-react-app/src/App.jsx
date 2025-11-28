import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const startPrice = 2032;
const coef = 3.58;

function LoginPage({ onLogin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Example PIN: 1234
    if (pin === '1212') {
      onLogin();
    } else {
      setError('Невірний PIN');
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#1976d2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: 40,
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: 300
        }}
      >
        <div style={{ fontSize: '1.5rem', marginBottom: 20, color: '#1976d2', fontWeight: 'bold' }}>
          Введіть PIN
        </div>
        <input
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value)}
          style={{
            fontSize: '1.2rem',
            padding: '8px 16px',
            borderRadius: 6,
            border: '1px solid #1976d2',
            marginBottom: 20,
            width: '100%'
          }}
          placeholder="PIN"
        />
        <button
          type="submit"
          style={{
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '10px 24px',
            fontSize: '1.1rem',
            cursor: 'pointer'
          }}
        >
          Увійти
        </button>
        {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
      </form>
    </div>
  );
}

function MainPage({ lastPrice, chartData }) {
  return (
    <div style={{
      maxWidth: '390px', // iPhone 12 screen width
      width: '100vw',
      minHeight: '100vh',
      background: '#1976d2',
      borderRadius: '12px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      color: 'white',
      fontSize: '1.1rem',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      flexDirection: 'column',
      padding: '24px 8px 0 8px',
      boxSizing: 'border-box'
    }}>
      <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: 10 }}>
        Стартовий вклад:  {startPrice} €
      </div>
      <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: 10 }}>
        {lastPrice !== null ? `Цiна капiталу зараз: ${(lastPrice * coef).toFixed(2)} €` : 'Loading...'}
      </div>
      <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: 10 }}>
        {lastPrice !== null ? `Чиста прибиль (приблизно): ${(lastPrice * coef - startPrice - 10).toFixed(2)} €` : 'Loading...'}
      </div>
      <div
        style={{
          marginBottom: 20,
          fontSize: '1.1rem',
          width: '100%',
          textAlign: 'center'
        }}
      >
        Графiк росту активa по дням
      </div>
      {chartData ? (
        <div style={{ background: '#fff', borderRadius: 8, padding: 8, width: '100%', boxSizing: 'border-box' }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { labels: { color: '#1976d2' } } },
              layout: { padding: 0 }
            }}
            height={220}
          />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SXR8.DEX&outputsize=full&apikey=QJ3OHFW9EIW6MV4R')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Prepare chart data
  let chartData = null;
  let lastPrice = null;
  if (data && data['Time Series (Daily)']) {
    const timeSeries = data['Time Series (Daily)'];
    const allDates = Object.keys(timeSeries);
    const last20Dates = allDates.slice(0, 20).reverse(); // get latest 20, then reverse for chronological order
    const prices = last20Dates.map(date => parseFloat(timeSeries[date]['1. open']));
    lastPrice = prices[prices.length - 1]; // last (most recent) price in the chart
    chartData = {
      labels: last20Dates,
      datasets: [
        {
          label: 'S&P 500 Price',
          data: prices,
          fill: false,
          borderColor: '#1976d2',
          backgroundColor: '#90caf9',
          tension: 0.1,
          borderWidth: 3,
          pointRadius: 4,
          showLine: true,
        },
      ],
    };
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return <MainPage lastPrice={lastPrice} chartData={chartData} />;
}

export default App;