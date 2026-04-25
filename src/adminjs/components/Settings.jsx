/**
 * @file Settings.jsx
 * @description Database-backed Settings page: Fetches from /api/settings, saves via PUT.
 *              Admin-only: non-admins see "Access Denied".
 */

import React, { useState, useEffect } from 'react';
import { Box, H2, Text, Button, Icon, Input, Label, FormGroup, Loader } from '@adminjs/design-system';
import { useCurrentAdmin } from 'adminjs';

const Settings = () => {
  const [currentAdmin] = useCurrentAdmin();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch all settings from API on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        // Convert array of {id, key, value, ...} to object {key: value}
        const obj = {};
        data.forEach((setting) => {
          obj[setting.key] = setting.value;
        });
        setSettings(obj);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setMessage({ type: 'error', text: 'Failed to load settings' });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle input changes
  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Save settings to database
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // Save each setting via PUT /api/settings/:key
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
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  // Admin-only role guard
  if (!currentAdmin?.role || currentAdmin.role !== 'admin') {
    return (
      <Box flex justifyContent="center" alignItems="center" height="100vh" padding="xl">
        <Box textAlign="center">
          <H2 style={{ fontWeight: '700', color: '#DC2626', marginBottom: '12px' }}>Access Denied</H2>
          <Text color="#6B7280">Only administrators can access settings.</Text>
        </Box>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box flex justifyContent="center" alignItems="center" height="100vh">
        <Loader />
      </Box>
    );
  }

  return (
    <Box padding={['medium', 'large', 'xl']} style={{ background: '#F9FAFB', minHeight: '100vh' }}>
      <Box
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          maxWidth: '800px',
          margin: '0 auto',
          border: '1px solid #E5E7EB',
        }}
      >
        {/* Header */}
        <Box
          style={{
            borderBottom: '2px solid #F3F4F6',
            paddingBottom: '24px',
            marginBottom: '32px',
          }}
        >
          <H2 style={{ fontWeight: '700' }}>System Settings</H2>
          <Text color="#6B7280" marginTop="xs">Manage your store's global parameters. Changes are saved to database.</Text>
        </Box>

        {/* Status Message */}
        {message && (
          <Box
            style={{
              background: message.type === 'success' ? '#D1FAE5' : '#FEE2E2',
              color: message.type === 'success' ? '#065F46' : '#991B1B',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            {message.text}
          </Box>
        )}

        {/* Settings Form */}
        <Box>
          {Object.entries(settings).map(([key, value]) => (
            <FormGroup key={key} style={{ marginBottom: '24px' }}>
              <Label style={{ fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}
              </Label>
              <Input
                value={value || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                width="100%"
                placeholder={`Enter ${key}`}
              />
            </FormGroup>
          ))}

          {/* Save Button */}
          <Box flex justifyContent="flex-end" marginTop="32px">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSave}
              disabled={saving}
              style={{ opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              <Icon icon={saving ? 'Spinner' : 'Checkmark'} />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>
        </Box>
      </Box>

      <Box marginTop="xl" textAlign="center">
        <Text color="#9CA3AF" fontSize="sm">
          💾 All changes are persisted to the database and will load on page refresh.
        </Text>
      </Box>
    </Box>
  );
};

export default Settings;
