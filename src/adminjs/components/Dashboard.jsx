/**
 * @file Dashboard.jsx
 * @description Role-aware Dashboard: Admins see system summary, regular users see personal info.
 */

import React, { useState, useEffect } from 'react';
import { Box, H2, Text, Loader, Icon } from '@adminjs/design-system';
import { useCurrentAdmin } from 'adminjs';

// ─── Admin Dashboard ─────────────────────────────────────────────────────────

const AdminDashboard = () => {
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

  useEffect(() => {
    fetch('/api/dashboard-stats')
      .then((r) => r.json())
      .then((data) => {
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
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box variant="grey" flex justifyContent="center" alignItems="center" height="100vh">
        <Loader />
      </Box>
    );
  }

  const maxSales = Math.max(...stats.salesChartData.map((d) => d.sales), 1);

  return (
    <Box padding={['medium', 'large', 'xl']} style={{ background: '#F9FAFB', minHeight: '100vh' }}>
      {/* Header */}
      <Box marginBottom="xl">
        <H2 style={{ fontWeight: '700', color: '#111827' }}>Admin Dashboard</H2>
        <Text color="#6B7280" marginTop="xs">System overview — all users, orders, and revenue.</Text>
      </Box>

      {/* Stat Cards */}
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        <StatCard title="Total Users"     value={stats.totalUsers}          icon="User"         color="#3B82F6" />
        <StatCard title="Total Orders"    value={stats.totalOrders}         icon="ShoppingCart" color="#10B981" />
        <StatCard title="Total Products"  value={stats.totalProducts}       icon="Package"      color="#8B5CF6" />
        <StatCard title="Total Revenue"   value={`$${stats.totalRevenue}`}  icon="DollarSign"   color="#F59E0B" />
      </Box>

      {/* Charts */}
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {/* Bar Chart */}
        <Box style={cardStyle}>
          <Text fontWeight="600" color="#111827" marginBottom="xl">Monthly Sales</Text>
          <Box style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingBottom: '20px' }}>
            {stats.salesChartData.map((d) => (
              <Box key={d.month} style={{ width: '12%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Box style={{ width: '80%', height: `${(d.sales / maxSales) * 100}%`, background: '#4F46E5', borderRadius: '4px 4px 0 0', minHeight: '2px' }} />
                <Text fontSize="10px" style={{ marginTop: '8px', color: '#9CA3AF' }}>{d.month}</Text>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Status Bars */}
        <Box style={cardStyle}>
          <Text fontWeight="600" color="#111827" marginBottom="xl">Order Status Distribution</Text>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats.statusStats.map((item, i) => (
              <Box key={item.status}>
                <Box flex justifyContent="space-between" marginBottom="xs">
                  <Text fontSize="sm" color="#4B5563" style={{ textTransform: 'capitalize' }}>{item.status}</Text>
                  <Text fontSize="sm" fontWeight="600">{item.percentage}%</Text>
                </Box>
                <Box style={{ width: '100%', height: '8px', background: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                  <Box style={{ width: `${item.percentage}%`, height: '100%', background: ['#10B981', '#3B82F6', '#F59E0B'][i % 3] }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Recent Orders */}
      <Box style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        <Box padding="lg" style={{ borderBottom: '1px solid #E5E7EB' }}>
          <Text fontWeight="600" color="#111827">Recent Orders</Text>
        </Box>
        <Box as="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <Box as="thead" style={{ background: '#F9FAFB' }}>
            <Box as="tr">
              {['Order ID', 'Status', 'Total', 'Date'].map((h) => (
                <Box as="th" key={h} style={thStyle}>{h}</Box>
              ))}
            </Box>
          </Box>
          <Box as="tbody">
            {stats.recentOrders.map((order) => (
              <Box as="tr" key={order.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <Box as="td" style={tdStyle}>#{order.id}</Box>
                <Box as="td" style={tdStyle}><StatusBadge status={order.status} /></Box>
                <Box as="td" style={tdStyle}>${parseFloat(order.totalAmount).toFixed(2)}</Box>
                <Box as="td" style={tdStyle}>{new Date(order.createdAt).toLocaleDateString()}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// ─── User Dashboard ───────────────────────────────────────────────────────────

const UserDashboard = ({ currentAdmin }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentAdmin?.id) return;
    fetch(`/api/user-dashboard?userId=${currentAdmin.id}`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentAdmin]);

  if (loading) {
    return (
      <Box variant="grey" flex justifyContent="center" alignItems="center" height="100vh">
        <Loader />
      </Box>
    );
  }

  return (
    <Box padding={['medium', 'large', 'xl']} style={{ background: '#F9FAFB', minHeight: '100vh' }}>
      {/* Header */}
      <Box marginBottom="xl">
        <H2 style={{ fontWeight: '700', color: '#111827' }}>Welcome, {currentAdmin?.name}!</H2>
        <Text color="#6B7280" marginTop="xs">Here is a summary of your account activity.</Text>
      </Box>

      {/* Personal Info Card */}
      <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <Box style={cardStyle}>
          <Box flex alignItems="center" marginBottom="lg">
            <Box style={{ background: '#EEF2FF', color: '#4F46E5', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '16px' }}>
              <Icon icon="User" size={24} />
            </Box>
            <Box>
              <Text fontWeight="700" color="#111827">{data?.user?.name}</Text>
              <Text fontSize="sm" color="#6B7280">{data?.user?.email}</Text>
            </Box>
          </Box>
          <Box style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
            <Text fontSize="xs" color="#9CA3AF">Member since</Text>
            <Text fontSize="sm" color="#374151">{new Date(data?.user?.createdAt).toLocaleDateString()}</Text>
          </Box>
        </Box>

        <StatCard title="My Orders"    value={data?.totalOrders ?? 0}        icon="ShoppingCart" color="#10B981" />
        <StatCard title="Total Spent"  value={`$${data?.totalSpent ?? '0.00'}`} icon="DollarSign"   color="#F59E0B" />
      </Box>

      {/* Recent Orders */}
      <Box style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        <Box padding="lg" style={{ borderBottom: '1px solid #E5E7EB' }}>
          <Text fontWeight="600" color="#111827">My Recent Orders</Text>
        </Box>
        {data?.recentOrders?.length > 0 ? (
          <Box as="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <Box as="thead" style={{ background: '#F9FAFB' }}>
              <Box as="tr">
                {['Order ID', 'Status', 'Total', 'Date'].map((h) => (
                  <Box as="th" key={h} style={thStyle}>{h}</Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {data.recentOrders.map((order) => (
                <Box as="tr" key={order.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <Box as="td" style={tdStyle}>#{order.id}</Box>
                  <Box as="td" style={tdStyle}><StatusBadge status={order.status} /></Box>
                  <Box as="td" style={tdStyle}>${parseFloat(order.totalAmount).toFixed(2)}</Box>
                  <Box as="td" style={tdStyle}>{new Date(order.createdAt).toLocaleDateString()}</Box>
                </Box>
              ))}
            </Box>
          </Box>
        ) : (
          <Box padding="xl" textAlign="center">
            <Text color="#9CA3AF">No orders found.</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ─── Root Dashboard Component ─────────────────────────────────────────────────

const Dashboard = () => {
  const [currentAdmin] = useCurrentAdmin();

  if (!currentAdmin) {
    return (
      <Box flex justifyContent="center" alignItems="center" height="100vh">
        <Loader />
      </Box>
    );
  }

  if (currentAdmin.role === 'admin') {
    return <AdminDashboard />;
  }

  return <UserDashboard currentAdmin={currentAdmin} />;
};

// ─── Shared Sub-Components ────────────────────────────────────────────────────

const StatCard = ({ title, value, icon, color }) => (
  <Box style={cardStyle}>
    <Box flex justifyContent="space-between" alignItems="flex-start" marginBottom="lg">
      <Box style={{ background: `${color}18`, color, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Icon icon={icon} size={24} />
      </Box>
    </Box>
    <Text color="#6B7280" fontSize="sm">{title}</Text>
    <Text fontSize="24px" fontWeight="700" color="#111827" marginTop="xs">{value}</Text>
  </Box>
);

const StatusBadge = ({ status }) => {
  const map = {
    pending:   { bg: '#FEF3C7', text: '#92400E' },
    shipped:   { bg: '#DBEAFE', text: '#1E40AF' },
    delivered: { bg: '#D1FAE5', text: '#065F46' },
    cancelled: { bg: '#FEE2E2', text: '#991B1B' },
    processing:{ bg: '#EDE9FE', text: '#5B21B6' },
  };
  const c = map[status] || { bg: '#F3F4F6', text: '#374151' };
  return (
    <Box as="span" style={{ background: c.bg, color: c.text, padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' }}>
      {status}
    </Box>
  );
};

// ─── Shared Styles ────────────────────────────────────────────────────────────

const cardStyle = {
  background: 'white',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  border: '1px solid #E5E7EB',
};

const thStyle = {
  textAlign: 'left',
  padding: '12px 24px',
  fontSize: '11px',
  fontWeight: '700',
  color: '#6B7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tdStyle = {
  padding: '16px 24px',
  fontSize: '14px',
  color: '#111827',
};

export default Dashboard;
