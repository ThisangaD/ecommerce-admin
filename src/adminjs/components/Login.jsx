import React, { useState } from 'react';
import { Box, H2, Text, FormGroup, Label, Input, Button, Icon } from '@adminjs/design-system';

const Login = (props) => {
  const { action, message } = props;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="circuit-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="circuit-background"></div>
      <Box
        className="login-card-inner"
        style={{
          position: 'relative', // Ensure the form sits above the absolute background
          zIndex: 1,
          display: 'flex',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          width: '900px',
          maxWidth: '95%',
          minHeight: '500px',
        }}
      >
        {/* Left Side: Branding / Welcome */}
        <Box
          className="login-left-panel"
          style={{
            flex: 1,
            backgroundColor: '#4F46E5',
            padding: '40px',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          }}
        >
          {/* Custom Logo Image */}
          <img 
            src="/logo.png" 
            alt="Store Logo" 
            style={{ 
              maxWidth: '320px', 
              maxHeight: '140px',
              objectFit: 'contain',
              marginBottom: '32px',
              marginLeft: '10px'
            }} 
          />
          <div style={{ transform: 'translateY(-15px)' }}>
            <H2 style={{ color: '#FFFFFF', fontWeight: '800', marginBottom: '20px' }}>
              Premium Admin
            </H2>
            <Text style={{ fontSize: '16px', lineHeight: '1.6', opacity: 0.9 }}>
              Welcome to your eCommerce dashboard. Please sign in to securely manage your inventory, process orders, and oversee user activity.
            </Text>
          </div>
        </Box>

        {/* Right Side: Login Form */}
        <Box
          as="form"
          className="login-right-panel"
          action={action}
          method="POST"
          style={{
            flex: 1,
            padding: '60px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <H2 style={{ marginBottom: '8px', color: '#1E293B', fontWeight: '700' }}>Sign In</H2>
          <Text style={{ color: '#64748B', marginBottom: '32px' }}>Enter your credentials to continue</Text>

          {message && (
            <Box
              style={{
                backgroundColor: '#FEF2F2',
                color: '#EF4444',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px',
                border: '1px solid #FECACA'
              }}
            >
              {message}
            </Box>
          )}

          <FormGroup>
            <Label required>Email Address</Label>
            <Input name="email" type="email" placeholder="admin@example.com" required style={{ width: '100%', borderRadius: '8px' }} />
          </FormGroup>

          <FormGroup style={{ marginTop: '20px' }}>
            <Label required>Password</Label>
            <Box style={{ position: 'relative' }}>
              <Input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required 
                style={{ width: '100%', borderRadius: '8px', paddingRight: '40px' }} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0
                }}
              >
                <Icon icon={showPassword ? 'EyeOff' : 'Eye'} size={18} />
              </button>
            </Box>
          </FormGroup>

          <Button
            variant="primary"
            size="lg"
            type="submit"
            style={{
              marginTop: '32px',
              width: '100%',
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '12px',
              fontWeight: '600'
            }}
          >
            Login to Dashboard
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Login;
