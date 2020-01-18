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
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { gql } from 'apollo-boost';
import clsx from 'clsx';
import 'date-fns';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import ErrorPage from '../../../core/ErrorPage';
import Link, { MenuItemLink } from '../../../core/Link';
import Loading from '../../../core/Loading';
import { getDayName, getIsStoreOpenNow } from '../../../core/utils';
import MainFeaturedPost from '../../../templates/MainFeaturedPost';
import { SHOP } from '../../ShopAboutPage';
import Orders from './Orders';
import PlanInfo from './PlanInfo';
import ShopReturnRefundPolicy from './ShopReturnRefundPolicy';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  spacing: {
    padding: theme.spacing(1)
  },
  fixedHeight: {
    minHeight: 240
  },
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

const MODIFY_SHOP_ACTIVE_TIME = gql`
  mutation($data: ModifyShopActiveTimeInput!) {
    modifyShopActiveTime(input: $data) {
      shop {
        id
        properties {
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
    MODIFY_SHOP_ACTIVE_TIME,
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
    MODIFY_SHOP_ACTIVE_TIME,
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
    MODIFY_SHOP_ACTIVE_TIME,
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

export const ShopDashboardProfile = ({ shopUsername }) => {
  const { loading, error, data } = useQuery(SHOP, {
    variables: { publicShopUsername: shopUsername }
  });

  const [reRender, setReRender] = React.useState(true);

  const handelReRender = () => {
    setReRender(!reRender);
  };

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

              <IsShopOpenToday
                reRender={handelReRender}
                isOpenToday={isOpenToday}></IsShopOpenToday>

              <Divider></Divider>

              <ShopOffDays
                reRender={handelReRender}
                offDays={offDays}></ShopOffDays>

              <Divider></Divider>

              <ShopOpenCloseTime
                reRender={handelReRender}
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

export default function Dashboard({ publicUsername, isBrand = false }) {
  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <Grid container>
      {/* Chart */}
      {!isBrand && (
        <Grid className={classes.spacing} item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
            <ShopReturnRefundPolicy publicUsername={publicUsername} />
          </Paper>
        </Grid>
      )}
      {/* Recent Deposits */}
      <Grid className={classes.spacing} item xs={12} md={4} lg={3}>
        <Paper className={fixedHeightPaper}>
          <PlanInfo isBrand={isBrand} publicUsername={publicUsername} />
        </Paper>
      </Grid>
      {/* Recent Orders */}
      {!isBrand && (
        <Grid className={classes.spacing} item xs={12}>
          <Paper className={classes.paper}>
            <Orders />
          </Paper>
        </Grid>
      )}
    </Grid>
  );
}
