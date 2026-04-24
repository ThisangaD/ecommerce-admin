/**
 * @file Dashboard.jsx
 * @description Custom AdminJS Dashboard component.
 * Fetches real-time summary data from the database via API endpoints
 * and displays key business metrics for the admin overview.
 */

import React, { useState, useEffect } from 'react';
import { Box, H1, H2, H3, Text, Loader } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';

const api = new ApiClient();

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch counts from each resource via AdminJS API
      const [usersRes, ordersRes, productsRes, categoriesRes] = await Promise.all([
        api.resourceAction({ resourceId: 'User', actionName: 'list' }),
        api.resourceAction({ resourceId: 'Order', actionName: 'list' }),
        api.resourceAction({ resourceId: 'Product', actionName: 'list' }),
        api.resourceAction({ resourceId: 'Category', actionName: 'list' }),
      ]);

      // Calculate total revenue from orders
      const orders = ordersRes.data.records || [];
      const totalRevenue = orders.reduce((sum, order) => {
        return sum + parseFloat(order.params.totalAmount || 0);
      }, 0);

      setStats({
        totalUsers: usersRes.data.meta?.total || 0,
        totalOrders: ordersRes.data.meta?.total || 0,
        totalProducts: productsRes.data.meta?.total || 0,
        totalCategories: categoriesRes.data.meta?.total || 0,
        totalRevenue: totalRevenue.toFixed(2),
        recentOrders: orders.slice(0, 5),
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box flex justifyContent="center" alignItems="center" height="100%">
        <Loader />
      </Box>
    );
  }

  return (
    <Box variant="grey" padding="xl">
      {/* Header */}
      <Box variant="white" padding="xl" marginBottom="xl" style={{ borderRadius: '8px' }}>
        <H1>Dashboard</H1>
        <Text>Welcome back! Here is your real-time business overview.</Text>
      </Box>

      {/* Stat Cards */}
      <Box flex flexWrap="wrap" style={{ gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Total Users" value={stats?.totalUsers || 0} color="#3B82F6" />
        <StatCard label="Total Orders" value={stats?.totalOrders || 0} color="#10B981" />
        <StatCard label="Total Products" value={stats?.totalProducts || 0} color="#8B5CF6" />
        <StatCard label="Total Categories" value={stats?.totalCategories || 0} color="#F59E0B" />
      </Box>

      {/* Revenue Card */}
      <Box variant="white" padding="xl" marginBottom="xl" style={{ borderRadius: '8px' }}>
        <Text color="grey60" style={{ fontSize: '14px', marginBottom: '4px' }}>Total Revenue</Text>
        <H2 style={{ color: '#10B981' }}>${stats?.totalRevenue || '0.00'}</H2>
      </Box>

      {/* Recent Orders */}
      <Box variant="white" padding="xl" style={{ borderRadius: '8px' }}>
        <H3 style={{ marginBottom: '16px' }}>Recent Orders</H3>
        {stats?.recentOrders?.length > 0 ? (
          <Box as="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <Box as="thead">
              <Box as="tr" style={{ borderBottom: '2px solid #E5E7EB' }}>
                <Box as="th" style={thStyle}>Order ID</Box>
                <Box as="th" style={thStyle}>Status</Box>
                <Box as="th" style={thStyle}>Amount</Box>
                <Box as="th" style={thStyle}>Date</Box>
              </Box>
            </Box>
            <Box as="tbody">
              {stats.recentOrders.map((order) => (
                <Box as="tr" key={order.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <Box as="td" style={tdStyle}>#{order.params.id}</Box>
                  <Box as="td" style={tdStyle}>
                    <Box
                      as="span"
                      style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: statusColors[order.params.status] || '#F3F4F6',
                        color: '#1F2937',
                      }}
                    >
                      {order.params.status}
                    </Box>
                  </Box>
                  <Box as="td" style={tdStyle}>${parseFloat(order.params.totalAmount || 0).toFixed(2)}</Box>
                  <Box as="td" style={tdStyle}>{new Date(order.params.createdAt).toLocaleDateString()}</Box>
                </Box>
              ))}
            </Box>
          </Box>
        ) : (
          <Text color="grey60">No orders found yet.</Text>
        )}
      </Box>
    </Box>
  );
};

/** Reusable stat card sub-component */
const StatCard = ({ label, value, color }) => (
  <Box
    variant="white"
    padding="lg"
    style={{
      flex: '1 1 200px',
      borderRadius: '8px',
      borderLeft: `4px solid ${color}`,
    }}
  >
    <Text color="grey60" style={{ fontSize: '14px', marginBottom: '4px' }}>{label}</Text>
    <H2>{value}</H2>
  </Box>
);

const statusColors = {
  pending: '#FEF3C7',
  processing: '#DBEAFE',
  shipped: '#D1FAE5',
  delivered: '#A7F3D0',
  cancelled: '#FEE2E2',
};

const thStyle = {
  textAlign: 'left',
  padding: '12px 16px',
  fontSize: '12px',
  fontWeight: '600',
  color: '#6B7280',
  textTransform: 'uppercase',
};

const tdStyle = {
  padding: '12px 16px',
  fontSize: '14px',
  color: '#374151',
};

export default Dashboard;
