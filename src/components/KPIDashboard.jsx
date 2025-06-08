import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { useFiles } from '../context/FileContext';
import { Typography, TextField, MenuItem } from '@mui/material';
import './KPIDashboard.css';
import { useNavigate } from 'react-router-dom';

const KPIDashboard = () => {
  const { files } = useFiles();
  const [selectedUser, setSelectedUser] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate()

  const userMap = {};
  files.forEach((file) => {
    const user = file.username || file.file_name?.split('_')[0] || 'Unknown';
    if (!userMap[user]) userMap[user] = [];
    userMap[user].push(file);
  });

  const totalInterviews = files.length;
  const allRatings = files.map(f => Array.isArray(f.result_data) && f.result_data[0] ? f.result_data[0].rating || 0 : 0);
  const averageRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2) : 0;

  const totalPauses = files.reduce((sum, f) => {
    const pauses = JSON.parse(f.pauses || '{}');
    return sum + (pauses.total_pauses || 0);
  }, 0);

  const averageLongPauses = (
    files.reduce((sum, f) => {
      const pauses = JSON.parse(f.pauses || '{}');
      return sum + (pauses.long_pauses || 0);
    }, 0) / files.length
  ).toFixed(2);

  const averageTempo = (
    files.reduce((sum, f) => {
      const tone = JSON.parse(f.speaking_rate_and_tone || '{}');
      return sum + (tone.tempo_value || 0);
    }, 0) / files.length
  ).toFixed(2);

  const averagePitch = (
    files.reduce((sum, f) => {
      const tone = JSON.parse(f.speaking_rate_and_tone || '{}');
      return sum + (tone.average_pitch || 0);
    }, 0) / files.length
  ).toFixed(2);

  const kpiCards = [
    { label: 'Total Interviews', value: selectedUser ? userMap[selectedUser]?.length : totalInterviews },
    {
      label: 'Average Rating',
      value: selectedUser
        ? (
            userMap[selectedUser].reduce((acc, f) => {
              const rating = Array.isArray(f.result_data) && f.result_data[0] ? f.result_data[0].rating || 0 : 0;
              return acc + rating;
            }, 0) / userMap[selectedUser].length
          ).toFixed(2)
        : averageRating
    },
    {
      label: 'Total Pauses',
      value: selectedUser
        ? userMap[selectedUser].reduce((acc, f) => {
            const pauses = JSON.parse(f.pauses || '{}');
            return acc + (pauses.total_pauses || 0);
          }, 0)
        : totalPauses
    },
    {
      label: 'Avg. Long Pauses',
      value: selectedUser
        ? (
            userMap[selectedUser].reduce((acc, f) => {
              const pauses = JSON.parse(f.pauses || '{}');
              return acc + (pauses.long_pauses || 0);
            }, 0) / userMap[selectedUser].length
          ).toFixed(2)
        : averageLongPauses
    },
    {
      label: 'Avg. Tempo',
      value: selectedUser
        ? (
            userMap[selectedUser].reduce((acc, f) => {
              const tone = JSON.parse(f.speaking_rate_and_tone || '{}');
              return acc + (tone.tempo_value || 0);
            }, 0) / userMap[selectedUser].length
          ).toFixed(2)
        : averageTempo
    },
    {
      label: 'Avg. Pitch',
      value: selectedUser
        ? (
            userMap[selectedUser].reduce((acc, f) => {
              const tone = JSON.parse(f.speaking_rate_and_tone || '{}');
              return acc + (tone.average_pitch || 0);
            }, 0) / userMap[selectedUser].length
          ).toFixed(2)
        : averagePitch
    }
  ];

  const userCharts = Object.entries(userMap).map(([user, userFiles]) => {
    const data = userFiles.map((file, i) => ({
      name: file.file_name || `Mock ${i + 1}`,
      rating: Array.isArray(file.result_data) && file.result_data[0] ? file.result_data[0].rating || 0 : 0,
    }));
    return { user, data };
  });

  const multiInterviewUsers = userCharts.filter(chart => chart.data.length > 1);

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        <div className="dashboard-title-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',marginLeft:'136px',  width: '100%', gap: '1.5rem', minWidth: 0, padding: '0.5rem 0', flexWrap: 'nowrap' }}>
          <h2 className="dashboard-title" style={{
            margin: 0,
            fontSize: '2rem',
            fontWeight: 700,
            flex: 1,
            minWidth: 0,
            whiteSpace: 'nowrap',
            overflow: 'visible',
            textOverflow: 'ellipsis',
            textAlign: 'left',
            letterSpacing: '0.5px',
            lineHeight: 1.2
          }}>
            Interview Performance Dashboard
          </h2>
          <button className="back-button" style={{ marginLeft: '50rem', flexShrink: 0, whiteSpace: 'nowrap' }} onClick={() => navigate('/dashboard')}>
            &#8592; Back
          </button>
        </div>
        <div className="dashboard-dropdown-cell" style={{ gridColumn: '1', gridRow: '1', alignSelf: 'center', justifySelf: 'start', minWidth: 220, maxWidth: 320 }}>
          {/* Single searchable dropdown for interviewer selection */}
          <TextField
            select
            label="Select Interviewer"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            sx={{ minWidth: 200, maxWidth: 320 }}
            SelectProps={{
              native: false,
              MenuProps: {
                PaperProps: {
                  style: { maxHeight: 300, maxWidth: 320, overflowX: 'auto' }
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ marginRight: 8, padding: 4, border: 'none', outline: 'none', background: 'transparent', fontSize: '1rem', width: 80 }}
                />
              )
            }}
            inputProps={{
              style: { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }
            }}
          >
            <MenuItem value="">All Interviewers</MenuItem>
            {multiInterviewUsers
              .filter(({ user }) => user.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(({ user }) => (
                <MenuItem key={user} value={user} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 280 }}>
                  {user}
                </MenuItem>
              ))}
          </TextField>
        </div>
        <div className="kpi-cards">
          {kpiCards.map((card, i) => (
            <div key={i} className="kpi-card">
              <div className="kpi-card-title">{card.label}</div>
              <div className="kpi-card-value">{card.value}</div>
            </div>
          ))}
        </div>
        {/* User-specific chart */}
        {selectedUser && multiInterviewUsers
          .filter(chart => chart.user === selectedUser)
          .map(({ user, data }) => (
            <div className="chart-card" key={user}>
              <h4>{user}'s Ratings</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                  <CartesianGrid stroke="#eee" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rating" stroke="#f97316" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        {/* Overall Ratings Chart */}
        <div className="chart-card">
          <h4>Overall Ratings</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={files.map((file, i) => ({
              name: file.file_name || `Mock ${i + 1}`,
              rating: Array.isArray(file.result_data) && file.result_data[0] ? file.result_data[0].rating || 0 : 0,
            }))}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="rating" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Pie Chart: Rating Distribution */}
                {/* Pie Chart: Rating Distribution */}
        <div className="chart-card">
          <h4>Rating Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={(() => {
                  const buckets = [
                    { name: '6', value: 0 },
                    { name: '7', value: 0 },
                    { name: '8', value: 0 },
                    { name: '9-10', value: 0 },
                  ];
                  files.forEach(f => {
                    const rating = Array.isArray(f.result_data) && f.result_data[0] ? f.result_data[0].rating || 0 : 0;
                    if (rating === 6) buckets[0].value++;
                    else if (rating === 7) buckets[1].value++;
                    else if (rating === 8) buckets[2].value++;
                    else if (rating >= 9 && rating <= 10) buckets[3].value++;
                  });
                  return buckets;
                })()}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                <Cell fill="#f87171" />
                <Cell fill="#fbbf24" />
                <Cell fill="#34d399" />
                <Cell fill="#60a5fa" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Bar Chart: Pauses per Interview */}
        <div className="chart-card">
          <h4>Pauses per Interview</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={files.map((file, i) => ({
              name: file.file_name || `Mock ${i + 1}`,
              pauses: (() => {
                try {
                  return JSON.parse(file.pauses || '{}').total_pauses || 0;
                } catch {
                  return 0;
                }
              })(),
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pauses" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;
