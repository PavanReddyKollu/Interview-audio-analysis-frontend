import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ResultsPage from './components/resultspage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  const [count, setCount] = useState(0)

  return (
    // <TranscriptProvider>

    <Router>
      <Routes>
        <Route path="/" element={<ResultsPage />} />
        {/* <Route path="/results" element={<ResultsPage />} /> */}
      </Routes>
    </Router>
      // </TranscriptProvider>
  );
}

export default App
