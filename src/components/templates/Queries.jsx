import { gql } from 'apollo-boost';

export const PRODUCTS = gql`
  query(
    $phrase: String
    $endCursor: String
    $productType: String
    $withBrand: Boolean = true
  ) {
    products(
      first: 20
      phrase: $phrase
      after: $endCursor
      productType: $productType
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          title
          mrp
          thumb
          thumbOverlayText
          brand @include(if: $withBrand) {
            id
            publicUsername
            title
          }
        }
      }
    }
  }
`;
