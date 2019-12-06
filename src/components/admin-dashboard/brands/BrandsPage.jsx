import React from 'react';
import BrandList from './components/BrandList';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import Loading from '../../core/Loading';
import GraphqlErrorMessage from '../../core/GraphqlErrorMessage';

export const BRANDS_LIST = gql`
  query($endCursor: String, $applicationId: ID) {
    allBrandApplications(first: 10, after: $endCursor, id: $applicationId) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          brand {
            id
            owner {
              id
              email
              firstName
              lastName
            }
            publicUsername
            title
            heroImage
          }
          submittedAt
          status {
            id
            statusCode
            title
            description
          }
        }
      }
    }
  }
`;

export default function BrandsPage() {
  const { loading, error, data, fetchMore } = useQuery(BRANDS_LIST);

  if (loading) return <Loading></Loading>;
  if (error) return <GraphqlErrorMessage></GraphqlErrorMessage>;

  if (data) {
    return (
      <div>
        {data && data.allBrandApplications && (
          <BrandList fetchMore={fetchMore} data={data}></BrandList>
        )}
      </div>
    );
  }
}
