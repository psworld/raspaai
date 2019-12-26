import React from 'react';
import { Grid, Typography, Box } from '@material-ui/core';
import Link from '../core/Link';
import { slugGenerator } from '../core/utils';
import ProductCollage from './dashboard/ProductCollage';

const ComboElement = ({ comboNode }) => {
  const {
    id: comboId,
    name: comboName,
    thumbs,
    offeredPrice,
    shop: {
      properties: { title: shopName, publicUsername: shopUsername }
    }
  } = comboNode;

  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Box px={1} my={1}>
        <Link
          to={`/shop/${shopUsername}/combo/${slugGenerator(
            comboName
          )}/${comboId}`}>
          <ProductCollage thumbs={thumbs} title={comboName}></ProductCollage>
          <Typography title={comboName} variant='body2' color='textPrimary'>
            {comboName}
          </Typography>
        </Link>

        <Typography display='block' variant='caption' color='primary'>
          <Link to={`/shop/${shopUsername}`}>{shopName}</Link>
        </Typography>
        <Typography
          variant='body2'
          style={{
            color: 'green'
          }}>
          &#8377; {offeredPrice}
        </Typography>
      </Box>
    </Grid>
  );
};

const CombosGrid = ({ comboNodeEdges }) => {
  return (
    <>
      {comboNodeEdges.map(combo => {
        return (
          <ComboElement
            key={combo.node.id}
            comboNode={combo.node}></ComboElement>
        );
      })}
    </>
  );
};

export default CombosGrid;
