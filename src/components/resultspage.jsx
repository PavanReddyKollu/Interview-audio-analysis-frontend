import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import AudioUpload from './uploadbutton';
import Loader from './Loader';
import axios from 'axios';
import './AudioAnalysis.css'
import FeedbackReferenceModal from './FeedbackReference';
import { useFiles } from '../context/FileContext';
import LogoutIcon from '@mui/icons-material/Logout';

// const files = [
//   {
//     name: 'File 1',
//     rating: 3,
//     strengths: [
//       "Demonstrates a good understanding of SQL, including joins, set operators, window functions (rank, dense_rank), and subqueries.",
//       "Displays familiarity with data manipulation and visualization tools like Excel and Tableau.",
//       "Clearly articulates her experience with ETL processes, although the specifics could be improved.",
//     ],
//     areasOfImprovement: [
//       "Could improve the structure and clarity of some answers, particularly those involving complex SQL queries.",
//       "Needs to provide more quantitative details about projects (e.g., exact data volumes, specific KPIs used)."
//     ]
//   },
//   {
//     name: 'File 2',
//     rating: 5,
//     strengths: ["Excellent understanding of data visualization."],
//     areasOfImprovement: ["Should work on communication skills."]
//   },
//   {
//     name: 'File 3',
//     rating: 2,
//     strengths: [],
//     areasOfImprovement: []
//   },
//   {
//     name: 'File 4',
//     rating: 4,
//     strengths: ["Strong in ETL process."],
//     areasOfImprovement: ["Basic understanding of normalization."]
//   },
//   {
//     name: 'File 5',
//     rating: 3,
//     strengths: ["Confident and articulate."],
//     areasOfImprovement: ["Lacks clarity in SQL subqueries."]
//   },
// ];

const StarRating = ({ count }) => (
  <div className="star-rating">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="star filled">★</span>
    ))}
    {Array.from({ length: 10 - count }).map((_, i) => (
      <span key={i} className="star">★</span>
    ))}
  </div>
);

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('strengths');
  const { files, setFiles } = useFiles();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const getTabData = () => {
    if (!selectedFile) return [];
    return activeTab === 'strengths'
      ? selectedFile.result_data[0].strengths
      : selectedFile.result_data[0].areas_of_improvement;
  };
  const audioUploadedResult = (data) => {
        setFiles(data); //This will now update KPI dashboard too
      };
  const getAudioDetails = async() => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/getAllAudioFileDetails', {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response.data.length > 0) {
        setFiles(response.data)
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getAudioDetails()
  },[])

  // Filter files by search term
  const filteredFiles = files.filter(f =>
    f.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div
      className="dashboard"
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <aside className="sidebar" style={{width : '300px'}}>
        <div className="sidebar-header">Select a file</div>
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', marginBottom: 10, padding: 5, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <ul className="file-list">
          {filteredFiles.map((val, idx) => (
            <li
              key={idx}
              onClick={() => {
                setSelectedFile(val);
                setActiveTab('strengths');
              }}
              className={`file-item ${
                selectedFile && selectedFile.file_name === val.file_name ? 'active' : ''
              }`}
            >
              <span className="file-name">{val.file_name}</span>
              <StarRating count={val.result_data && Array.isArray(val.result_data) && val.result_data[0] && val.result_data[0].rating ? val.result_data[0].rating : 0} />
            </li>
          ))}
        </ul>
        <AudioUpload loading = {(load) => setLoading(load)} result = {(data) => audioUploadedResult(data)}/>

      </aside>

      <main
        className="main-content"
        style={{
          flex: 1,
          height: '100%',
          // overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', 
          // padding: '10px 20px' 
          }}>
          <div style={{ width: '100%', maxWidth: '700px', textAlign: 'center', fontWeight: 800, fontSize: '2rem', color: '#334155', letterSpacing: '2px', marginBottom: '2rem',textTransform: 'uppercase', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", borderBottom: '4px solid #3b82f6', paddingBottom: '0.5rem', 
           margin: '0 auto 2rem auto',
            }}>
          Interview Analysis
        </div>
          <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '0.5rem'
              }}>
                {/* Logout Button with Icon */}
                <button
                  style={{
                    // backgroundColor: 'rgb(130 133 164)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    height: '30px'
                  }}
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                  }}
                  title="Logout"
                >
                  <LogoutIcon style={{ color: '#ff4d4f', fontSize: '24px' }} />
                </button>

                {/* KPI Dashboard Button Below */}
                <button
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    transition: 'background-color 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                  onClick={() => window.location.href = '/dashboard/kpi'}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1e40af')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                  title="View your overall KPI analytics"
                >
                  View KPI Dashboard
                </button>
              </div>
        </div>

        
        
        <div className="tabs-container">
          <div
            className={`tab strengths ${activeTab === 'strengths' ? 'active' : ''}`}
            onClick={() => setActiveTab('strengths')}
          >
            Strengths
          </div>
          <div
            className={`tab improve ${activeTab === 'improve' ? 'active' : ''}`}
            onClick={() => setActiveTab('improve')}
          >
            Areas of Improvement
          </div>
        </div>

        <div className="content-area">
          <div className="placeholder">
            {selectedFile ? (
              <>
                {/* Show strengths or areas of improvement as Q&A list if available */}
                <p className="placeholder-title">{selectedFile.file_name} Data</p>
                <p className="placeholder-text">Rating: {selectedFile.result_data[0].rating} / 10</p>
                {getTabData().length > 0 ? (
                  <ul className="placeholder-text">
                    {getTabData().map((item, index) => (
                      <li key={index} style={{ marginBottom: '1.2em' }}>
                        <div className="qa-group">
                          {item.remarks && (
                            <div className="remark-line">
                              <strong>{activeTab === 'strengths' ? `Strength` : `Improvement`} {index + 1}:</strong> {item.remarks}
                            </div>
                          )}
                          <div className="question-line">
                            <strong>Q:</strong> {item.question}
                          </div>
                          <div className="answer-line">
                            <strong>A:</strong> {item.answer}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                ) : (
                  <p className="placeholder-text">No data available for this tab.</p>
                )}
                <div className="audio-analysis-container">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                      <FeedbackReferenceModal />
                    </div>
                  <div className="metrics-wrapper">
                    <div className="metric-section pauses-section">
                      <div className="section-title">Pauses Metrics</div>
                      <p className="metric-label">Total Pauses:<span className="metric-value">{JSON.parse(selectedFile.pauses).total_pauses}</span></p>
                      <p className="metric-label">Long Pauses:<span className="metric-value">{JSON.parse(selectedFile.pauses).long_pauses}</span></p>
                      <p className="metric-label">Average Pauses:<span className="metric-value">{JSON.parse(selectedFile.pauses).average_pause_duration}</span></p>
                      <div className="comment-text">{JSON.parse(selectedFile.pauses).pause_comment}</div>
                    </div>
                    <div className="metric-section tempo-section">
                      <div className="section-title">Tempo & Pitch Metrics</div>
                      <p className="metric-label">Tempo Value:<span className="metric-value">{JSON.parse(selectedFile.speaking_rate_and_tone).tempo_value}</span></p>
                      <p className="metric-label">Tempo Description:<span className="metric-value">{JSON.parse(selectedFile.speaking_rate_and_tone).tempo_description}</span></p>
                      <p className="metric-label">Average Pitch:<span className="metric-value">{JSON.parse(selectedFile.speaking_rate_and_tone).average_pitch}</span></p>
                      <p className="metric-label">Pitch Description:<span className="metric-value">{JSON.parse(selectedFile.speaking_rate_and_tone).pitch_description}</span></p>
                      <div className="overall-comment-box">
                        <span className="overall-comment">{JSON.parse(selectedFile.speaking_rate_and_tone).overall_comment}</span>
                      </div>
                    </div>
                  </div>
                </div>




              </>
            ) : (
              <p className="placeholder-text">Select a file to view its data.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
