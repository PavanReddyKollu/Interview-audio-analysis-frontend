import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import AudioUpload from './uploadbutton';
import Loader from './Loader';
import axios from 'axios';

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
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const getTabData = () => {
    if (!selectedFile) return [];
    return activeTab === 'strengths'
      ? selectedFile.result_data[0].strengths
      : selectedFile.result_data[0].areas_of_improvement;
  };
  const audioUploadedResult = (data) => {
        setFiles(data)
  }
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
      <aside className="sidebar" style={{width : '275px'}}>
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
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: '700px', textAlign: 'center', fontWeight: 800, fontSize: '2.5rem', color: '#334155', letterSpacing: '2px', marginBottom: '2rem',textTransform: 'uppercase', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", borderBottom: '4px solid #3b82f6', paddingBottom: '0.5rem',  margin: '0 auto 2rem auto', }}>
          Interview Analysis
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
                <p className="placeholder-title">{selectedFile.file_name} Data</p>
                <p className="placeholder-text">Rating: {selectedFile.result_data[0].rating} / 10</p>
                <p className="placeholder-text">Total Pauses: {JSON.parse(selectedFile.pauses).total_pauses}</p>
                <p className="placeholder-text">Long Pauses: {JSON.parse(selectedFile.pauses).long_pauses}</p>
                <p className="placeholder-text">Average Pauses: {JSON.parse(selectedFile.pauses).average_pause_duration}</p>
                <p className="placeholder-text">Comment: {JSON.parse(selectedFile.pauses).pause_comment}</p>
                {/* Show strengths or areas of improvement as Q&A list if available */}
                {getTabData().length > 0 ? (
                  <ul className="placeholder-text">
                    {getTabData().map((item, index) => (
                      <li key={index} style={{marginBottom: '1.2em'}}>
                        {item.remarks && (
                          <div><strong>{activeTab === 'strengths'?`Strength`:`Improvement`} {index+1}:</strong> {item.remarks}</div>
                        )}
                        <div><strong>Q:</strong> {item.question}</div>
                        <div><strong>A:</strong> {item.answer}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="placeholder-text">No data available for this tab.</p>
                )}
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
