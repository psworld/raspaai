import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, useFormik } from 'formik';
import { TextField, Select as FormikSelect } from 'formik-material-ui';
import gql from 'graphql-tag';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { Carousel } from 'react-responsive-carousel';
import * as yup from 'yup';
import CustomFormik from '../../core/CustomFormik';
import GraphqlErrorMessage from '../../core/GraphqlErrorMessage';
import Link from '../../core/Link';
import { BRAND_PRODUCTS } from '../BrandHomePage';

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
          username
          technicalDetailsTemplate
          types {
            edges {
              node {
                id
                name
                username
                technicalDetailsTemplate
              }
            }
          }
        }
      }
    }
  }
`;

const ADD_BRAND_PRODUCT = gql`
  mutation($data: AddBrandProductInput!) {
    addBrandProduct(input: $data) {
      product {
        id
      }
    }
  }
`;

export const mrpBaseValidationSchema = yup
  .number('Invalid number')
  .integer('No decimal places')
  .positive('Price can not be negative')
  .max(99999, 'Price too high!');

const AddNewBrandProduct = ({ brandUsername }) => {
  const classes = useStyles();

  const [images, setImages] = React.useState({
    invalidImages: false,

    showThumbs: true
  });
  const { invalidImages, showThumbs } = images;

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  let mrpRequired = true;

  // modify product
  const [addProduct, { loading, error, data }] = useMutation(
    ADD_BRAND_PRODUCT,
    {
      refetchQueries: [
        {
          query: BRAND_PRODUCTS,
          variables: { publicBrandUsername: brandUsername, withBrand: false }
        }
      ],
      awaitRefetchQueries: true
    }
  );

  const formik = useFormik({
    initialValues: {
      productTitle: '',
      thumbOverlayText: '',
      description: '',
      longDescription: '',
      categoryId: '',
      typeId: '',
      technicalDetails: {},
      base64images: []
    },
    validationSchema: yup.object().shape({
      productTitle: yup
        .string()
        .min(3, 'Too small!')
        .max(100, 'Too large!')
        .required('Required!'),
      mrp: yup.lazy(() => {
        return mrpRequired
          ? mrpBaseValidationSchema.required('Required!')
          : mrpBaseValidationSchema.nullable(true);
      }),
      thumbOverlayText: yup
        .string()
        .min(1, 'Too small')
        .max(64, 'Too big')
        .nullable(),
      measurementUnit: yup
        .string()
        .min(1)
        .max(10)
        .nullable(),
      description: yup
        .string()
        .min(10, 'Too small')
        .max(200, 'Too large!')
        .required('Required!'),
      longDescription: yup
        .string()
        .min(20, 'Too short!')
        .max(1000, 'Too large')
        .required('Required!'),
      categoryId: yup.string().required('Required!'),
      typeId: yup.string().required('Required!'),
      base64images: yup
        .array()
        .min(1, 'At least 1 image is required')
        .max(6, 'You can not upload more than 6 images')
        .of(yup.object())
        .required('Required!'),
      technicalDetails: yup.lazy(obj => {
        const technicalDetailsShape = {};
        Object.keys(obj).forEach(key => {
          technicalDetailsShape[key] = yup
            .string()
            .max(30, 'Too long!')
            .required('Required');
        });
        return yup.object().shape({ ...technicalDetailsShape });
      })
    }),
    onSubmit: (values, { setSubmitting }) => {
      const base64images = [];

      values.base64images.forEach(imgObj => {
        base64images.push(JSON.stringify(imgObj));
      });
      const addBrandProductInput = {
        ...values,
        base64images,
        technicalDetails: JSON.stringify(values.technicalDetails)
      };
      addProduct({
        variables: { data: addBrandProductInput }
      });
      setSubmitting(false);
    }
  });

  const values = formik.values;

  const { data: categoriesData } = useQuery(CATEGORIES);

  // Category types filtering
  const currentCategory =
    categoriesData && values.categoryId
      ? categoriesData.categories.edges.find(
          e => e.node.id === values.categoryId
        ).node
      : null;

  const currentCategoryProductTypes =
    currentCategory && currentCategory.types.edges.length !== 0
      ? currentCategory.types.edges
      : null;

  // const currentProductType =
  //   currentCategoryProductTypes &&
  //   values.typeId &&
  //   currentCategoryProductTypes.filter(e => e.node.id === values.typeId)
  //     .length !== 0
  //     ? currentCategoryProductTypes.filter(e => e.node.id === values.typeId)[0]
  //         .node
  //     : null;
  // category types filtering end
  const currentCategoryUsername = currentCategory && currentCategory.username;

  mrpRequired = !(
    currentCategoryUsername === 'raspaaifood' ||
    currentCategoryUsername === 'raspaaiservices'
  );

  const handleImageDelete = () => {
    const imgNode = values.base64images[currentImageIndex].node;
    if (imgNode.position !== 0) {
      const imgId = imgNode.id;
      formik.setFieldValue(
        'base64images',
        values.base64images.filter(e => e.node.id !== imgId)
      );
    }
  };

  const handlePositionChange = currentImageNewPosition => {
    const newPosition = currentImageNewPosition - 1;
    let newImagesList = values.base64images;

    const currentImagePosition =
      values.base64images[currentImageIndex].node.position;

    // img that is already at new position, swap the positions
    // sometimes there is no image at new position
    // so only swap when both parties are available
    if (
      newImagesList.filter(e => e.node.position === newPosition).length !== 0
    ) {
      newImagesList.find(
        e => e.node.position === newPosition
      ).node.position = currentImagePosition;
    }

    newImagesList[currentImageIndex].node.position = newPosition;
    newImagesList.sort((a, b) => a.node.position - b.node.position);

    formik.setFieldValue('base64images', newImagesList);
  };

  // Images files handling
  const handleFileChange = files => {
    const filesArray = Array.from(files);
    const newImageFiles = [];

    validateImages();
    function validateImages() {
      let allInvalidImages = new Promise(resolveAllInvalidImages => {
        const imagesListLength = values.base64images.length;
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

                if (image.ratio !== 80 || Math.round(image.size / 1000) > 101) {
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
          let formattedNewImageFiles = [];
          newImageFiles.forEach(img => {
            const image = {
              node: {
                id: img.url,
                name: img.name,
                base64: img.base64,
                position: img.position
              }
            };
            formattedNewImageFiles.push(image);
          });

          formattedNewImageFiles.sort(
            (a, b) => a.node.position - b.node.position
          );
          formik.setFieldValue(
            'base64images',
            values.base64images.concat(formattedNewImageFiles)
          );
          setImages({
            ...images,
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
    if (name === 'categoryId') {
      const newCategoryId = event.target.value;
      const newCategory =
        categoriesData && newCategoryId
          ? categoriesData.categories.edges.filter(
              e => e.node.id === newCategoryId
            )[0].node
          : null;

      formik.setValues({
        ...formik.values,
        technicalDetails: JSON.parse(newCategory.technicalDetailsTemplate),
        categoryId: newCategoryId,
        typeId: ''
      });
    } else if (name === 'typeId') {
      const newTypeId = event.target.value;
      const newTypeTechnicalDetailsTemplate = currentCategoryProductTypes.find(
        e => e.node.id === newTypeId
      ).node.technicalDetailsTemplate;

      const technicalDetails = {
        ...JSON.parse(currentCategory.technicalDetailsTemplate),
        ...JSON.parse(newTypeTechnicalDetailsTemplate)
      };
      formik.setValues({
        ...formik.values,
        technicalDetails,
        typeId: newTypeId
      });
    }
  };

  // const shortDescriptionLengthLimit = 200;
  // const longDescriptionLengthLimit = 1000;

  return (
    <Grid container>
      <CustomFormik formikBag={formik}>
        {() => {
          return (
            <>
              <Grid item xs={12} sm={6} md={4}>
                {invalidImages ? (
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
                          <a
                            href={url}
                            target='_blank'
                            rel='noopener noreferrer'>
                            <ListItemText
                              primary={name}
                              secondary={`size:${size /
                                1000}Kb width:${width} height:${height} ratio=(width/height)x100=${ratio}`}></ListItemText>
                          </a>
                        </ListItem>
                      );
                    })}
                    <ListItem>
                      <InputLabel htmlFor='add-product-images'>
                        <Button variant='contained' component='span'>
                          Upload
                        </Button>
                      </InputLabel>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary='Each image should be less than 100Kb.'></ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary='Images should be of 4:5 ratio. That is width divided by height and then multiplying by 100 should approximately equal to 80'
                        secondary={'(width/height)x100 ~ 80'}></ListItemText>
                    </ListItem>
                  </List>
                ) : values.base64images.length !== 0 ? (
                  <>
                    <Carousel
                      selectedItem={currentImageIndex}
                      onChange={currentPosition =>
                        setCurrentImageIndex(currentPosition)
                      }
                      showThumbs={showThumbs}
                      showArrows={true}>
                      {values.base64images.map((imgObj, index) => {
                        const { base64: src, name } = imgObj.node;
                        return (
                          <div key={index}>
                            <img
                              src={src}
                              style={{
                                maxHeight: '56.25%',
                                maxWidth: '100%'
                              }}
                              alt={name}></img>
                          </div>
                        );
                      })}
                    </Carousel>

                    <Formik
                      initialValues={{ currentImageNewPosition: '' }}
                      validationSchema={yup.object().shape({
                        currentImageNewPosition: yup
                          .number('Invalid position')
                          .integer('Only whole numbers')
                          .positive('Position can not be negative')
                          .min(1, 'Minimum position value is 1')
                          .max(
                            values.base64images.length,
                            `Last valid position is ${values.base64images.length}`
                          )
                          .required('Required!')
                      })}
                      onSubmit={(values, { setSubmitting }) => {
                        handlePositionChange(values.currentImageNewPosition);
                        setSubmitting(false);
                      }}>
                      {props => (
                        <Grid container>
                          <Grid item xs={6}>
                            <InputLabel htmlFor='add-product-images'>
                              <Button
                                color='primary'
                                variant='contained'
                                component='span'>
                                Add
                              </Button>
                            </InputLabel>
                          </Grid>
                          <Grid item xs={6}>
                            <Button
                              onClick={handleImageDelete}
                              // disabled={props.isSubmitting}/
                              color='secondary'
                              variant='contained'
                              component='span'>
                              Delete
                            </Button>
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              name='currentImageNewPosition'
                              type='number'
                              variant='outlined'
                              placeholder='Enter the position'></TextField>
                          </Grid>
                          <Grid item xs={6}>
                            <Button
                              onClick={props.handleSubmit}
                              color='primary'
                              variant='outlined'>
                              Set Position
                            </Button>
                          </Grid>
                        </Grid>
                      )}
                    </Formik>
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
                      <InputLabel htmlFor='add-product-images'>
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
                {/* <Form> */}
                <input
                  accept='image/jpeg, image/png'
                  onChange={e => handleFileChange(e.target.files)}
                  style={{ display: 'none' }}
                  id='add-product-images'
                  multiple
                  type='file'
                />

                <ListItem style={{ paddingBottom: 1 }}>
                  <TextField
                    name='productTitle'
                    label='Product Title'
                    fullWidth
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
                    required
                    error={
                      formik.touched.categoryId && formik.errors.categoryId
                    }
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
                    required
                    error={formik.touched.typeId && formik.errors.typeId}
                    onChange={handleChange('typeId')}
                    inputProps={{
                      name: 'Type',
                      id: 'typeId'
                    }}>
                    {values.categoryId &&
                      currentCategoryProductTypes &&
                      currentCategoryProductTypes.map(productType => {
                        const { id, name } = productType.node;
                        return (
                          <MenuItem key={id} value={id}>
                            {name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                  <InputLabel id='measurement-unit'>Unit</InputLabel>
                  <FormikSelect
                    labelId='measurement-unit'
                    name='measurementUnit'>
                    <MenuItem value='g'>Gram</MenuItem>
                    <MenuItem value='kg'>Kilogram</MenuItem>
                    <MenuItem value='pc'>Piece</MenuItem>
                    <MenuItem value='dozen'>Dozen</MenuItem>
                  </FormikSelect>
                </FormControl>

                <ListItem>
                  <TextField
                    name='thumbOverlayText'
                    placeholder='1 kg or 1 dozen'
                    label='Text to be overladed on thumb'
                    fullWidth></TextField>
                </ListItem>

                <Divider />
                <ListItem style={{ paddingBottom: 0 }}>
                  &ensp;&ensp;&ensp;&ensp;&ensp;M.R.P:&ensp;
                  <TextField
                    placeholder='M.R.P'
                    name='mrp'
                    type='number'
                    margin='dense'
                    disabled={!mrpRequired}
                    variant='outlined'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position='start'
                          style={{ color: 'green' }}>
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
                    name='description'
                    label='Short description'
                    placeholder='Short Description'
                    multiline
                    fullWidth></TextField>
                </ListItem>
                <ListItem>
                  <TextField
                    name='longDescription'
                    label='Long description'
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
                        Title
                      </TableCell>
                      <TableCell>{formik.values.productTitle}</TableCell>
                    </TableRow>
                    {Object.keys(values.technicalDetails).map((key, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell component='th' scope='row'>
                            {key}
                          </TableCell>
                          <TableCell>
                            <TextField
                              name={`technicalDetails.${key}`}
                              required
                              margin='dense'></TextField>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <Typography>* Technical details are required</Typography>
                {/* </Form> */}
              </Grid>

              <Grid item xs={12} sm={12} md={2}>
                {/* <Form> */}
                <Button
                  disabled={loading || data || formik.isSubmitting}
                  color='primary'
                  variant='contained'
                  onClick={formik.handleSubmit}>
                  {loading ? 'Saving' : 'Save Product'}
                </Button>
                {data && (
                  <>
                    <p style={{ color: 'green' }}>Saved successfully</p>
                    <Link to={`/dashboard/brand/${brandUsername}/products`}>
                      <p>Click here to see</p>
                    </Link>
                  </>
                )}
                {error && (
                  <GraphqlErrorMessage error={error}></GraphqlErrorMessage>
                )}
                {/* </Form> */}
              </Grid>
            </>
          );
        }}
      </CustomFormik>
    </Grid>
  );
};

export default AddNewBrandProduct;
