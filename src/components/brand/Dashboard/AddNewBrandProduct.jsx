import React from "react"

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
  MenuItem,
} from "@material-ui/core"
import { Carousel } from "react-responsive-carousel"
import { makeStyles } from "@material-ui/core/styles"
import gql from "graphql-tag"
import { useMutation, useQuery } from "react-apollo"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

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
`

const ADD_BRAND_PRODUCT = gql`
  mutation($data: AddBrandProductInput!) {
    addBrandProduct(input: $data) {
      product {
        id
        title
        mrp
        description
        longDescription
        technicalDetails
        category {
          id
          name
        }
      }
    }
  }
`

const AddNewBrandProduct = ({ brandUsername }) => {
  const classes = useStyles()

  const [invalidImages, setInvalidImages] = React.useState(false)
  const [showThumbs, setShowThumbs] = React.useState(true)

  const [imageFiles, setImageFiles] = React.useState(false)

  const [values, setValues] = React.useState({
    productTitle: "",
    description: "",
    longDescription: "",
    categoryId: null,
    mrp: null,
    typeId: null,
  })

  const { data: categoriesData } = useQuery(CATEGORIES)

  // Category types filtering
  const currentCategory =
    categoriesData && values.categoryId
      ? categoriesData.categories.edges.filter(
          e => e.node.id === values.categoryId
        )[0].node
      : null

  const currentCategoryProductTypes =
    currentCategory && currentCategory.producttypeSet.edges.length !== 0
      ? currentCategory.producttypeSet.edges
      : null

  const currentProductType =
    currentCategoryProductTypes &&
    values.typeId &&
    currentCategoryProductTypes.filter(e => e.node.id === values.typeId)
      .length !== 0
      ? currentCategoryProductTypes.filter(e => e.node.id === values.typeId)[0]
          .node
      : null
  // category types filtering end

  const [technicalDetailsValues, setTechnicalDetailsValues] = React.useState({})

  const handleTechnicalDetailChanges = key => event => {
    setTechnicalDetailsValues({
      ...technicalDetailsValues,
      [event.target.id]: event.target.value,
    })
  }

  const technicalDetails =
    currentCategory && currentProductType
      ? {
          ...JSON.parse(currentCategory.technicalDetailsTemplate),
          ...JSON.parse(currentProductType.technicalDetailsTemplate),
        }
      : {}

  // This images64 list will be used for rendering images and uploading to server
  const images64 = []

  imageFiles &&
    imageFiles.forEach(img => {
      const image = {
        name: img.file.name,
        base64: img.base64,
      }
      images64.push(JSON.stringify(image))
    })

  // Images files handling
  const handleFileChange = files => {
    const filesArray = Array.from(files)
    const images = []

    validateImages()
    function validateImages() {
      let allInvalidImages = new Promise(resolveAllInvalidImages => {
        const invalidImages = []
        let i = 0
        filesArray.forEach(file => {
          const reader = new FileReader()
          const img = new Image()
          const imgSrc = URL.createObjectURL(file)
          img.src = imgSrc
          reader.readAsDataURL(file)
          const invalidImage = new Promise(resolveInvalidImg => {
            reader.onload = e => {
              const { result: base64 } = e.target
              img.onload = () => {
                const { naturalWidth: width, naturalHeight: height } = img

                const image = {
                  url: img.src,
                  width,
                  height,
                  base64,
                  ratio: Math.round((width / height) * 100),
                  file,
                }

                if (image.ratio !== 80 || image.size / 1000 > 100) {
                  resolveInvalidImg(image)
                } else {
                  images.push(image)
                  resolveInvalidImg(false)
                }
                i++
              }
            }
          })
          invalidImage.then(invalidImage => {
            if (invalidImage) {
              invalidImages.push(invalidImage)
            }
            if (filesArray.length === i) {
              resolveAllInvalidImages(invalidImages)
            }
          })
        })
      })

      allInvalidImages.then(invalidImages => {
        if (invalidImages.length !== 0) {
          setImageFiles(false)
          setInvalidImages(invalidImages)
        } else {
          setInvalidImages(false)
          setShowThumbs(true)
          setImageFiles(images)
        }
      })
    }
  }
  // Images files handling ends

  // handleValuesChange
  const handleChange = name => event => {
    if (name === "mrp") {
      setValues({
        ...values,
        [name]: parseInt(event.target.value),
      })
    } else {
      setValues({
        ...values,
        [name]: event.target.value,
      })
    }
  }

  const addBrandProductInput = {
    ...values,
    images64,
    technicalDetails: JSON.stringify(technicalDetailsValues),
  }

  // modify product
  const [addProduct, { loading, error, data }] = useMutation(
    ADD_BRAND_PRODUCT,
    { variables: { data: addBrandProductInput } }
  )

  return (
    <Grid container>
      <Grid item xs={12} sm={6} md={4}>
        {invalidImages && (
          <List>
            <ListItem>
              <Typography variant="h5" color="secondary">
                Following images are invalid
              </Typography>
            </ListItem>
            {invalidImages.map((img, index) => {
              const {
                url,
                width,
                height,
                ratio,
                file: { name, size },
              } = img
              return (
                <ListItem key={index}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <ListItemText
                      primary={name}
                      secondary={`size:${size /
                        1000}Kb width:${width} height:${height} ratio=(width/height)x100=${ratio}`}
                    ></ListItemText>
                  </a>
                </ListItem>
              )
            })}
          </List>
        )}
        {imageFiles ? (
          <>
            <Carousel showThumbs={showThumbs} infiniteLoop showArrows={true}>
              {images64.map((img, index) => {
                const { base64: src, name } = JSON.parse(img)
                return (
                  <div key={index}>
                    <img
                      src={src}
                      style={{ maxHeight: "56.25%", maxWidth: "100%" }}
                      alt={name}
                    ></img>
                  </div>
                )
              })}
            </Carousel>
            <List>
              <InputLabel htmlFor="raised-button-file">
                <Button
                  onClick={() => setShowThumbs(false)}
                  variant="contained"
                  component="span"
                >
                  Re Upload
                </Button>
              </InputLabel>
            </List>
          </>
        ) : (
          <List>
            <ListItem>
              <ListItemText primary="Each image should be less than 100Kb."></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Images should be of 4:5 ratio. That is width divided by height and then multiplying by 100 should approximately equal to 80"
                secondary={"(width/height)x100 ~ 80"}
              ></ListItemText>
            </ListItem>
            <ListItem>
              <InputLabel htmlFor="raised-button-file">
                <Button variant="contained" component="span">
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
        md={6}
      >
        <input
          accept="image/jpeg, image/png"
          onChange={e => handleFileChange(e.target.files)}
          style={{ display: "none" }}
          id="raised-button-file"
          multiple
          type="file"
        />
        <ListItem style={{ paddingBottom: 1 }}>
          <TextField
            id="productTitle"
            label={
              values.productTitle.length > 100
                ? "Title should not be longer than 100 characters."
                : "Product Title"
            }
            // value={values.productTitle}
            fullWidth
            error={values.productTitle.length > 100}
            onChange={handleChange("productTitle")}
            margin="normal"
            variant="outlined"
          />
        </ListItem>
        <ListItem style={{ marginTop: 0 }}>
          By&ensp;
          <Typography color="primary" variant="body2">
            {brandUsername}
          </Typography>
        </ListItem>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="category">Category</InputLabel>

          <Select
            value={values.categoryId}
            onChange={handleChange("categoryId")}
            inputProps={{
              name: "Category",
              id: "categoryId",
            }}
          >
            {categoriesData &&
              categoriesData.categories &&
              categoriesData.categories.edges.map(categoryObj => {
                const { id, name } = categoryObj.node
                return <MenuItem value={id}>{name}</MenuItem>
              })}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="type">Type</InputLabel>

          <Select
            value={values.typeId}
            onChange={handleChange("typeId")}
            inputProps={{
              name: "Type",
              id: "typeId",
            }}
          >
            {values.categoryId &&
              currentCategoryProductTypes.map(productTypeObj => {
                const { id, name } = productTypeObj.node
                return <MenuItem value={id}>{name}</MenuItem>
              })}
          </Select>
        </FormControl>
        <Divider />
        <ListItem style={{ paddingBottom: 0 }}>
          &ensp;&ensp;&ensp;&ensp;&ensp;M.R.P:&ensp;
          <TextField
            // defaultValue={values.mrp}
            onChange={handleChange("mrp")}
            placeholder="M.R.P"
            id="mrp"
            name="mrp"
            type="number"
            margin="dense"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" style={{ color: "green" }}>
                  &#8377;
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <TextField
            id="description"
            name="description"
            label={
              values.description.length > 100 &&
              "Short description should not be longer than 100 characters."
            }
            onChange={handleChange("description")}
            error={values.description.length > 100}
            placeholder="Short Description"
            multiline
            fullWidth
          ></TextField>
        </ListItem>
        <ListItem>
          <TextField
            id="longDescription"
            name="longDescription"
            label={
              values.longDescription.length > 500 &&
              "longDescription should not be longer than 500 characters."
            }
            onChange={handleChange("longDescription")}
            error={values.longDescription.length > 500}
            placeholder="Long Descriptions"
            multiline
            fullWidth
          ></TextField>
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
              <TableCell component="th" scope="row">
                title
              </TableCell>
              <TableCell>{values.productTitle}</TableCell>
            </TableRow>
            {Object.keys(technicalDetails).map((key, index) => {
              const value = technicalDetails[key]
              return (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {key}
                  </TableCell>
                  <TableCell>
                    <TextField
                      id={key}
                      name={key}
                      defaultValue={value}
                      margin="dense"
                      onChange={handleTechnicalDetailChanges()}
                    ></TextField>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Grid>
      <Grid item xs={12} sm={12} md={2}>
        <h1>Buy now</h1>
      </Grid>
      <Grid item xs={12} sm={12} md={2}>
        <Button color="primary" variant="contained" onClick={addProduct}>
          {loading ? "Saving" : "Save"}
        </Button>
        {data && <span style={{ color: "green" }}>Saved successfully</span>}
        {error && (
          <span style={{ color: "red" }}>{error.message.split(":")[1]}</span>
        )}
      </Grid>
    </Grid>
  )
}

export default AddNewBrandProduct
