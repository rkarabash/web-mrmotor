import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Grid, CardContent, Typography, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import { useState } from 'react';

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)'
});

const TitleStyle = styled(Typography)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
    transition: 'all 0.3s linear'
  }
});

const CoverImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number
};

export default function BlogPostCard({ post, index }) {
  const navigate = useNavigate();
  const { thumbnail, title, like, id } = post;
  const [likeFlag, setLikeFlag] = useState(true);
  const [thisLike, setLike] = useState(like);
  const latestPostLarge = true;
  const latestPost = index === 1 || index === 2;
  const likePost = () => {
    if (likeFlag) {
      setLikeFlag(false);
      const requestOptions = {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token')
        }
      };
      fetch(`https://mrmotor.herokuapp.com/posts/like?id=${id}`, requestOptions)
        .then(async (response) => {
          const data = await response;
          // check for error response
          if (!response.ok) {
            // get error message from body or default to response statusText
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
          }
          setLikeFlag(true);
          setLike(!thisLike);
        })
        .catch((error) => {
          console.error('There was an error!', error);
          alert('Wrong data inputed!');
          window.location.reload(false);
        });
    }
  };
  return (
    <Grid item xs={12} sm={6} md={6}>
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
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
              }
            }),
            ...(latestPostLarge && {
              pt: {
                xs: 'calc(100% * 2 / 3)',
                sm: 'calc(100% * 3 / 4.66)'
              }
            })
          }}
        >
          <Box
            style={{
              backgroundColor: '#636E72',
              padding: '5px 5px 0px',
              borderRadius: '10px',
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: '100'
            }}
            onClick={() => likePost()}
          >
            <Icon icon="bxs:star" color={thisLike ? '#FDCB6E' : '#DFE6E9'} width="24px" />
          </Box>
          <CoverImgStyle alt={title} src={thumbnail} />
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
            color="inherit"
            variant="subtitle2"
            onClick={() => navigate(`/app/post?id=${id}`, { replace: true, state: { post } })}
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
