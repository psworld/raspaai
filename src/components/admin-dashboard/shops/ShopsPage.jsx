import React from 'react';

import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import { List, ListItem, Button } from '@material-ui/core';
import Link from '../../core/Link';

const SHOPS = gql`
  query(
    $category: String!
    $shopUsername: String
    $searchByUsername: Boolean = false
    $userEmail: String
    $endCursor: String
  ) {
    adminShops(
      category: $category
      shopUsername: $shopUsername
      searchByUsername: $searchByUsername
      userEmail: $userEmail
      first: 50
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          properties {
            publicUsername
            isApplication
            heroImage
            title
            address
            applicationStatus {
              statusCode
              title
            }
            applicationDate
            errors
          }
        }
      }
    }
  }
`;

export default function ShopsPage() {
  // const { loading, error, data } = useQuery(SHOPS, {
  //   variables: { category, endCursor: pageInfo[pageNo - 1].startCursor }
  // });

  const shopActionList = [
    { title: 'Add shop', url: 'add' },
    { title: 'Add plan to shop', url: 'add-plan' }
  ];

  return (
    <div>
      <List>
        {shopActionList.map(action => (
          <ListItem key={action.title}>
            <Button
              component={Link}
              variant='outlined'
              to={`${window.location.pathname}/${action.url}`}>
              {action.title}
            </Button>
          </ListItem>
        ))}
      </List>
      {/* {data && data.adminShops && (
          <ShopList
            pageNo={pageNo}
            setPageNo={setPageNo}
            setPageInfo={setPageInfo}
            pageInfo={pageInfo}
            data={data}
          ></ShopList>
        )} */}
    </div>
  );
}
