import React, { useState, useEffect } from 'react';
import { Box, H1, Text, Button, Input, Label, Section, ApiClient } from '@adminjs/design-system';

const api = new ApiClient();

const Settings = (props) => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.resourceAction({
        resourceId: 'Setting',
        actionName: 'list',
      });
      setSettings(response.data.records);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
    }
  };

  if (loading) return <Box>Loading...</Box>;

  return (
    <Box variant="grey" padding="xl">
      <Box variant="white" padding="xl" marginBottom="xl">
        <H1>System Settings</H1>
        <Text>Configure your eCommerce system</Text>
      </Box>

      <Box variant="white" padding="xl">
        {settings.map((record) => (
          <Box key={record.id} marginBottom="lg" borderBottom="1px solid #eee" paddingBottom="md">
            <Label>{record.params.key}</Label>
            <Text color="grey60">{record.params.description}</Text>
            <Input 
              value={record.params.value} 
              readOnly 
              style={{ marginTop: '8px', background: '#f9f9f9' }}
            />
            <Text size="sm" color="grey40" marginTop="sm">
              Use the Setting resource to edit this value.
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Settings;
