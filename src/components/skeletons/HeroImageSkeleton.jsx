import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  cardMedia: {
    marginTop: 0,
    // paddingTop: "56.25%", // 16:9
    paddingTop: '75%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: '37.5%'
    }
  }
}));

const HeroImageSkeleton = () => {
  const classes = useStyles();
  return <Skeleton className={classes.cardMedia}></Skeleton>;
};

export default HeroImageSkeleton;
