/**
 * @file Dashboard.jsx
 * @description Premium role-aware Dashboard with modern glassmorphism design.
 * Admins see full system summary with charts. Regular users see personal info.
 * Inspired by modern admin UI patterns, built with @adminjs/design-system.
 */

import React, { useState, useEffect } from 'react';
import { Box, H2, Text, Loader, Icon } from '@adminjs/design-system';
import { useCurrentAdmin } from 'adminjs';

// ─── Premium Design Tokens ──────────────────────────────────────────────────

const COLORS = {
  // Primary gradient palette
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',

  // Accent colors for stat cards
  blue: '#3B82F6',
  green: '#10B981',
  purple: '#8B5CF6',
  amber: '#F59E0B',
  rose: '#F43F5E',
  cyan: '#06B6D4',

  // Neutral palette
  bgPage: '#F8FAFC',
  bgCard: '#FFFFFF',
  bgCardHover: '#F1F5F9',
  bgSubtle: '#F9FAFB',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textWhite: '#FFFFFF',
};

const SHADOWS = {
  card: '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.06)',
  cardHover: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
  elevated: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)',
  glow: (color) => `0 0 20px ${color}22`,
};

// ─── Shared Styles ──────────────────────────────────────────────────────────

const pageStyle = {
  background: COLORS.bgPage,
  minHeight: '100vh',
  padding: '32px 40px',
  fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
};

const cardBase = {
  background: COLORS.bgCard,
  borderRadius: '16px',
  border: `1px solid ${COLORS.border}`,
  boxShadow: SHADOWS.card,
  transition: 'all 0.2s ease',
};

const headerGradient = {
  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)',
  borderRadius: '20px',
  padding: '32px 36px',
  marginBottom: '28px',
  position: 'relative',
  overflow: 'hidden',
};

const headerOverlay = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'radial-gradient(circle at top right, rgba(255,255,255,0.15) 0%, transparent 60%)',
  pointerEvents: 'none',
};

const gridAuto = (minWidth = '240px', gap = '20px') => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))`,
  gap,
});

const thStyle = {
  textAlign: 'left',
  padding: '14px 24px',
  fontSize: '11px',
  fontWeight: '600',
  color: COLORS.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  background: COLORS.bgSubtle,
};

const tdStyle = {
  padding: '16px 24px',
  fontSize: '13px',
  color: COLORS.textPrimary,
  borderBottom: `1px solid ${COLORS.borderLight}`,
};

// ─── Reusable Sub-Components ────────────────────────────────────────────────

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Box
    style={{
      ...cardBase,
      padding: '24px',
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Decorative gradient accent */}
    <Box
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: `radial-gradient(circle at top right, ${color}12 0%, transparent 70%)`,
        pointerEvents: 'none',
      }}
    />
    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
      <Box
        style={{
          background: `${color}14`,
          color,
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: SHADOWS.glow(color),
        }}
      >
        <Icon icon={icon} size={22} />
      </Box>
      {subtitle && (
        <Box
          as="span"
          style={{
            background: '#ECFDF5',
            color: '#059669',
            fontSize: '11px',
            fontWeight: '600',
            padding: '4px 10px',
            borderRadius: '20px',
          }}
        >
          {subtitle}
        </Box>
      )}
    </Box>
    <Text style={{ color: COLORS.textMuted, fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
      {title}
    </Text>
    <Text style={{ fontSize: '28px', fontWeight: '700', color: COLORS.textPrimary, letterSpacing: '-0.02em' }}>
      {value}
    </Text>
  </Box>
);

const StatusBadge = ({ status }) => {
  const map = {
    pending: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
    shipped: { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
    delivered: { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
    cancelled: { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
    processing: { bg: '#EDE9FE', text: '#5B21B6', dot: '#8B5CF6' },
  };
  const c = map[status] || { bg: '#F1F5F9', text: '#475569', dot: '#94A3B8' };
  return (
    <Box
      as="span"
      style={{
        background: c.bg,
        color: c.text,
        padding: '5px 14px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'capitalize',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <Box
        as="span"
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: c.dot,
          display: 'inline-block',
        }}
      />
      {status}
    </Box>
  );
};

const SectionTitle = ({ children, subtitle }) => (
  <Box style={{ marginBottom: '20px' }}>
    <Text style={{ fontSize: '17px', fontWeight: '700', color: COLORS.textPrimary }}>{children}</Text>
    {subtitle && (
      <Text style={{ fontSize: '13px', color: COLORS.textMuted, marginTop: '4px' }}>{subtitle}</Text>
    )}
  </Box>
);

// ─── Chart Bar (pure CSS) ───────────────────────────────────────────────────

const ChartBar = ({ label, value, maxValue, color, index }) => {
  const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
        height: '100%',
        gap: '8px',
      }}
    >
      {/* Value label */}
      <Text style={{ fontSize: '11px', fontWeight: '600', color: COLORS.textSecondary }}>
        {value > 0 ? `$${value.toLocaleString()}` : '—'}
      </Text>
      {/* Bar */}
      <Box
        style={{
          width: '100%',
          maxWidth: '44px',
          height: `${Math.max(height, 3)}%`,
          background: `linear-gradient(180deg, ${color} 0%, ${color}BB 100%)`,
          borderRadius: '8px 8px 4px 4px',
          transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDelay: `${index * 80}ms`,
          boxShadow: `0 2px 8px ${color}30`,
        }}
      />
      {/* Month label */}
      <Text style={{ fontSize: '12px', fontWeight: '500', color: COLORS.textMuted }}>{label}</Text>
    </Box>
  );
};

// ─── Progress Bar ───────────────────────────────────────────────────────────

const ProgressRow = ({ label, percentage, color }) => (
  <Box style={{ marginBottom: '16px' }}>
    <Box style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <Text style={{ fontSize: '13px', fontWeight: '500', color: COLORS.textSecondary, textTransform: 'capitalize' }}>
        {label}
      </Text>
      <Text style={{ fontSize: '13px', fontWeight: '700', color: COLORS.textPrimary }}>{percentage}%</Text>
    </Box>
    <Box style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '100px', overflow: 'hidden' }}>
      <Box
        style={{
          width: `${percentage}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${color}, ${color}CC)`,
          borderRadius: '100px',
          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </Box>
  </Box>
);

// ─── Loading Spinner ────────────────────────────────────────────────────────

const LoadingScreen = () => (
  <Box
    style={{
      ...pageStyle,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh',
    }}
  >
    <Box style={{ textAlign: 'center' }}>
      <Loader />
      <Text style={{ color: COLORS.textMuted, marginTop: '16px', fontSize: '14px' }}>Loading dashboard...</Text>
    </Box>
  </Box>
);

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

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

  if (loading) return <LoadingScreen />;

  const maxSales = Math.max(...stats.salesChartData.map((d) => d.sales), 1);
  const barColors = ['#6366F1', '#8B5CF6', '#A78BFA', '#6366F1', '#8B5CF6', '#A78BFA'];
  const statusColors = ['#10B981', '#3B82F6', '#F59E0B', '#F43F5E'];

  return (
    <Box className="dashboard-page" style={pageStyle}>
      {/* ── Gradient Header ── */}
      <Box style={headerGradient}>
        <Box style={headerOverlay} />
        <Box style={{ position: 'relative', zIndex: 1 }}>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
            Welcome back, Admin 👋
          </Text>
          <Text style={{ color: COLORS.textWhite, fontSize: '26px', fontWeight: '700', letterSpacing: '-0.01em' }}>
            Dashboard Overview
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginTop: '6px' }}>
            Here's what's happening across your store today.
          </Text>
        </Box>
      </Box>

      {/* ── Stat Cards ── */}
      <Box style={{ ...gridAuto('220px', '20px'), marginBottom: '28px' }}>
        <StatCard title="Total Users" value={stats.totalUsers} icon="User" color={COLORS.blue} subtitle="Active" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon="ShoppingCart" color={COLORS.green} />
        <StatCard title="Products" value={stats.totalProducts} icon="Package" color={COLORS.purple} />
        <StatCard
          title="Revenue"
          value={`$${Number(stats.totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon="DollarSign"
          color={COLORS.amber}
        />
      </Box>

      {/* ── Charts Row ── */}
      <Box style={{ ...gridAuto('380px', '20px'), marginBottom: '28px' }}>
        {/* Sales Overview Bar Chart */}
        <Box style={{ ...cardBase, padding: '28px' }}>
          <SectionTitle subtitle="Monthly revenue performance">Sales Overview</SectionTitle>
          <Box
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '220px',
              paddingTop: '12px',
              gap: '8px',
            }}
          >
            {stats.salesChartData.map((d, i) => (
              <ChartBar
                key={d.month}
                label={d.month}
                value={d.sales}
                maxValue={maxSales}
                color={barColors[i % barColors.length]}
                index={i}
              />
            ))}
          </Box>
        </Box>

        {/* Order Status Distribution */}
        <Box style={{ ...cardBase, padding: '28px' }}>
          <SectionTitle subtitle="Current order breakdown">Order Status</SectionTitle>
          <Box style={{ marginTop: '12px' }}>
            {stats.statusStats.map((item, i) => (
              <ProgressRow
                key={item.status}
                label={item.status}
                percentage={item.percentage}
                color={statusColors[i % statusColors.length]}
              />
            ))}
          </Box>
          {/* Summary pill */}
          <Box
            style={{
              marginTop: '20px',
              padding: '14px 18px',
              background: '#F8FAFC',
              borderRadius: '12px',
              border: `1px solid ${COLORS.borderLight}`,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Box
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: COLORS.green,
              }}
            />
            <Text style={{ fontSize: '13px', color: COLORS.textSecondary }}>
              <strong>{stats.totalOrders}</strong> total orders tracked
            </Text>
          </Box>
        </Box>
      </Box>

      {/* ── Recent Orders Table ── */}
      <Box style={{ ...cardBase, overflow: 'hidden' }}>
        <Box style={{ padding: '24px 28px', borderBottom: `1px solid ${COLORS.border}` }}>
          <SectionTitle subtitle="Latest transactions across all users">Recent Orders</SectionTitle>
        </Box>
        <Box style={{ overflowX: 'auto' }}>
          <Box as="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <Box as="thead">
              <Box as="tr">
                {['Order ID', 'Status', 'Total Amount', 'Date'].map((h) => (
                  <Box as="th" key={h} style={thStyle}>
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {stats.recentOrders.map((order) => (
                <Box
                  as="tr"
                  key={order.id}
                  style={{ transition: 'background 0.15s ease' }}
                >
                  <Box as="td" style={{ ...tdStyle, fontWeight: '600' }}>
                    #{order.id}
                  </Box>
                  <Box as="td" style={tdStyle}>
                    <StatusBadge status={order.status} />
                  </Box>
                  <Box as="td" style={{ ...tdStyle, fontWeight: '600' }}>
                    ${parseFloat(order.totalAmount).toFixed(2)}
                  </Box>
                  <Box as="td" style={{ ...tdStyle, color: COLORS.textSecondary }}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Box>
                </Box>
              ))}
              {stats.recentOrders.length === 0 && (
                <Box as="tr">
                  <Box as="td" colSpan={4} style={{ ...tdStyle, textAlign: 'center', color: COLORS.textMuted, padding: '40px 24px' }}>
                    No orders found yet.
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// USER DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

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

  if (loading) return <LoadingScreen />;

  return (
    <Box className="dashboard-page" style={pageStyle}>
      {/* ── Gradient Header ── */}
      <Box style={{ ...headerGradient, background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 50%, #8B5CF6 100%)' }}>
        <Box style={headerOverlay} />
        <Box style={{ position: 'relative', zIndex: 1 }}>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
            Welcome back 👋
          </Text>
          <Text style={{ color: COLORS.textWhite, fontSize: '26px', fontWeight: '700', letterSpacing: '-0.01em' }}>
            {currentAdmin?.name || 'User'}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginTop: '6px' }}>
            Here's a summary of your account activity.
          </Text>
        </Box>
      </Box>

      {/* ── Personal Info + Stats ── */}
      <Box style={{ ...gridAuto('260px', '20px'), marginBottom: '28px' }}>
        {/* Profile Card */}
        <Box style={{ ...cardBase, padding: '28px', position: 'relative', overflow: 'hidden' }}>
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #A78BFA)',
            }}
          />
          <Box style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            {/* Avatar */}
            <Box
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: COLORS.textWhite,
                fontSize: '20px',
                fontWeight: '700',
                boxShadow: SHADOWS.glow('#6366F1'),
              }}
            >
              {(currentAdmin?.name || 'U').charAt(0).toUpperCase()}
            </Box>
            <Box>
              <Text style={{ fontWeight: '700', color: COLORS.textPrimary, fontSize: '16px' }}>
                {data?.user?.name}
              </Text>
              <Text style={{ fontSize: '13px', color: COLORS.textMuted }}>{data?.user?.email}</Text>
            </Box>
          </Box>
          {/* Info rows */}
          <Box style={{ borderTop: `1px solid ${COLORS.borderLight}`, paddingTop: '16px' }}>
            <Box style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Text style={{ fontSize: '12px', color: COLORS.textMuted, fontWeight: '500' }}>Role</Text>
              <Box
                as="span"
                style={{
                  background: '#EDE9FE',
                  color: '#7C3AED',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                }}
              >
                {data?.user?.role || currentAdmin?.role}
              </Box>
            </Box>
            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: '12px', color: COLORS.textMuted, fontWeight: '500' }}>Member since</Text>
              <Text style={{ fontSize: '12px', color: COLORS.textSecondary, fontWeight: '600' }}>
                {new Date(data?.user?.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Stat Cards */}
        <StatCard title="My Orders" value={data?.totalOrders ?? 0} icon="ShoppingCart" color={COLORS.green} />
        <StatCard
          title="Total Spent"
          value={`$${Number(data?.totalSpent ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon="DollarSign"
          color={COLORS.amber}
        />
      </Box>

      {/* ── Recent Orders ── */}
      <Box style={{ ...cardBase, overflow: 'hidden' }}>
        <Box style={{ padding: '24px 28px', borderBottom: `1px solid ${COLORS.border}` }}>
          <SectionTitle subtitle="Your latest transactions">My Recent Orders</SectionTitle>
        </Box>
        {data?.recentOrders?.length > 0 ? (
          <Box style={{ overflowX: 'auto' }}>
            <Box as="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <Box as="thead">
                <Box as="tr">
                  {['Order ID', 'Status', 'Total Amount', 'Date'].map((h) => (
                    <Box as="th" key={h} style={thStyle}>
                      {h}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box as="tbody">
                {data.recentOrders.map((order) => (
                  <Box as="tr" key={order.id} style={{ transition: 'background 0.15s ease' }}>
                    <Box as="td" style={{ ...tdStyle, fontWeight: '600' }}>
                      #{order.id}
                    </Box>
                    <Box as="td" style={tdStyle}>
                      <StatusBadge status={order.status} />
                    </Box>
                    <Box as="td" style={{ ...tdStyle, fontWeight: '600' }}>
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </Box>
                    <Box as="td" style={{ ...tdStyle, color: COLORS.textSecondary }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box style={{ padding: '48px', textAlign: 'center' }}>
            <Icon icon="ShoppingCart" size={32} color={COLORS.textMuted} />
            <Text style={{ color: COLORS.textMuted, marginTop: '12px', fontSize: '14px' }}>
              You haven't placed any orders yet.
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ROOT DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const Dashboard = () => {
  const [currentAdmin] = useCurrentAdmin();

  if (!currentAdmin) return <LoadingScreen />;

  if (currentAdmin.role === 'admin') {
    return <AdminDashboard />;
  }

  return <UserDashboard currentAdmin={currentAdmin} />;
};

export default Dashboard;
