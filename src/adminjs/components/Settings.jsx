/**
 * @file Settings.jsx
 * @description Modern Settings page for AdminJS.
 */

import React from 'react';
import { Box, H2, Text, Button, Icon, Input, Label, FormGroup } from '@adminjs/design-system';

const Settings = () => {
  return (
    <Box 
      padding={['medium', 'large', 'xl']} 
      style={{ background: '#F9FAFB', minHeight: '100vh' }}
    >
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
        <Box 
          style={{
            borderBottom: '2px solid #F3F4F6',
            paddingBottom: '24px',
            marginBottom: '32px',
          }}
        >
          <H2 style={{ fontWeight: '700' }}>System Settings</H2>
          <Text color="#6B7280" marginTop="xs">Configure your store's global parameters and preferences.</Text>
        </Box>

        <Box>
          <FormGroup>
            <Label>Store Name</Label>
            <Input defaultValue="My Awesome Store" width="100%" />
          </FormGroup>

          <FormGroup style={{ marginTop: '24px' }}>
            <Label>Currency</Label>
            <Input defaultValue="USD" width="100%" />
          </FormGroup>

          <FormGroup style={{ marginTop: '24px' }}>
            <Label>Support Email</Label>
            <Input defaultValue="support@example.com" width="100%" />
          </FormGroup>

          <Box flex justifyContent="flex-end" marginTop="32px">
            <Button variant="primary" size="lg" onClick={(e) => e.preventDefault()}>
              <Icon icon="Checkmark" />
              Save Settings
            </Button>
          </Box>
        </Box>
      </Box>

      <Box marginTop="xl" textAlign="center">
        <Text color="#9CA3AF" fontSize="sm">
          Tip: These settings apply to all users across the platform.
        </Text>
      </Box>
    </Box>
  );
};

export default Settings;
