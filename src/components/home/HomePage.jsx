import React from 'react';
import Grid from '@material-ui/core/Grid';
import HeroUnit from './HeroUnit';
import ShopProductGrid from '../templates/ShopProductGrid';
import CombosGrid from '../templates/CombosGrid';
import SEO from '../seo';

export default function HomePage(props) {
  const { shopProductNodeEdges, comboNodeEdges, location } = props;

  return (
    <React.Fragment>
      <SEO
        title='Raspaai | Shop online for nearby products, services from various categories like Electronics, food, books etc'
        description='Shop or search for nearby services, products, shops. Buy electronics, books, food items, etc'></SEO>
      <HeroUnit location={location}></HeroUnit>
      <Grid container>
        <CombosGrid comboNodeEdges={comboNodeEdges}></CombosGrid>
        <ShopProductGrid shopProducts={shopProductNodeEdges}></ShopProductGrid>
      </Grid>
    </React.Fragment>
  );
}
