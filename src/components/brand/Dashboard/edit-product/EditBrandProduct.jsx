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
import { navigate } from 'gatsby';
import gql from 'graphql-tag';
import React, { useEffect } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { Carousel } from 'react-responsive-carousel';
import * as yup from 'yup';
import CustomFormik from '../../../core/CustomFormik';
import ErrorPage from '../../../core/ErrorPage';
import GraphqlErrorMessage from '../../../core/GraphqlErrorMessage';
import Loading from '../../../core/Loading';
import { detailedImagesDiff, updatedDiff } from '../../../core/utils';
import { BRAND_PRODUCTS } from '../../BrandHomePage';
import { PRODUCT } from '../../BrandProductPage';
import { updatedDiff as deepUpdatedDiff } from 'deep-object-diff';

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
        thumbOverlayText
        measurementUnit
        technicalDetails
        thumb
        category {
          id
        }
        type {
          id
        }
        images {
          edges {
            node {
              id
              image
              position
            }
          }
        }
      }
    }
  }
`;

export const ModifyBrandProduct = ({
  product,
  brandUsername,
  action,
  defaultImageNodeEdges,
  categoriesData
}) => {
  const {
    id,
    title: productTitle,
    mrp,
    description,
    longDescription,
    thumbOverlayText,
    measurementUnit,
    category: { id: categoryId },
    type: { id: typeId },
    // isAvailable,
    technicalDetails: savedTechnicalDetailsJsonString
  } = product;
  const classes = useStyles();

  const savedTechnicalDetails = JSON.parse(savedTechnicalDetailsJsonString);
  const imagesListDefault = JSON.parse(JSON.stringify(defaultImageNodeEdges));
  const [images, setImages] = React.useState({
    showThumbs: true,
    invalidImages: false
  });

  const { showThumbs } = images;

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const [currentCategoryAndType, setCurrentCategoryAndType] = React.useState(
    {}
  );
  const {
    currentCategory,
    currentCategoryProductTypes
  } = currentCategoryAndType;

  let mrpRequired = true;

  const [modifyProduct, { loading, error, data }] = useMutation(
    MODIFY_BRAND_PRODUCT
  );

  const mrpBaseValidationSchema = yup
    .number('Invalid number')
    .integer('No decimal places')
    .positive('Price can not be negative')
    .max(99999, 'Price too high!');
  const formik = useFormik({
    initialValues: {
      productTitle,
      categoryId,
      typeId,
      thumbOverlayText,
      mrp: mrp,
      description,
      measurementUnit,
      longDescription,
      technicalDetails: savedTechnicalDetails,
      images: imagesListDefault
    },
    validationSchema: yup.object().shape({
      productTitle: yup
        .string()
        .min(3, 'Too small!')
        .max(100, 'Too large!')
        .required('Required!'),
      mrp: yup.lazy(() => {
        const schema = mrpRequired
          ? mrpBaseValidationSchema.required('Required!')
          : mrpBaseValidationSchema.nullable(true);
        return schema;
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
      technicalDetails: yup.lazy(obj => {
        const technicalDetailsShape = {};
        Object.keys(obj).forEach(key => {
          technicalDetailsShape[key] = yup
            .string()
            .max(30, 'Too long!')
            .required('Required');
        });
        return yup.object().shape({ ...technicalDetailsShape });
      }),
      images: yup
        .array()
        .of(
          yup.object({
            node: yup.object({
              id: yup.string(),
              image: yup.string().required(),
              position: yup
                .number()
                .integer()
                .min(0)
                .required()
            })
          })
        )
        .required('Required!')
    }),
    onSubmit: (values, { setSubmitting }) => {
      const dirty = formik.dirty;
      const updatedDifference = deepUpdatedDiff(formik.initialValues, values);
      const updatedTechnicalDetails = updatedDiff(
        formik.initialValues.technicalDetails,
        values.technicalDetails
      );
      const images = detailedImagesDiff(
        formik.initialValues.images,
        values.images
      );

      // delete because we are handling images diff in detailedImagesDiff
      delete updatedDifference.images;
      delete updatedDifference.technicalDetails;

      if (dirty) {
        const modifyBrandProductInput = {
          productId: id,
          ...updatedDifference,
          technicalDetails: JSON.stringify(updatedTechnicalDetails),
          images: JSON.stringify(images),
          action: 'edit'
        };

        modifyProduct({
          variables: { data: modifyBrandProductInput }
        });
      } else {
      }
      setSubmitting(false);
    }
  });

  const { values } = formik;

  useEffect(() => {
    const category = categoriesData
      ? categoriesData.categories.edges.find(e => e.node.id === categoryId).node
      : null;
    const type =
      category && category.types.edges.length !== 0
        ? category.types.edges.find(e => e.node.id === typeId).node
        : null;

    const initialTechnicalDetails = {
      ...JSON.parse(category.technicalDetailsTemplate),
      ...JSON.parse(type.technicalDetailsTemplate),
      ...values.technicalDetails
    };

    formik.setFieldValue('technicalDetails', initialTechnicalDetails);
  }, []);

  useEffect(() => {
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

    const currentProductType =
      currentCategoryProductTypes &&
      values.typeId &&
      currentCategoryProductTypes.filter(e => e.node.id === values.typeId)
        .length !== 0
        ? currentCategoryProductTypes.find(e => e.node.id === values.typeId)
            .node
        : null;
    // category types filtering end
    setCurrentCategoryAndType({
      currentCategory,
      currentCategoryProductTypes,
      currentProductType
    });
  }, [values.categoryId, values.typeId, categoriesData]);

  const currentCategoryUsername = currentCategory && currentCategory.username;

  mrpRequired = !(
    currentCategoryUsername === 'raspaaifood' ||
    currentCategoryUsername === 'raspaaiservices'
  );

  // Saved category is that is saved in database
  // Current category is that is selected on front end. It can be same
  // as the saved category
  const isCurrentCategorySavedCategory =
    categoryId === values.categoryId && typeId === values.typeId;

  const handleImageDelete = () => {
    const imagesList = [...values.images];
    const imgNode = imagesList[currentImageIndex].node;
    const aheadImages = imagesList.slice(currentImageIndex + 1);

    let i = 0;
    if (aheadImages.length > 0) {
      for (i; i < aheadImages.length; i++) {
        const imgId = aheadImages[i].node.id;
        const imgNode = imagesList.find(e => e.node.id === imgId).node;
        imgNode.position -= 1;
      }
    }
    if (i === aheadImages.length) {
      const imgId = imgNode.id;
      formik.setFieldValue(
        'images',
        imagesList.filter(e => e.node.id !== imgId)
      );
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  const handlePositionChange = currentImageNewPosition => {
    const newPosition = currentImageNewPosition - 1;

    const imagesList = values.images;
    const currentImagePosition = imagesList[currentImageIndex].node.position;

    // img that is already at new position swap the positions
    // sometimes there is no image at new position
    // so only swap when both parties are available
    const imageAtNewPosition = imagesList.find(
      e => e.node.position === newPosition
    );
    if (imageAtNewPosition) {
      imageAtNewPosition.node.position = currentImagePosition;
    }
    imagesList[currentImageIndex].node.position = newPosition;
    imagesList.sort((a, b) => a.node.position - b.node.position);
    formik.setFieldValue('images', imagesList);
  };

  // Images files handling
  const handleFileChange = files => {
    const filesArray = Array.from(files);
    const newImageFiles = [];

    validateImages();
    function validateImages() {
      let allInvalidImages = new Promise(resolveAllInvalidImages => {
        const imagesListLength = values.images.length;
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

                if (Math.round(image.size / 1000) > 101) {
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
          let formattedImageFiled = [];
          newImageFiles.forEach(img => {
            const image = {
              node: {
                id: img.url,
                name: img.name,
                image: img.base64,
                position: img.position
              }
            };
            formattedImageFiled.push(image);
          });

          formattedImageFiled.sort((a, b) => a.node.position - b.node.position);
          let newImagesList = values.images.concat(formattedImageFiled);
          formik.setFieldValue('images', newImagesList);
          setImages({
            invalidImages: false,
            showThumbs: true
          });
        }
      });
    }
  };
  // Images files handling ends

  const handleCategoryTypeChange = event => {
    const name = event.target.name;

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

  //Character length limit
  const shortDescriptionLengthLimit = 200;
  const longDescriptionLengthLimit = 1000;

  return (
    <CustomFormik formikBag={formik}>
      {() => {
        return (
          <Grid container>
            <input
              accept='image/jpeg, image/png'
              onChange={e => handleFileChange(e.target.files)}
              style={{ display: 'none' }}
              id='add-product-image'
              multiple
              type='file'
            />
            <Grid item xs={12} sm={6} md={4}>
              {values.images.length !== 0 ? (
                <>
                  <Carousel
                    selectedItem={currentImageIndex}
                    onChange={currentPosition =>
                      setCurrentImageIndex(currentPosition)
                    }
                    showThumbs={showThumbs}
                    infiniteLoop
                    showArrows={true}>
                    {/* modifiedImgNodeList.sort((a, b) => a.node.position - b.node.position); */}

                    {values.images
                      .sort((a, b) => a.node.position - b.node.position)
                      .map((img, index) => {
                        let { id, image: src } = img.node;
                        // If src do not includes() following it means it is a new local uploaded image
                        src = src.includes('product_images/')
                          ? `${process.env.GATSBY_IMG_URL_PRE}/${src}`
                          : src;
                        return (
                          <div key={id}>
                            <img
                              src={src}
                              style={{ maxHeight: '56.25%', maxWidth: '100%' }}
                              alt={productTitle}></img>
                          </div>
                        );
                      })}
                  </Carousel>

                  <Grid container>
                    <Grid item xs={6}>
                      <InputLabel htmlFor='add-product-image'>
                        <Button
                          color='primary'
                          variant='contained'
                          component='span'>
                          Add Image
                        </Button>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        onClick={handleImageDelete}
                        color='secondary'
                        variant='contained'
                        component='span'>
                        Delete Image
                      </Button>
                    </Grid>
                    <Formik
                      initialValues={{ currentImageNewPosition: '' }}
                      validationSchema={yup.object().shape({
                        currentImageNewPosition: yup
                          .number('Invalid position')
                          .integer('Only whole numbers')
                          .positive('Position can not be negative')
                          .min(1, 'Minimum position value is 1')
                          .max(
                            values.images.length,
                            `Last valid position is ${values.images.length}`
                          )
                          .required('Required!')
                      })}
                      onSubmit={(values, { setSubmitting }) => {
                        handlePositionChange(values.currentImageNewPosition);
                        setSubmitting(false);
                      }}>
                      {props => (
                        <>
                          <Grid item xs={6}>
                            <TextField
                              name='currentImageNewPosition'
                              type='number'
                              variant='outlined'
                              placeholder='Enter the position'></TextField>
                          </Grid>
                          <Grid item xs={6}>
                            <Button
                              onClick={() =>
                                handlePositionChange(
                                  props.values.currentImageNewPosition
                                )
                              }
                              color='primary'
                              variant='outlined'>
                              Set Position
                            </Button>
                          </Grid>
                        </>
                      )}
                    </Formik>
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
              <ListItem style={{ paddingBottom: 1 }}>
                <TextField
                  name='productTitle'
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
                  error={formik.touched.categoryId && formik.errors.categoryId}
                  onChange={handleCategoryTypeChange}
                  inputProps={{
                    name: 'categoryId',
                    id: 'categoryId'
                  }}>
                  {categoriesData &&
                    categoriesData.categories &&
                    categoriesData.categories.edges.map(categoryObj => {
                      const { id, name } = categoryObj.node;
                      return (
                        <MenuItem
                          selected={values.categoryId === id}
                          key={id}
                          value={id}>
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
                  onChange={handleCategoryTypeChange}
                  inputProps={{
                    name: 'typeId',
                    id: 'typeId'
                  }}>
                  {currentCategoryProductTypes &&
                    values.categoryId &&
                    currentCategoryProductTypes.map(productTypeObj => {
                      const { id, name } = productTypeObj.node;
                      return (
                        <MenuItem
                          selected={values.typeId === id}
                          key={id}
                          value={id}>
                          {name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel id='measurement-unit'>Unit</InputLabel>
                <FormikSelect labelId='measurement-unit' name='measurementUnit'>
                  <MenuItem value='g'>Gram</MenuItem>
                  <MenuItem value='kg'>Kilogram</MenuItem>
                  <MenuItem value='piece'>Piece</MenuItem>
                  <MenuItem value='dozen'>Dozen</MenuItem>
                </FormikSelect>
              </FormControl>

              <Divider />
              <ListItem>
                <TextField
                  name='thumbOverlayText'
                  placeholder='1 kg or 1 dozen'
                  label='Text to be overladed on thumb'
                  fullWidth></TextField>
              </ListItem>

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
                  placeholder='Short Description'
                  multiline
                  fullWidth></TextField>
              </ListItem>
              <ListItem>
                <TextField
                  name='longDescription'
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
                    <TableCell>
                      {values.productTitle ? values.productTitle : productTitle}
                    </TableCell>
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
            </Grid>

            <Grid item xs={12} sm={12} md={2}>
              <Grid container>
                <Grid item xs={6}>
                  <Button
                    color='primary'
                    variant='contained'
                    disabled={loading}
                    onClick={formik.handleSubmit}>
                    {loading ? 'Saving' : 'Save'}
                  </Button>
                  {data && <p style={{ color: 'green' }}>Saved successfully</p>}
                  {error && (
                    <GraphqlErrorMessage
                      error={error}
                      critical={true}></GraphqlErrorMessage>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Button
                    color='secondary'
                    variant='contained'
                    disabled={loading || data || values.images.length === 0}
                    onClick={() =>
                      modifyProduct({
                        variables: {
                          data: { productId: id, action: 'delete' }
                        },
                        update(store) {
                          const { brandProducts } = store.readQuery({
                            query: BRAND_PRODUCTS,
                            variables: {
                              publicBrandUsername: brandUsername,
                              withBrand: false
                            }
                          });
                          const newEdges = brandProducts.edges.filter(
                            e => e.node.id !== id
                          );

                          store.writeQuery({
                            query: BRAND_PRODUCTS,
                            variables: {
                              publicBrandUsername: brandUsername,
                              withBrand: false
                            },
                            data: {
                              brandProducts: {
                                ...brandProducts,
                                edges: newEdges
                              }
                            }
                          });

                          navigate(
                            `/dashboard/brand/${brandUsername}/products`
                          );
                        }
                      })
                    }>
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
      }}
    </CustomFormik>
  );
};

const EditBrandProduct = ({ id: productId, brandUsername }) => {
  const { loading, error, data } = useQuery(PRODUCT, {
    variables: { productId }
  });
  const categoryQuery = useQuery(CATEGORIES);
  if (loading || categoryQuery.loading)
    if (error || categoryQuery.error) return <ErrorPage></ErrorPage>;

  if (data && categoryQuery.data) {
    const { product } = data;
    const {
      images: { edges: defaultImageNodeEdges }
    } = product;

    return (
      <ModifyBrandProduct
        product={product}
        brandUsername={brandUsername}
        defaultImageNodeEdges={defaultImageNodeEdges}
        action='edit'
        categoriesData={categoryQuery.data}></ModifyBrandProduct>
    );
  }
  return <Loading></Loading>;
};

export default EditBrandProduct;
