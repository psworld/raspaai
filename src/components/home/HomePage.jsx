import React from 'react';
import Grid from '@material-ui/core/Grid';
import HeroUnit from './HeroUnit';
import ShopProductGrid from '../templates/ShopProductGrid';
import CombosGrid from '../templates/CombosGrid';

export default function HomePage(props) {
  const { shopProductNodeEdges, comboNodeEdges, location } = props;

  return (
    <React.Fragment>
      <HeroUnit location={location}></HeroUnit>
      <Grid container>
        <CombosGrid comboNodeEdges={comboNodeEdges}></CombosGrid>
        <ShopProductGrid shopProducts={shopProductNodeEdges}></ShopProductGrid>
      </Grid>
    </React.Fragment>
  );
}
