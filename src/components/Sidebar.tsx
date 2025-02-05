import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemText, Divider, useTheme, useMediaQuery } from '@mui/material';
import { LogoutOutlined, PeopleOutline } from '@mui/icons-material';

interface SidebarProps {
  onLogout: () => void;
}

function Sidebar({ onLogout }: SidebarProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box 
      sx={{ 
        width: isMobile ? '100%' : 260,
        backgroundColor: '#1976d2',
        color: 'white',
        minHeight: isMobile ? 'auto' : '100vh',
        p: 2,
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => handleNavigation('/')}
            sx={{ 
              borderRadius: 1,
              mb: 1,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <PeopleOutline sx={{ mr: 2 }} />
            <ListItemText 
              primary="Students" 
              primaryTypographyProps={{ 
                fontWeight: 'bold',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }} 
            />
          </ListItemButton>
        </ListItem>
        <Divider sx={{ my: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
        <ListItem disablePadding>
          <ListItemButton 
            onClick={onLogout}
            sx={{ 
              borderRadius: 1,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <LogoutOutlined sx={{ mr: 2 }} />
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ 
                fontWeight: 'bold',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }} 
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}

export default Sidebar;
