/**
 * @file Dashboard.jsx
 * @description Advanced, visually creative Dashboard using native components for maximum stability.
 */

import React, { useState, useEffect } from 'react';
import { Box, H2, Text, Loader, Icon } from '@adminjs/design-system';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalRevenue: '0.00',
    salesChartData: [],
    statusStats: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard-stats');
      const data = await response.json();
      
      setStats({
        totalUsers: data.totalUsers || 0,
        totalOrders: data.totalOrders || 0,
        totalProducts: data.totalProducts || 0,
        totalCategories: data.totalCategories || 0,
        totalRevenue: data.totalRevenue || '0.00',
        salesChartData: data.salesChartData || [],
        statusStats: data.statusStats || [],
        recentOrders: data.recentOrders || [],
      });
    } catch (error) {
      console.error('Dashboard Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box variant="grey" flex justifyContent="center" alignItems="center" height="100vh">
        <Loader />
      </Box>
    );
  }

  // Calculate max sales for chart normalization
  const maxSales = Math.max(...stats.salesChartData.map(d => d.sales), 1);

  return (
    <Box padding={['medium', 'large', 'xl']} style={{ background: '#F9FAFB', minHeight: '100vh' }}>
      {/* Header */}
      <Box marginBottom="xl">
        <H2 style={{ fontWeight: '700', color: '#111827' }}>Dashboard</H2>
        <Text color="#6B7280" marginTop="xs">Welcome back! Here's your business overview.</Text>
      </Box>

      {/* Stat Cards Grid */}
      <Box 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        <StatCard title="Total Users" value={stats.totalUsers} icon="User" color="#3B82F6" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon="ShoppingCart" color="#10B981" />
        <StatCard title="Total Products" value={stats.totalProducts} icon="Package" color="#8B5CF6" />
        <StatCard title="Revenue" value={`$${stats.totalRevenue}`} icon="CurrencyDollar" color="#F59E0B" />
      </Box>

      {/* Charts Grid */}
      <Box 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {/* CSS Bar Chart */}
        <Box style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB' }}>
          <Text fontWeight="600" color="#111827" marginBottom="xl">Sales Overview (Monthly)</Text>
          <Box style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', paddingBottom: '20px' }}>
            {stats.salesChartData.map((data) => (
              <Box key={data.month} style={{ width: '12%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Box 
                  style={{ 
                    width: '80%', 
                    height: `${(data.sales / maxSales) * 100}%`, 
                    background: '#4F46E5', 
                    borderRadius: '4px 4px 0 0',
                    minHeight: '2px'
                  }} 
                />
                <Text fontSize="10px" style={{ marginTop: '8px', color: '#9CA3AF' }}>{data.month}</Text>
              </Box>
            ))}
          </Box>
        </Box>

        {/* CSS Trend Chart */}
        <Box style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB' }}>
          <Text fontWeight="600" color="#111827" marginBottom="xl">Recent Orders Status</Text>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats.statusStats.map((item, index) => (
              <Box key={item.status}>
                <Box flex justifyContent="space-between" marginBottom="xs">
                  <Text fontSize="sm" color="#4B5563" style={{ textTransform: 'capitalize' }}>{item.status}</Text>
                  <Text fontSize="sm" fontWeight="600">{item.percentage}%</Text>
                </Box>
                <Box style={{ width: '100%', height: '8px', background: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                  <Box style={{ width: `${item.percentage}%`, height: '100%', background: ['#10B981', '#3B82F6', '#F59E0B'][index % 3] }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Recent Orders Table */}
      <Box style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <Box padding="lg" style={{ borderBottom: '1px solid #E5E7EB' }}>
          <Text fontWeight="600" color="#111827">Recent Orders</Text>
        </Box>
        <Box style={{ overflowX: 'auto' }}>
          <Box as="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <Box as="thead" style={{ background: '#F9FAFB' }}>
              <Box as="tr">
                <Box as="th" style={tableHeaderStyle}>Order ID</Box>
                <Box as="th" style={tableHeaderStyle}>Status</Box>
                <Box as="th" style={tableHeaderStyle}>Total</Box>
                <Box as="th" style={tableHeaderStyle}>Date</Box>
              </Box>
            </Box>
            <Box as="tbody">
              {stats.recentOrders.map((order) => (
                <Box as="tr" key={order.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <Box as="td" style={tableCellStyle}>#{order.id}</Box>
                  <Box as="td" style={tableCellStyle}>
                    <StatusBadge status={order.status} />
                  </Box>
                  <Box as="td" style={tableCellStyle}>${parseFloat(order.totalAmount).toFixed(2)}</Box>
                  <Box as="td" style={tableCellStyle}>{new Date(order.createdAt).toLocaleDateString()}</Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <Box style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB' }}>
    <Box flex justifyContent="space-between" alignItems="flex-start" marginBottom="lg">
      <Box style={{ background: `${color}15`, color: color, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Icon icon={icon} size={24} />
      </Box>
      <Box flex alignItems="center" style={{ color: '#059669', fontSize: '12px', fontWeight: '600', background: '#D1FAE5', padding: '2px 8px', borderRadius: '12px' }}>
        <Icon icon="TrendingUp" size={14} style={{ marginRight: '4px' }} />
        +12%
      </Box>
    </Box>
    <Text color="#6B7280" fontSize="sm">{title}</Text>
    <Text fontSize="24px" fontWeight="700" color="#111827" marginTop="xs">{value}</Text>
  </Box>
);

const StatusBadge = ({ status }) => {
  const getColors = () => {
    switch (status) {
      case 'pending': return { bg: '#FEF3C7', text: '#92400E' };
      case 'shipped': return { bg: '#DBEAFE', text: '#1E40AF' };
      case 'delivered': return { bg: '#D1FAE5', text: '#065F46' };
      default: return { bg: '#F3F4F6', text: '#374151' };
    }
  };
  const colors = getColors();
  return (
    <Box as="span" style={{ background: colors.bg, color: colors.text, padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' }}>
      {status}
    </Box>
  );
};

const tableHeaderStyle = {
  textAlign: 'left',
  padding: '12px 24px',
  fontSize: '11px',
  fontWeight: '700',
  color: '#6B7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tableCellStyle = {
  padding: '16px 24px',
  fontSize: '14px',
  color: '#111827',
};

export default Dashboard;
