import React from 'react';
import { Box, H1, H2, Text } from '@adminjs/design-system';

const Dashboard = (props) => {
  return (
    <Box variant="grey">
      <Box variant="white" padding="xl" marginBottom="xl">
        <H1>Dashboard</H1>
        <Text>Welcome back! Here's your business overview.</Text>
      </Box>
      
      <Box flex flexWrap="wrap" justifyContent="space-between">
        <Box width={[1, 1/2, 1/4]} padding="md">
          <Box variant="white" padding="lg">
            <Text color="grey60">Total Users</Text>
            <H2>2,847</H2>
          </Box>
        </Box>
        <Box width={[1, 1/2, 1/4]} padding="md">
          <Box variant="white" padding="lg">
            <Text color="grey60">Total Orders</Text>
            <H2>1,234</H2>
          </Box>
        </Box>
        <Box width={[1, 1/2, 1/4]} padding="md">
          <Box variant="white" padding="lg">
            <Text color="grey60">Total Products</Text>
            <H2>456</H2>
          </Box>
        </Box>
        <Box width={[1, 1/2, 1/4]} padding="md">
          <Box variant="white" padding="lg">
            <Text color="grey60">Revenue</Text>
            <H2>$128,450</H2>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
