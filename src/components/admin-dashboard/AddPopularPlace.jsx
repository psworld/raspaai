import React from 'react';
import { gql } from 'apollo-boost';

const ADD_POPULAR_PLACE = gql`
  mutation($latLng: String!, $name: String!) {
    adminAddPopularPlace(input: { latLng: $latLng, name: $name }) {
      popularPlace {
        id
        geometry {
          coordinates
        }
        properties {
          name
        }
      }
    }
  }
`;

const AddPopularPlace = () => {
  return <div>Add popular place here</div>;
};

export default AddPopularPlace;
