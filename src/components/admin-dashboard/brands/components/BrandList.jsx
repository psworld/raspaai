import React from 'react';
import { ListItemText, ListItem, List } from '@material-ui/core';
import PaginationWithState from '../../../templates/PaginationWithState';
import Link from '../../../core/Link';

const BrandList = ({ data, fetchMore }) => {
  const baseUrl = `/raspaai/dashboard/brands`;

  const {
    allBrandApplications: { pageInfo, edges: brandApplicationsList }
  } = data;

  return (
    <List>
      {brandApplicationsList.map(brandApplicationObj => {
        const {
          id: applicationId,
          brand: { id: brandId, publicUsername, title }
        } = brandApplicationObj.node;
        return (
          <ListItem
            component={Link}
            to={`${baseUrl}/${publicUsername}/${applicationId}`}
            key={applicationId}>
            <ListItemText
              primary={publicUsername}
              secondary={title}></ListItemText>
          </ListItem>
        );
      })}
      <ListItem>
        <PaginationWithState
          pageInfo={pageInfo}
          fetchMore={fetchMore}></PaginationWithState>
      </ListItem>
    </List>
  );
};

export default BrandList;
