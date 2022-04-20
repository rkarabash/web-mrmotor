// material
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { Typography, Box } from '@mui/material';
//
import { Icon } from '@iconify/react';

// ---------------------------------------------------------------------
export default function AppItemOrders({ url, icon, title, color }) {
  const navigate = useNavigate();
  const RootStyle = styled(Box)(({ theme }) => ({
    boxShadow: 'none',
    position: 'relative',
    padding: theme.spacing(2, 0),
    borderRadius: '20px',
    minHeight: '200px',
    // paddingTop: 'calc(100% * 3 / 18)',
    width: '100%',
    color: theme.palette.text.primary,
    backgroundColor: color
  }));
  return (
    <RootStyle onClick={() => navigate(url, { replace: true })}>
      <Box
        component={Icon}
        icon={icon}
        width="auto"
        height="50%"
        color="#FDCB6E"
        sx={{ position: 'absolute', top: '5%', 'z-index': 10, right: '5%' }}
      />
      <Typography variant="h3" sx={{ margin: 2, bottom: '0px', position: 'absolute' }}>
        {title}
      </Typography>
    </RootStyle>
  );
}
