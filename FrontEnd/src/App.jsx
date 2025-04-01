import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [count, setCount] = useState(0)
  const [apiData, setApiData] = useState({}); 

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:3000/test");
    if(response.status === 200) {
      console.log(response.data.message);
      setApiData(response.data);
    }
    else {
      console.error("Error fetching data");
      setApiData({});
    }
  };

  useEffect(() => {
    fetchAPI();
  }
  , []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        <p>
          <br></br>
          <p>Dữ liệu từ API:</p>
          <pre>{JSON.stringify(apiData, null, 2)}</pre>
          <p>Message từ API: {apiData.message}</p>
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
