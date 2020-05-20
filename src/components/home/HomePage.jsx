import React from 'react';
import Grid from '@material-ui/core/Grid';
import HeroUnit from './HeroUnit';
import ShopProductGrid from '../templates/ShopProductGrid';
import CombosGrid from '../templates/CombosGrid';
import SEO from '../seo';
import { Typography } from '@material-ui/core';

export default function HomePage(props) {
  const { shopProductNodeEdges, comboNodeEdges, location } = props;

  return (
    <React.Fragment>
      <SEO
        title='Raspaai | Shop online for nearby products or services.'
        description='Raspaai: Shop or search for nearby services, nearby stores, local shops, products. Buy electronics, books, food items at local best price. Register with us and make free website of your shop.'></SEO>
      <HeroUnit location={location}></HeroUnit>
      {shopProductNodeEdges.length === 0 ? (
        <Typography variant='h5' align='center'>
          Sorry! No products found at your location. Try changing your location
        </Typography>
      ) : (
        <Grid container>
          <CombosGrid comboNodeEdges={comboNodeEdges}></CombosGrid>
          <ShopProductGrid
            shopProducts={shopProductNodeEdges}></ShopProductGrid>
        </Grid>
      )}
    </React.Fragment>
  );
}
