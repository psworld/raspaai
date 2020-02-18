import {
  Button,
  Container,
  Typography,
  Grid,
  Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AutoRotatingCarousel, Slide } from 'material-auto-rotating-carousel';
import React from 'react';
import { red, blue, green } from '@material-ui/core/colors';
import { Link } from 'gatsby';

const useStyles = makeStyles(theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
  heroButtons: {
    marginTop: theme.spacing(4)
  }
}));

// const HeroUnit = ({ location }) => {
//   const [open, setOpen] = React.useState(true);
//   return (
//     <div style={{ position: 'relative', width: '100%', height: 500 }}>
//       <Button onClick={() => setOpen({ open: true })}>Open carousel</Button>
//       <AutoRotatingCarousel
//         label='Get started'
//         open={open}
//         onClose={() => setOpen({ open: false })}
//         onStart={() => setOpen({ open: false })}
//         mobile
//         autoplay={false}
//         style={{ position: 'absolute' }}>
//         <Slide
//           media={
//             <img src='http://www.icons101.com/icon_png/size_256/id_79394/youtube.png' />
//           }
//           mediaBackgroundStyle={{ backgroundColor: red[400] }}
//           style={{ backgroundColor: red[600] }}
//           title='1 This is a very cool feature'
//           subtitle='Just using this will blow your mind.'
//         />
//         <Slide
//           media={
//             <img src='http://www.icons101.com/icon_png/size_256/id_80975/GoogleInbox.png' />
//           }
//           mediaBackgroundStyle={{ backgroundColor: blue[400] }}
//           style={{ backgroundColor: blue[600] }}
//           title='2 Ever wanted to be popular?'
//           subtitle='Well just mix two colors and your are good to go!'
//         />
//         <Slide
//           media={
//             <img src='http://www.icons101.com/icon_png/size_256/id_76704/Google_Settings.png' />
//           }
//           mediaBackgroundStyle={{ backgroundColor: green[400] }}
//           style={{ backgroundColor: green[600] }}
//           title='3 May the force be with you'
//           subtitle='The Force is a metaphysical and ubiquitous power in the Star Wars fictional universe.'
//         />
//         <Slide
//           media={
//             <img src='http://www.icons101.com/icon_png/size_256/id_76704/Google_Settings.png' />
//           }
//           mediaBackgroundStyle={{ backgroundColor: green[400] }}
//           style={{ backgroundColor: green[600] }}
//           title='4 May the force be with you'
//           subtitle='The Force is a metaphysical and ubiquitous power in the Star Wars fictional universe.'
//         />
//         <Slide
//           media={
//             <img src='http://www.icons101.com/icon_png/size_256/id_76704/Google_Settings.png' />
//           }
//           mediaBackgroundStyle={{ backgroundColor: green[400] }}
//           style={{ backgroundColor: green[600] }}
//           title='5 May the force be with you'
//           subtitle='The Force is a metaphysical and ubiquitous power in the Star Wars fictional universe.'
//         />
//         <Slide
//           media={
//             <img src='http://www.icons101.com/icon_png/size_256/id_76704/Google_Settings.png' />
//           }
//           mediaBackgroundStyle={{ backgroundColor: green[400] }}
//           style={{ backgroundColor: green[600] }}
//           title='6 May the force be with you'
//           subtitle='The Force is a metaphysical and ubiquitous power in the Star Wars fictional universe.'
//         />
//       </AutoRotatingCarousel>
//     </div>
//   );
// };

const HeroUnit = ({ location }) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.heroContent}>
        <Container maxWidth='sm'>
          <Typography
            component='h1'
            variant='h2'
            align='center'
            color='textPrimary'
            gutterBottom>
            Raspaai
          </Typography>
          <Typography
            variant='h5'
            align='center'
            color='textSecondary'
            paragraph>
            Raspaai | Find everything around you.
          </Typography>
          <div className={classes.heroButtons}>
            <Grid container spacing={2} justify='center'>
              <Grid item>
                <Button variant='contained' color='primary'>
                  {location.name}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  component={Link}
                  to='/set-location'
                  variant='outlined'
                  color='primary'>
                  set new location
                </Button>
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>
      <Divider></Divider>
    </>
  );
};

export default HeroUnit;
