import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Link, Card, Grid, CardContent, Box } from '@mui/material';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)'
});

const TitleStyle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical'
});

// ----------------------------------------------------------------------

QuizCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number
};

export default function QuizCard({ post, index }) {
  const { id, title } = post;
  const latestPostLarge = false;
  const latestPost = true;
  let color;
  let icon;
  if (index % 4 === 0) {
    color = '#74B9FF';
    icon = 'mdi:steering';
  } else if (index % 3 === 0) {
    color = '#00CEC9';
    icon = 'fa-solid:trophy';
  } else if (index % 2 === 0) {
    color = '#6C5CE7';
    icon = 'mdi:steering';
  } else {
    color = '#0984E3';
    icon = 'bxs:car';
  }
  return (
    <Grid item xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
      <Card sx={{ position: 'relative' }}>
        <CardMediaStyle
          sx={{
            ...((latestPostLarge || latestPost) && {
              pt: 'calc(100% * 4 / 3)',
              '&:after': {
                top: 0,
                content: "''",
                width: '100%',
                height: '100%',
                position: 'absolute',
                bgcolor: color
              }
            }),
            ...(latestPostLarge && {
              pt: {
                xs: 'calc(100% * 4 / 3)',
                sm: 'calc(100% * 3 / 4.66)'
              }
            })
          }}
        >
          <Box
            component={Icon}
            icon={icon}
            width="50%"
            height="auto"
            color="#FDCB6E"
            sx={{ position: 'absolute', top: '25%', 'z-index': 10, left: '5%' }}
          />
        </CardMediaStyle>

        <CardContent
          sx={{
            pt: 4,
            ...((latestPostLarge || latestPost) && {
              bottom: 0,
              width: '100%',
              position: 'absolute'
            })
          }}
        >
          <TitleStyle
            to={`/app/quiz?id=${id}`}
            color="inherit"
            variant="subtitle2"
            underline="hover"
            component={RouterLink}
            sx={{
              ...(latestPostLarge && { typography: 'h5', height: 60 }),
              ...((latestPostLarge || latestPost) && {
                color: 'common.white'
              })
            }}
          >
            {title}
          </TitleStyle>
        </CardContent>
      </Card>
    </Grid>
  );
}
