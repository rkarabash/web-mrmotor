// material
import { Box, Grid, Container, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { ProfileItem } from '../sections/@app/profile';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function User() {
  if (localStorage.getItem('user') === null) return <Navigate to="/app/home" />;
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <Page title="Profile | Mr.Motor">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, {user.name}</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <ProfileItem
              icon="fontisto:favorite"
              color="#0984E3"
              url=""
              title="Favorite news and posts"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <ProfileItem
              icon="ri:survey-fill"
              color="#00CEC9"
              url="/app/myquizzes"
              title="My Quizzes"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <ProfileItem icon="foundation:results" color="#E17055" url="" title="My Quiz Results" />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
