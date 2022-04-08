import { Navigate } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Stack, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { UpdateForm } from '../sections/authentication/update';
import { ChangePasswordForm } from '../sections/authentication/change-password';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: '0 auto',
  display: 'flex',
  minHeight: '45vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(0, 0)
}));

// ----------------------------------------------------------------------

export default function Settings() {
  if (localStorage.getItem('token') === null) {
    return <Navigate to="/app/home" />;
  }
  return (
    <RootStyle title="Settings | Mr. Motor">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" gutterBottom>
            Settings
          </Typography>
        </Stack>
        <ContentStyle>
          <UpdateForm />
          <div
            style={{
              width: '100%',
              backgroundColor: '#636E72',
              margin: '30px 0 15px',
              fontSize: 0,
              height: '8px',
              borderRadius: '10px'
            }}
          >
            s
          </div>
          <Typography variant="h5" gutterBottom sx={{ marginBottom: '15px' }}>
            Change Password
          </Typography>
          <ChangePasswordForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
