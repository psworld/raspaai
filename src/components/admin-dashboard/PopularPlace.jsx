import React from 'react';
import { gql } from 'apollo-boost';
import { Container, TextField, ListItem, Button } from '@material-ui/core';
import { useMutation, useQuery } from 'react-apollo';
import GraphqlErrorMessage from '../core/GraphqlErrorMessage';
import Loading from '../core/Loading';

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

const EDIT_POPULAR_PLACE = gql`
  mutation($data: AdminEditPopularPlaceInput!) {
    adminEditPopularPlace(input: $data) {
      popularPlace {
        id
        geometry {
          coordinates
        }
        properties {
          name
          image
        }
      }
    }
  }
`;

const POPULAR_PLACE = gql`
  query($popularPlaceId: ID!) {
    popularPlace(id: $popularPlaceId) {
      id
      geometry {
        coordinates
      }
      properties {
        name
        image
      }
    }
  }
`;

export const EditPopularPlace = ({ popularPlaceId }) => {
  const [values, setValues] = React.useState({});

  const handleFileChange = e => {
    const files = e.target.files;
    const file = files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = fileLoadEvent => {
      const { result } = fileLoadEvent.target;
      setValues({ ...values, img64: result });
    };
  };

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const { loading, error, data } = useQuery(POPULAR_PLACE, {
    variables: { popularPlaceId }
  });

  const [
    saveChanges,
    { loading: mutationLoading, error: mutationError, data: mutationData }
  ] = useMutation(EDIT_POPULAR_PLACE, {
    variables: {
      data: { popularPlaceId, ...values }
    }
  });

  if (loading) return <Loading></Loading>;
  if (error) return <GraphqlErrorMessage error={error}></GraphqlErrorMessage>;
  if (data) {
    const {
      geometry: { coordinates },
      properties: { name, image }
    } = data.popularPlace;

    const lat = coordinates[1];
    const lng = coordinates[0];
    const latLng = `${lat}, ${lng}`;
    let imgSrc = values.img64
      ? values.img64
      : image && `${process.env.GATSBY_IMG_URL_PRE}/${image}`;

    return (
      <Container maxWidth='sm'>
        <input
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept='image/*'
          id='place-image'
          type='file'
        />
        <img src={imgSrc} alt={name} width='240px'></img>
        <ListItem>
          <label htmlFor='place-image'>
            <Button variant='outlined' color='primary' component='span'>
              Upload image of the place
            </Button>
          </label>
        </ListItem>
        <ListItem>
          <TextField
            id='place-name'
            name='name'
            defaultValue={name}
            fullWidth
            onChange={handleChange}
            label='Place Name'
            variant='outlined'
          />
        </ListItem>
        <ListItem>
          <TextField
            id='place-coordinates'
            placeholder='31.213412, 71.2376182'
            defaultValue={latLng}
            fullWidth
            onChange={handleChange}
            name='latLng'
            label='Place Coordinates'
            variant='outlined'
          />
        </ListItem>
        <ListItem>
          <Button
            onClick={saveChanges}
            disabled={mutationLoading}
            variant='contained'
            color='primary'>
            Save changes
          </Button>
          <Button
            onClick={() =>
              saveChanges({
                variables: { data: { popularPlaceId, delete: true } }
              })
            }
            disabled={mutationLoading}
            variant='contained'
            color='secondary'>
            Delete
          </Button>
        </ListItem>
        <ListItem>
          {mutationError && (
            <GraphqlErrorMessage error={mutationError}></GraphqlErrorMessage>
          )}
          {mutationData && <p>Changes saved successfully</p>}
        </ListItem>
      </Container>
    );
  }
};

const AddPopularPlace = () => {
  const [values, setValues] = React.useState({});

  const handleFileChange = e => {
    const files = e.target.files;
    const file = files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = fileLoadEvent => {
      const { result } = fileLoadEvent.target;
      setValues({ ...values, img64: result });
    };
  };

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [addPlace, { loading, error, data }] = useMutation(ADD_POPULAR_PLACE, {
    variables: {
      ...values
    }
  });

  const { img64 } = values;

  return (
    <Container maxWidth='sm'>
      <input
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept='image/*'
        id='place-image'
        type='file'
      />
      {img64 && <img src={img64} alt='Place' width='240px'></img>}
      <ListItem>
        <label htmlFor='place-image'>
          <Button variant='outlined' color='primary' component='span'>
            Upload image of the place
          </Button>
        </label>
      </ListItem>
      <ListItem>
        <TextField
          id='place-name'
          name='name'
          fullWidth
          onChange={handleChange}
          label='Place Name'
          variant='outlined'
        />
      </ListItem>
      <ListItem>
        <TextField
          id='place-coordinates'
          placeholder='31.213412, 71.2376182'
          fullWidth
          onChange={handleChange}
          name='latLng'
          label='Place Coordinates'
          variant='outlined'
        />
      </ListItem>
      <ListItem>
        <Button
          onClick={addPlace}
          disabled={loading}
          variant='contained'
          color='primary'>
          Add Place
        </Button>
      </ListItem>
      <ListItem>
        {error && <GraphqlErrorMessage error={error}></GraphqlErrorMessage>}
        {data && <p>Added successfully</p>}
      </ListItem>
    </Container>
  );
};

export default AddPopularPlace;
