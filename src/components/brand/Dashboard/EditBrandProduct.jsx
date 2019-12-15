import React from 'react';
import { PRODUCT } from '../BrandProductPage';
import {
  Grid,
  Button,
  List,
  ListItem,
  Typography,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import { Carousel } from 'react-responsive-carousel';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo';
import Loading from '../../core/Loading';
import ErrorPage from '../../core/ErrorPage';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const CATEGORIES = gql`
  {
    categories {
      edges {
        node {
          id
          name
          technicalDetailsTemplate
          producttypeSet {
            edges {
              node {
                id
                name
                technicalDetailsTemplate
              }
            }
          }
        }
      }
    }
  }
`;

const MODIFY_BRAND_PRODUCT = gql`
  mutation($data: ModifyBrandProductInput!) {
    modifyBrandProduct(input: $data) {
      product {
        id
        title
        mrp
        description
        longDescription
      }
    }
  }
`;

export const ModifyBrandProduct = ({
  product,
  brandUsername,
  action,
  imgNodeList
}) => {
  const classes = useStyles();

  const {
    id,
    title: productTitle,
    mrp,
    description,
    longDescription,
    category: { id: categoryId },
    type: { id: typeId },
    // isAvailable,
    technicalDetails: technicalDetailsJsonString
  } = product;

  const [images, setImages] = React.useState({
    imagesList: imgNodeList,
    delete: [],
    invalidImages: false,
    imageFiles: false,
    showThumbs: true
  });
  const { imagesList, invalidImages, showThumbs } = images;

  const [values, setValues] = React.useState({
    productTitle: '',
    description: '',
    longDescription: '',
    categoryId,
    typeId
  });

  const [currentImageNewPosition, setCurrentImageNewPosition] = React.useState(
    1
  );

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const { data: categoriesData } = useQuery(CATEGORIES);

  // Category types filtering
  const currentCategory =
    categoriesData && values.categoryId
      ? categoriesData.categories.edges.filter(
          e => e.node.id === values.categoryId
        )[0].node
      : null;

  const currentCategoryProductTypes =
    currentCategory && currentCategory.producttypeSet.edges.length !== 0
      ? currentCategory.producttypeSet.edges
      : null;

  const currentProductType =
    currentCategoryProductTypes &&
    values.typeId &&
    currentCategoryProductTypes.filter(e => e.node.id === values.typeId)
      .length !== 0
      ? currentCategoryProductTypes.filter(e => e.node.id === values.typeId)[0]
          .node
      : null;
  // category types filtering end

  const [technicalDetailsValues, setTechnicalDetailsValues] = React.useState(
    {}
  );

  const handleTechnicalDetailChanges = key => event => {
    setTechnicalDetailsValues({
      ...technicalDetailsValues,
      [event.target.id]: event.target.value
    });
  };

  const technicalDetails =
    categoryId === values.categoryId && typeId === values.typeId
      ? JSON.parse(technicalDetailsJsonString)
      : currentCategory && currentProductType
      ? {
          ...JSON.parse(currentCategory.technicalDetailsTemplate),
          ...JSON.parse(currentProductType.technicalDetailsTemplate)
        }
      : {};

  // handle image delete

  const handleImageDelete = () => {
    const imgId = imagesList[currentImageIndex].node.id;
    if (imgId.includes('blob')) {
      setImages({
        ...images,
        imagesList: imagesList.filter(e => e.node.id !== imgId)
      });
    } else {
      let deletedList = images64.delete;
      deletedList.push(imgId);
      setImages({
        ...images,
        delete: deletedList,
        imagesList: imagesList.filter(e => e.node.id !== imgId)
      });
    }
  };

  const handlePositionChange = () => {
    const newPosition = currentImageNewPosition - 1;

    const currentImagePosition = imagesList[currentImageIndex].node.position;

    const newImagesList = [...imagesList];

    // img that is already at new position swap the positions
    // sometimes there is no image at new position
    // so only swap when both parties are available
    if (imagesList.find(e => e.node.position === newPosition)) {
      newImagesList.find(
        e => e.node.position === newPosition
      ).node.position = currentImagePosition;
    }

    newImagesList[currentImageIndex].node.position = newPosition;
    newImagesList.sort((a, b) => a.node.position - b.node.position);

    setImages({
      ...images,
      imagesList: newImagesList
    });
  };

  // Images files handling
  const handleFileChange = files => {
    const filesArray = Array.from(files);
    const newImageFiles = [];

    validateImages();
    function validateImages() {
      let allInvalidImages = new Promise(resolveAllInvalidImages => {
        const imagesListLength = imagesList.length;
        const invalidImages = [];
        let i = 0;
        filesArray.forEach((file, index) => {
          const reader = new FileReader();
          const img = new Image();
          const imgSrc = URL.createObjectURL(file);
          img.src = imgSrc;
          reader.readAsDataURL(file);
          const invalidImage = new Promise(resolveInvalidImg => {
            reader.onload = e => {
              const { result: base64 } = e.target;
              img.onload = () => {
                const { naturalWidth: width, naturalHeight: height } = img;

                const image = {
                  url: img.src,
                  position: imagesListLength + index,
                  width,
                  height,
                  base64,
                  ratio: Math.round((width / height) * 100),
                  name: file.name,
                  size: file.size
                };

                if (image.ratio !== 80 || image.size / 1000 > 100) {
                  resolveInvalidImg(image);
                } else {
                  newImageFiles.push(image);
                  resolveInvalidImg(false);
                }
                i++;
              };
            };
          });
          invalidImage.then(invalidImage => {
            if (invalidImage) {
              invalidImages.push(invalidImage);
            }
            if (filesArray.length === i) {
              resolveAllInvalidImages(invalidImages);
              setImages({ ...images, showThumbs: false });
            }
          });
        });
      });

      allInvalidImages.then(invalidImages => {
        if (invalidImages.length !== 0) {
          setImages({
            ...images,
            invalidImages: invalidImages
          });
        } else {
          let modifiedImageFiles = [];
          newImageFiles.forEach(img => {
            const image = {
              node: {
                id: img.url,
                name: img.name,
                base64: img.base64,
                position: img.position
              }
            };
            modifiedImageFiles.push(image);
          });

          modifiedImageFiles.sort((a, b) => a.node.position - b.node.position);
          let newImagesList = imagesList.concat(modifiedImageFiles);

          setImages({
            ...images,
            imagesList: newImagesList,
            invalidImages: false,
            showThumbs: true
          });
        }
      });
    }
  };
  // Images files handling ends

  // handleValuesChange
  const handleChange = name => event => {
    if (name === 'mrp' || name === 'currentImageNewPosition') {
      setValues({
        ...values,
        [name]: parseInt(event.target.value)
      });
    } else {
      setValues({
        ...values,
        [name]: event.target.value
      });
    }
  };

  // only add fields in mutation input which are changed
  const serverImages = imagesList.filter(e => !e.node.id.includes('blob'));

  const positionToChange = [];
  serverImages.forEach(img => {
    if (
      img.node.id !==
      imgNodeList.find(e => e.node.position === img.node.position).node.id
    ) {
      positionToChange.push({
        id: img.node.id,
        newPosition: img.node.position
      });
    }
  });

  const newImagesToAdd = imagesList.filter(e => e.node.id.includes('blob'));

  const images64 = {
    add: newImagesToAdd,
    delete: images.delete,
    change: positionToChange
  };
  const modifyBrandProductInput = {
    productId: id,
    images64: JSON.stringify(images64)
  };

  Object.keys(values).forEach((key, index) => {
    const value = values[key];
    if (key === 'categoryId' && value === categoryId) {
    } else if (key === 'typeId' && value === typeId) {
    } else if (value !== '') {
      modifyBrandProductInput[key] = value;
    }
  });

  if (JSON.stringify(technicalDetailsValues) !== '{}') {
    modifyBrandProductInput['technicalDetails'] = JSON.stringify(
      technicalDetailsValues
    );
  }

  // modify product
  const [modifyProduct, { loading, error, data }] = useMutation(
    MODIFY_BRAND_PRODUCT,
    { variables: { data: modifyBrandProductInput } }
  );

  //Character length limit
  const shortDescriptionLengthLimit = 200;
  const longDescriptionLengthLimit = 1000;

  return (
    <Grid container>
      <Grid item xs={12} sm={6} md={4}>
        {invalidImages && (
          <List>
            <ListItem>
              <Typography variant='h5' color='secondary'>
                Following images are invalid
              </Typography>
            </ListItem>
            {invalidImages.map((img, index) => {
              const { url, width, height, ratio, name, size } = img;
              return (
                <ListItem key={index}>
                  <a href={url} target='_blank' rel='noopener noreferrer'>
                    <ListItemText
                      primary={name}
                      secondary={`size:${size /
                        1000}Kb width:${width} height:${height} ratio=(width/height)x100=${ratio}`}></ListItemText>
                  </a>
                </ListItem>
              );
            })}
          </List>
        )}
        {imagesList.length !== 0 ? (
          <>
            <Carousel
              selectedItem={currentImageIndex}
              onChange={currentPosition =>
                setCurrentImageIndex(currentPosition)
              }
              showThumbs={showThumbs}
              infiniteLoop
              showArrows={true}>
              {imagesList.map((imgObj, index) => {
                const { base64: src } = imgObj.node;
                return (
                  <div key={index}>
                    <img
                      src={src}
                      style={{ maxHeight: '56.25%', maxWidth: '100%' }}
                      alt={productTitle}></img>
                  </div>
                );
              })}
            </Carousel>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <InputLabel htmlFor='add-product-image'>
                  <Button color='primary' variant='contained' component='span'>
                    Add
                  </Button>
                </InputLabel>
              </Grid>
              <Grid item xs={6}>
                <Button
                  onClick={() => handleImageDelete()}
                  color='secondary'
                  variant='contained'
                  component='span'>
                  Delete
                </Button>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type='number'
                  error={
                    currentImageNewPosition < 1 ||
                    currentImageNewPosition > imagesList.length
                  }
                  defaultValue={currentImageNewPosition}
                  variant='outlined'
                  onChange={e => setCurrentImageNewPosition(e.target.value)}
                  placeholder='Enter the position'></TextField>
              </Grid>
              <Grid item xs={6}>
                <Button
                  onClick={() => handlePositionChange()}
                  color='primary'
                  variant='outlined'>
                  Set Position
                </Button>
              </Grid>
              <Button
                // onClick={() => setShowThumbs(false)}
                variant='outlined'
                color='secondary'
                component='span'>
                Delete all
              </Button>
            </Grid>
          </>
        ) : (
          <List>
            <ListItem>
              <ListItemText primary='Each image should be less than 100Kb.'></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText
                primary='Images should be of 4:5 ratio. That is width divided by height and then multiplying by 100 should approximately equal to 80'
                secondary={'(width/height)x100 ~ 80'}></ListItemText>
            </ListItem>
            <ListItem>
              <InputLabel htmlFor='add-product-image'>
                <Button variant='contained' component='span'>
                  Upload
                </Button>
              </InputLabel>
            </ListItem>
          </List>
        )}
      </Grid>
      <Grid
        style={{ paddingLeft: 8, paddingRight: 8 }}
        item
        xs={12}
        sm={6}
        md={6}>
        <input
          accept='image/jpeg, image/png'
          onChange={e => handleFileChange(e.target.files)}
          style={{ display: 'none' }}
          id='add-product-image'
          multiple
          type='file'
        />
        <ListItem style={{ paddingBottom: 1 }}>
          <TextField
            id='productTitle'
            label={
              values.productTitle.length > 100
                ? 'Title should not be longer than 100 characters.'
                : 'Product Title'
            }
            defaultValue={productTitle}
            fullWidth
            error={values.productTitle.length > 100}
            onChange={handleChange('productTitle')}
            margin='normal'
            variant='outlined'
          />
        </ListItem>
        <ListItem style={{ marginTop: 0 }}>
          By&ensp;
          <Typography color='primary' variant='body2'>
            {brandUsername}
          </Typography>
        </ListItem>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor='category'>Category</InputLabel>

          <Select
            value={values.categoryId}
            onChange={handleChange('categoryId')}
            inputProps={{
              name: 'Category',
              id: 'categoryId'
            }}>
            {categoriesData &&
              categoriesData.categories &&
              categoriesData.categories.edges.map(categoryObj => {
                const { id, name } = categoryObj.node;
                return (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor='type'>Type</InputLabel>

          <Select
            value={values.typeId}
            onChange={handleChange('typeId')}
            inputProps={{
              name: 'Type',
              id: 'typeId'
            }}>
            {currentCategoryProductTypes &&
              values.categoryId &&
              currentCategoryProductTypes.map(productTypeObj => {
                const { id, name } = productTypeObj.node;
                return (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        <Divider />
        <ListItem style={{ paddingBottom: 0 }}>
          &ensp;&ensp;&ensp;&ensp;&ensp;M.R.P:&ensp;
          <TextField
            // defaultValue={values.mrp}
            onChange={handleChange('mrp')}
            placeholder='M.R.P'
            defaultValue={mrp}
            id='mrp'
            name='mrp'
            type='number'
            margin='dense'
            variant='outlined'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start' style={{ color: 'green' }}>
                  &#8377;
                </InputAdornment>
              )
            }}
            InputLabelProps={{
              shrink: true
            }}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <TextField
            id='description'
            name='description'
            label={
              values.description.length > shortDescriptionLengthLimit &&
              `Short description should not be longer than ${shortDescriptionLengthLimit} characters.`
            }
            defaultValue={description}
            onChange={handleChange('description')}
            error={values.description.length > shortDescriptionLengthLimit}
            placeholder='Short Description'
            multiline
            fullWidth></TextField>
        </ListItem>
        <ListItem>
          <TextField
            id='longDescription'
            name='longDescription'
            label={
              values.longDescription.length > longDescriptionLengthLimit &&
              `Long Description should not be longer than ${longDescriptionLengthLimit} characters.`
            }
            defaultValue={longDescription}
            onChange={handleChange('longDescription')}
            error={values.longDescription.length > longDescriptionLengthLimit}
            placeholder='Long Descriptions'
            multiline
            fullWidth></TextField>
        </ListItem>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component='th' scope='row'>
                title
              </TableCell>
              <TableCell>
                {values.productTitle ? values.productTitle : productTitle}
              </TableCell>
            </TableRow>
            {Object.keys(technicalDetails).map((key, index) => {
              const value = technicalDetails[key];
              return (
                <TableRow key={index}>
                  <TableCell component='th' scope='row'>
                    {key}
                  </TableCell>
                  <TableCell>
                    <TextField
                      id={key}
                      name={key}
                      defaultValue={value}
                      margin='dense'
                      onChange={handleTechnicalDetailChanges()}></TextField>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Grid>

      <Grid item xs={12} sm={12} md={2}>
        <Grid container>
          <Grid item xs={6}>
            <Button
              color='primary'
              variant='contained'
              onClick={() =>
                modifyProduct({
                  variables: {
                    data: { ...modifyBrandProductInput, action: 'edit' }
                  }
                })
              }>
              {loading ? 'Saving' : 'Save'}
            </Button>
            {data && <span style={{ color: 'green' }}>Saved successfully</span>}
            {error && (
              <span style={{ color: 'red' }}>
                {error.message.split(':')[1]}
              </span>
            )}
          </Grid>
          <Grid item xs={6}>
            <Button
              color='secondary'
              variant='contained'
              onClick={() =>
                modifyProduct({
                  variables: {
                    data: { ...modifyBrandProductInput, action: 'delete' }
                  }
                })
              }>
              {loading ? 'Saving' : 'Delete'}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const EditBrandProduct = ({ id: productId, brandUsername }) => {
  const { loading, error, data } = useQuery(PRODUCT, {
    variables: { productId }
  });

  if (loading) return <Loading></Loading>;
  if (error) return <ErrorPage></ErrorPage>;

  if (data) {
    const { product } = data;
    const {
      images: { edges: imgNodeList }
    } = product;

    let modifiedImgNodeList = [];

    imgNodeList.forEach(imgObj => {
      const { id, image: url, position } = imgObj.node;
      const image = {
        node: {
          id,
          base64: `http://localhost:8000/media/${url}`,
          position
        }
      };
      modifiedImgNodeList.push(image);
    });

    modifiedImgNodeList.sort((a, b) => a.node.position - b.node.position);

    return (
      <ModifyBrandProduct
        product={product}
        brandUsername={brandUsername}
        imgNodeList={modifiedImgNodeList}
        action='edit'></ModifyBrandProduct>
    );
  }
};

export default EditBrandProduct;
