import DateFnsUtils from '@date-io/date-fns';
import {
  Button,
  Checkbox,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Input,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Typography
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { gql } from 'apollo-boost';
import { Formik } from 'formik';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import * as yup from 'yup';
import ErrorPage from '../../../core/ErrorPage';
import Link, { MenuItemLink } from '../../../core/Link';
import Loading from '../../../core/Loading';
import { getDayName, getIsStoreOpenNow } from '../../../core/utils';
import MainFeaturedPost from '../../../templates/MainFeaturedPost';
import { SHOP } from '../../ShopAboutPage';
import { TextField } from 'formik-material-ui';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  }
}));

const MODIFY_SHOP = gql`
  mutation($data: ModifyShopInput!) {
    modifyShop(input: $data) {
      shop {
        id
        properties {
          about
          website
          isOpenToday
          openAt
          closeAt
          offDays
        }
      }
    }
  }
`;

function getStyles(name, offDays, theme) {
  return {
    fontWeight:
      offDays.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const IsShopOpenToday = ({ isOpenToday: defaultValue }) => {
  const [isOpenToday, setIsOpenToday] = React.useState(defaultValue);

  const [modifyActiveTime, { loading, error, data, called }] = useMutation(
    MODIFY_SHOP,
    {
      variables: {
        data: {
          isOpenToday: isOpenToday
        }
      }
    }
  );
  const handleChange = () => {
    setIsOpenToday(!isOpenToday);
  };

  return (
    <>
      <ListItem style={{ paddingBottom: 0, marginBottom: 0 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isOpenToday}
              onChange={handleChange}
              value='isOpenToday'
            />
          }
          label='Is open today'
        />
      </ListItem>
      <ListItem style={{ paddingTop: 0, marginTop: 0, marginBottom: 10 }}>
        <FormHelperText>
          Un check this when store is closed on an unexpected day or time
        </FormHelperText>
      </ListItem>
      <ListItem>
        <Button
          disabled={loading || data || called || defaultValue === isOpenToday}
          onClick={modifyActiveTime}>
          Save
        </Button>
      </ListItem>
    </>
  );
};

const ShopOffDays = ({ offDays: defaultValue }) => {
  const classes = useStyles();
  const theme = useTheme();

  const [offDays, setOffDay] = React.useState([...JSON.parse(defaultValue)]);

  const [modifyActiveTime, { loading, error, data, called }] = useMutation(
    MODIFY_SHOP,
    {
      variables: {
        data: {
          offDays: JSON.stringify(offDays)
        }
      }
    }
  );

  const handleChange = event => {
    setOffDay(event.target.value);
  };
  return (
    <>
      <ListItem>
        <FormControl className={classes.formControl}>
          <InputLabel id='off-days-label'>Off days</InputLabel>
          <Select
            labelId='off-days-label'
            id='off-days'
            multiple
            value={offDays}
            onChange={handleChange}
            input={<Input id='select-off-days' />}
            renderValue={selected => (
              <div className={classes.chips}>
                {selected.map((value, index) => (
                  <Chip
                    key={value}
                    label={getDayName(value)}
                    className={classes.chip}
                  />
                ))}
              </div>
            )}
            MenuProps={MenuProps}>
            {dayNames.map((name, index) => (
              <MenuItem
                key={name}
                value={index}
                style={getStyles(name, offDays, theme)}>
                {name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            Days on which your store is regularly closed. eg Sunday
          </FormHelperText>
        </FormControl>
      </ListItem>
      <ListItem>
        <Button
          disabled={
            loading ||
            data ||
            called ||
            defaultValue === JSON.stringify(offDays)
          }
          onClick={modifyActiveTime}>
          Save
        </Button>
      </ListItem>
    </>
  );
};

const ShopOpenCloseTime = ({ openAt, closeAt }) => {
  const defaultOpenTime = new Date(`2002-10-06T${openAt}+05:30`);
  const defaultCloseTime = new Date(`2002-10-06T${closeAt}+05:30`);

  const [openTime, setOpenTime] = React.useState(defaultOpenTime);
  const [closeTime, setCloseTime] = React.useState(defaultCloseTime);

  const [modifyActiveTime, { loading, error, data, called }] = useMutation(
    MODIFY_SHOP,
    {
      variables: {
        data: {
          openCloseTime: JSON.stringify({
            openAt: {
              hour: openTime.getHours(),
              minutes: openTime.getMinutes()
            },
            closeAt: {
              hour: closeTime.getHours(),
              minutes: closeTime.getMinutes()
            }
          })
        }
      }
    }
  );

  const handleOpenTimeChange = date => {
    setOpenTime(date);
  };

  const handleCloseTimeChange = date => {
    setCloseTime(date);
  };

  const validateChanges = () => {
    if (
      defaultOpenTime.getTime() !== openTime.getTime() ||
      defaultCloseTime.getTime() !== closeTime.getTime()
    ) {
      return true;
    } else {
      // nothing has changed
      return false;
    }
  };

  return (
    <>
      <ListItem>
        <FormControl>
          <KeyboardTimePicker
            margin='normal'
            id='openAt'
            label='Opens at'
            value={openTime}
            onChange={handleOpenTimeChange}
            KeyboardButtonProps={{
              'aria-label': 'Opens at'
            }}
          />
          <FormHelperText>Time at which your store opens.</FormHelperText>
        </FormControl>
      </ListItem>
      <ListItem>
        <FormControl>
          <KeyboardTimePicker
            margin='normal'
            id='closeAt'
            label='Closes at'
            value={closeTime}
            onChange={handleCloseTimeChange}
            KeyboardButtonProps={{
              'aria-label': 'Close at'
            }}
          />
          <FormHelperText>Time at which your store closes.</FormHelperText>
        </FormControl>
      </ListItem>
      <ListItem>
        <Button
          disabled={loading || data || !validateChanges()}
          onClick={modifyActiveTime}>
          Save
        </Button>
      </ListItem>
    </>
  );
};

const ShopAbout = ({ defaultAboutValue }) => {
  const ABOUT_LIMIT = 1000;

  const [modifyShopAbout, { loading, error, data, called }] = useMutation(
    MODIFY_SHOP
  );

  return (
    <Formik
      initialValues={{ about: defaultAboutValue }}
      validationSchema={yup.object().shape({
        about: yup
          .string()
          .min(10, 'Too short!')
          .max(1000, 'Not more that 1000 characters')
          .required('About required'),
        website: yup
          .string()
          .url('Invalid url. Example url: https://www.raspaai.tk')
      })}
      onSubmit={(values, { setSubmitting }) => {
        modifyShopAbout({
          variables: {
            data: { ...values }
          }
        });
      }}>
      {formik => {
        return (
          <>
            <ListItem>
              <Typography variant='h4'>About</Typography>
            </ListItem>
            <ListItem>
              <TextField
                id='shop-about'
                name='about'
                label='About your shop'
                fullWidth
                required
                placeholder='About your shop'
                multiline
                variant='outlined'
              />
            </ListItem>
            <ListItem>
              <TextField
                name='website'
                label='Shop website'
                fullWidth
                placeholder='Your shop website | optional'
                variant='outlined'
              />
            </ListItem>
            <ListItem>
              <Button
                disabled={loading || error || data || called || !formik.dirty}
                onClick={formik.handleSubmit}>
                Save
              </Button>
            </ListItem>
          </>
        );
      }}
    </Formik>
  );
};

const ShopDashboardProfile = ({ shopUsername }) => {
  const { loading, error, data } = useQuery(SHOP, {
    variables: { publicShopUsername: shopUsername }
  });

  if (loading) return <Loading></Loading>;
  if (error) return <ErrorPage></ErrorPage>;
  if (data) {
    let {
      shop: {
        geometry: { coordinates },
        properties: {
          title: shopName,
          address,
          contactNumber,
          about,
          returnRefundPolicy,
          heroImage,
          openAt,
          closeAt,
          offDays,
          isOpenToday
        }
      }
    } = data;
    const lat = coordinates[1];
    const lng = coordinates[0];
    const isStoreOpenNow = getIsStoreOpenNow(
      openAt,
      closeAt,
      offDays,
      isOpenToday
    );

    return (
      <Container maxWidth='sm'>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Paper style={{ marginTop: 10 }}>
            <Typography
              id={shopUsername}
              variant='h3'
              component='h1'
              align='center'>
              <MenuItemLink to={`/shop/${shopUsername}`}>
                {shopName}
              </MenuItemLink>
            </Typography>
            <br></br>
            <MainFeaturedPost
              img={heroImage}
              title={shopName}></MainFeaturedPost>
            <List>
              <ShopAbout defaultAboutValue={about}></ShopAbout>

              <ListItem>
                <Typography variant='h4' id='active-time'>
                  Active time
                </Typography>
              </ListItem>
              <ListItem>
                <Typography
                  style={
                    isStoreOpenNow ? { color: 'green' } : { color: 'red' }
                  }>
                  {isStoreOpenNow ? 'Store is open now' : 'Store is closed now'}
                </Typography>
              </ListItem>

              <IsShopOpenToday isOpenToday={isOpenToday}></IsShopOpenToday>

              <Divider></Divider>

              <ShopOffDays offDays={offDays}></ShopOffDays>

              <Divider></Divider>

              <ShopOpenCloseTime
                openAt={openAt}
                closeAt={closeAt}></ShopOpenCloseTime>

              <Divider></Divider>

              <ListItem>
                <Typography id='address' variant='h4'>
                  Address
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>
                  <a
                    href={`${process.env.GATSBY_G_MAP_URL}${lat},${lng}`}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {address}
                  </a>
                </Typography>
              </ListItem>
              <ListItem>
                <a
                  href={`${process.env.GATSBY_G_MAP_URL}${lat},${lng}`}
                  target='_blank'
                  rel='noopener noreferrer'>
                  Click here to see address on google maps
                </a>
              </ListItem>

              <ListItem>
                <Typography id='contact' variant='h4'>
                  Contact
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>
                  <a href={`tel:${contactNumber}`}>+91{contactNumber}</a>
                </Typography>
              </ListItem>

              <ListItem>
                <Typography id='return-refund-policy' variant='h4'>
                  Return Refund Policy
                </Typography>
              </ListItem>
              {JSON.parse(returnRefundPolicy).map((policy, index) => (
                <ListItem key={index}>
                  <Typography>{policy}</Typography>
                </ListItem>
              ))}
              <ListItem>
                <Button
                  variant='contained'
                  component={Link}
                  to={`/dashboard/shop/${shopUsername}/return-refund-policy/edit`}>
                  Edit return refund policies
                </Button>
              </ListItem>
            </List>
          </Paper>
        </MuiPickersUtilsProvider>
      </Container>
    );
  }
};

export default ShopDashboardProfile;
