/**
 * @file Settings.jsx
 * @description Premium Settings page with modern design.
 * Admin-only: fetches settings from /api/settings and saves via PUT.
 * Non-admins see a styled "Access Denied" screen.
 */

import React, { useState, useEffect } from 'react';
import { Box, H2, Text, Button, Icon, Input, Label, FormGroup, Loader } from '@adminjs/design-system';
import { useCurrentAdmin } from 'adminjs';

// ─── Design Tokens ──────────────────────────────────────────────────────────

const COLORS = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  bgPage: '#F8FAFC',
  bgCard: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textWhite: '#FFFFFF',
  success: '#10B981',
  successBg: '#ECFDF5',
  successText: '#065F46',
  error: '#EF4444',
  errorBg: '#FEF2F2',
  errorText: '#991B1B',
  infoBg: '#EFF6FF',
  infoBorder: '#BFDBFE',
  infoText: '#1E40AF',
};

const SHADOWS = {
  card: '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.06)',
};

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
};

// ─── Component ──────────────────────────────────────────────────────────────

const Settings = () => {
  const [currentAdmin] = useCurrentAdmin();
  const [settings, setSettings] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch all settings from API on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        const obj = {};
        const desc = {};
        data.forEach((setting) => {
          obj[setting.key] = setting.value;
          desc[setting.key] = setting.description || '';
        });
        setSettings(obj);
        setDescriptions(desc);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setMessage({ type: 'error', text: 'Failed to load settings from server.' });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const promises = Object.entries(settings).map(([key, value]) =>
        fetch(`/api/settings/${key}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value }),
        }).then((r) => {
          if (!r.ok) throw new Error(`Failed to save ${key}`);
          return r.json();
        })
      );
      await Promise.all(promises);
      setMessage({ type: 'success', text: 'All settings have been saved successfully!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const formatLabel = (key) =>
    key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

  // ── Access Denied for non-admins ──
  if (!currentAdmin?.role || currentAdmin.role !== 'admin') {
    return (
      <Box style={{ ...pageStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Box style={{ textAlign: 'center' }}>
          <Box
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: '#FEF2F2',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Icon icon="Lock" size={28} color={COLORS.error} />
          </Box>
          <Text style={{ fontSize: '22px', fontWeight: '700', color: COLORS.error, marginBottom: '8px' }}>
            Access Denied
          </Text>
          <Text style={{ color: COLORS.textMuted, fontSize: '14px' }}>
            Only administrators can access system settings.
          </Text>
        </Box>
      </Box>
    );
  }

  // ── Loading ──
  if (loading) {
    return (
      <Box style={{ ...pageStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Box style={{ textAlign: 'center' }}>
          <Loader />
          <Text style={{ color: COLORS.textMuted, marginTop: '16px', fontSize: '14px' }}>Loading settings...</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box style={pageStyle}>
      {/* ── Gradient Header ── */}
      <Box
        style={{
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)',
          borderRadius: '20px',
          padding: '32px 36px',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Radial glow */}
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.15) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        <Box style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <Box>
            <Text style={{ color: COLORS.textWhite, fontSize: '26px', fontWeight: '700', letterSpacing: '-0.01em' }}>
              System Settings
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', marginTop: '6px' }}>
              Configure your store's global parameters. Changes are persisted to the database.
            </Text>
          </Box>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saving ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: COLORS.textWhite,
              borderRadius: '12px',
              padding: '10px 24px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: saving ? 'not-allowed' : 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
            }}
          >
            <Icon icon={saving ? 'Spinner' : 'Checkmark'} />
            {saving ? ' Saving...' : ' Save Changes'}
          </Button>
        </Box>
      </Box>

      {/* ── Status Message ── */}
      {message && (
        <Box
          style={{
            background: message.type === 'success' ? COLORS.successBg : COLORS.errorBg,
            color: message.type === 'success' ? COLORS.successText : COLORS.errorText,
            padding: '14px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: `1px solid ${message.type === 'success' ? '#A7F3D0' : '#FECACA'}`,
          }}
        >
          <Box
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: message.type === 'success' ? COLORS.success : COLORS.error,
              flexShrink: 0,
            }}
          />
          {message.text}
        </Box>
      )}

      {/* ── Settings Form ── */}
      <Box style={{ ...cardBase, overflow: 'hidden', marginBottom: '24px' }}>
        {Object.entries(settings).map(([key, value], index) => (
          <Box
            key={key}
            style={{
              padding: '24px 28px',
              borderBottom: index < Object.keys(settings).length - 1 ? `1px solid ${COLORS.borderLight}` : 'none',
              transition: 'background 0.15s ease',
            }}
          >
            <Box style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
              <Box style={{ flex: 1, minWidth: '200px' }}>
                <Text style={{ fontWeight: '600', color: COLORS.textPrimary, fontSize: '14px', marginBottom: '4px' }}>
                  {formatLabel(key)}
                </Text>
                {descriptions[key] && (
                  <Text style={{ fontSize: '12px', color: COLORS.textMuted, lineHeight: '1.5' }}>
                    {descriptions[key]}
                  </Text>
                )}
              </Box>
              <Box style={{ width: '320px', flexShrink: 0 }}>
                <Input
                  value={value || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    border: `1px solid ${COLORS.border}`,
                    padding: '10px 14px',
                    fontSize: '14px',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  }}
                  placeholder={`Enter ${formatLabel(key).toLowerCase()}`}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ── Info Tip Box ── */}
      <Box
        style={{
          background: COLORS.infoBg,
          border: `1px solid ${COLORS.infoBorder}`,
          borderRadius: '14px',
          padding: '20px 24px',
        }}
      >
        <Text style={{ fontWeight: '700', color: COLORS.infoText, fontSize: '14px', marginBottom: '10px' }}>
          💡 Configuration Tips
        </Text>
        <Box as="ul" style={{ paddingLeft: '20px', margin: 0 }}>
          {[
            'Changes are saved to the database and persist across server restarts.',
            'Use the "Save Changes" button to apply all modifications at once.',
            'Settings are loaded dynamically — refresh the page to verify your saved values.',
          ].map((tip, i) => (
            <Box as="li" key={i} style={{ color: '#1E3A5F', fontSize: '13px', lineHeight: '1.8' }}>
              {tip}
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Footer ── */}
      <Box style={{ marginTop: '28px', textAlign: 'center' }}>
        <Text style={{ color: COLORS.textMuted, fontSize: '12px' }}>
          💾 All changes are persisted to the database and will load on page refresh.
        </Text>
      </Box>
    </Box>
  );
};

export default Settings;
