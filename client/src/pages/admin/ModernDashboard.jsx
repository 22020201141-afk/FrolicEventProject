import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import {
  TrendingUp,
  Users,
  Calendar,
  Activity,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import './ModernDashboard.css';

const ModernDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getDashboardStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="modern-dashboard-loading">
        <div className="loading-spinner-modern"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Events',
      value: stats?.totalEvents || 0,
      change: '+12%',
      positive: true,
      icon: Calendar,
      color: 'teal',
      bgColor: '#0f766e'
    },
    {
      title: 'Active Users',
      value: stats?.totalUsers || 0,
      change: '+5%',
      positive: true,
      icon: Users,
      color: 'indigo',
      bgColor: '#4338ca'
    },
    {
      title: 'Registrations',
      value: stats?.totalParticipants || 0,
      change: '+18%',
      positive: true,
      icon: TrendingUp,
      color: 'cyan',
      bgColor: '#0891b2'
    },
    {
      title: 'Success Rate',
      value: '98%',
      change: '+2%',
      positive: true,
      icon: CheckCircle,
      color: 'green',
      bgColor: '#15803d'
    }
  ];

  return (
    <div className="modern-dashboard">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1 className="hero-title">Dashboard</h1>
          <p className="hero-subtitle">Welcome back! Here's your system overview.</p>
        </div>
        <div className="hero-accent"></div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className={`metric-card metric-${metric.color}`}>
              <div className="metric-header">
                <div className="metric-icon-box" style={{ backgroundColor: metric.bgColor + '20' }}>
                  <Icon size={24} className="metric-icon" />
                </div>
                <div className={`metric-trend ${metric.positive ? 'positive' : 'negative'}`}>
                  {metric.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span>{metric.change}</span>
                </div>
              </div>
              <div className="metric-content">
                <p className="metric-label">{metric.title}</p>
                <p className="metric-value">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Quick Stats */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Quick Stats</h2>
            <BarChart3 size={20} className="header-icon" />
          </div>
          <div className="stat-list">
            <div className="stat-item">
              <div className="stat-label-wrapper">
                <span className="stat-label">Total Institutes</span>
                <span className="stat-badge">{stats?.totalInstitutes || 0}</span>
              </div>
              <div className="stat-bar">
                <div className="stat-progress" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label-wrapper">
                <span className="stat-label">Total Departments</span>
                <span className="stat-badge">{stats?.totalDepartments || 0}</span>
              </div>
              <div className="stat-bar">
                <div className="stat-progress" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label-wrapper">
                <span className="stat-label">Active Groups</span>
                <span className="stat-badge">{stats?.totalGroups || 0}</span>
              </div>
              <div className="stat-bar">
                <div className="stat-progress" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>System Status</h2>
            <Activity size={20} className="header-icon" />
          </div>
          <div className="status-list">
            <div className="status-item success">
              <div className="status-dot"></div>
              <div>
                <p className="status-title">Database</p>
                <p className="status-desc">Connected & Healthy</p>
              </div>
            </div>
            <div className="status-item success">
              <div className="status-dot"></div>
              <div>
                <p className="status-title">API Server</p>
                <p className="status-desc">All systems operational</p>
              </div>
            </div>
            <div className="status-item success">
              <div className="status-dot"></div>
              <div>
                <p className="status-title">Storage</p>
                <p className="status-desc">85% capacity used</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card full-width">
          <div className="card-header">
            <h2>Recent Activity</h2>
            <Clock size={20} className="header-icon" />
          </div>
          <div className="activity-feed">
            <div className="activity-item">
              <div className="activity-marker teal"></div>
              <div className="activity-content">
                <p className="activity-action">New event created</p>
                <p className="activity-time">2 minutes ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-marker indigo"></div>
              <div className="activity-content">
                <p className="activity-action">User registration completed</p>
                <p className="activity-time">15 minutes ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-marker cyan"></div>
              <div className="activity-content">
                <p className="activity-action">Payment processed successfully</p>
                <p className="activity-time">1 hour ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-marker green"></div>
              <div className="activity-content">
                <p className="activity-action">Report generated</p>
                <p className="activity-time">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;
