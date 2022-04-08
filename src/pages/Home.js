// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { ProfileItem } from '../sections/@app/profile';

// ----------------------------------------------------------------------

export default function Home() {
  return (
    <Page title="Home | Mr.Motor">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Car Enthusiast</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <ProfileItem
              icon="ri:survey-fill"
              color="#0984E3"
              url="/app/quizzes"
              title="Learn by Quiz"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <ProfileItem
              icon="fluent:news-24-filled"
              color="#00CEC9"
              url="/app/news"
              title="What's new in the auto industry"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <ProfileItem
              icon="bxs:car"
              color="#E17055"
              url="/app/cars"
              title="Explore interesting vehicles"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <ProfileItem
              icon="mdi:steering"
              color="#0984E3"
              url="/app/racers"
              title="People who changed the industry"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <ProfileItem
              icon="fa-solid:trophy"
              color="#74B9FF"
              url="/app/competitions"
              title="The Greatest Competitions"
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
