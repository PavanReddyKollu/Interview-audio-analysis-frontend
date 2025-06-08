import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ResultsPage from './components/resultspage'
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import KPIDashboard from './components/KPIDashboard';
import { FileProvider, useFiles } from './context/FileContext';
import axios from 'axios';




function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const [count, setCount] = useState(0)

  return (
    // <TranscriptProvider>
   <AuthProvider>
    <FileProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to = "/login" replace/>} />
          <Route path="/login" element={<Login/>} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/kpi" element={
            <ProtectedRoute>
              <KPIDashboard />
            </ProtectedRoute>
          } />
          {/* <Route path="/results" element={<ResultsPage />} /> */}
        </Routes>
      </Router>
    </FileProvider>
   </AuthProvider>
      // </TranscriptProvider>
  );
}

export default App
