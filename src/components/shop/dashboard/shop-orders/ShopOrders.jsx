import { Button } from '@material-ui/core';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { gql } from 'apollo-boost';
import MaterialTable from 'material-table';
import { reverse } from 'named-urls';
import React, { forwardRef } from 'react';
import { useQuery } from 'react-apollo';
import Link from '../../../core/Link';
import routes from '../../../core/routes';

const SHOP_ORDERS = gql`
  query($after: String, $first: Int) {
    shopOrders(after: $after, first: $first) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        node {
          id
          created
          referenceId
          status
          userEmail
          userPhone
          userFullName
          address
          total
          totalItems
        }
      }
    }
  }
`;

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const ShopOrders = ({ shopUsername }) => {
  const [paginationState, setPaginationState] = React.useState({
    pageInfos: [{ endCursor: undefined }],
    currentPage: 0,
    first: 5
  });

  const { loading, client } = useQuery(SHOP_ORDERS, {
    variables: { first: paginationState.first }
  });

  // const mappedData = React.useMemo(() => {
  //   if (data) {
  //     return data.shopOrders.edges.map(
  //       ({ node: { __typename, ...item } }) => item
  //     );
  //   }
  //   return [];
  // }, [data]);

  // if (loading) return <Loading></Loading>;
  // if (error) return <GraphqlErrorMessage error={error}></GraphqlErrorMessage>;

  // client.query
  return (
    <div style={{ maxWidth: '100%' }}>
      <center>
        <Button
          color='primary'
          component={Link}
          variant='contained'
          to={reverse(`${routes.shop.dashboard.placeOrder.self}`, {
            shopUsername
          })}>
          Shop for products
        </Button>
      </center>
      <MaterialTable
        options={{
          pageSizeOptions: [5, 10],
          draggable: false,
          emptyRowsWhenPaging: false,
          showFirstLastPageButtons: false
        }}
        isLoading={loading}
        icons={tableIcons}
        columns={[
          { title: 'Placed on', field: 'created', type: 'datetime' },
          { title: 'Ref Id', field: 'referenceId' },
          { title: 'Status', field: 'status' },
          { title: 'Total', field: 'total', type: 'numeric' }
        ]}
        // onChangeRowsPerPage={newPageSize => {
        //   const currentPageSize = paginationState.pageSize;
        //   if (currentPageSize < newPageSize) {
        //     setPaginationState({
        //       ...paginationState,
        //       first: newPageSize
        //     });
        //   }
        // }}
        onChangePage={nextPage => {
          if (nextPage !== 0) {
            setPaginationState({
              ...paginationState,
              currentPage: nextPage
            });
          }
          // const currentPage = paginationState.currentPage;
          // if (currentPage < nextPage && pageInfo.hasNextPage) {
          //   fetchMore({
          //     variables: {
          //       after: pageInfo.endCursor,
          //       first: paginationState.first + 1
          //     },
          //     updateQuery: (
          //       previousResults,
          //       { loading, fetchMoreResult }
          //     ) => {
          //       if (loading) {
          //         // setLoading(true);
          //       }
          //       if (fetchMoreResult) {
          //         const newData = Object.values(fetchMoreResult)[0];
          //         const key = Object.keys(fetchMoreResult)[0];

          //         const newEdges = newData.edges;

          //         const prevEdges = Object.values(previousResults)[0].edges;

          //         // setLoading(false);
          //         return newEdges.length
          //           ? {
          //               [key]: {
          //                 ...newData,
          //                 edges: [...prevEdges, ...newEdges]
          //               }
          //             }
          //           : previousResults;
          //       }
          //     }
          //   });
          // }
        }}
        data={query =>
          new Promise((resolve, reject) => {
            const nextPage = query.page;

            const after = paginationState.pageInfos[query.page].endCursor;
            client
              .query({
                query: SHOP_ORDERS,
                variables: { after, first: query.pageSize }
              })
              .then(({ data: newData }) => {
                const pageInfos = paginationState.pageInfos;
                pageInfos[nextPage + 1] = newData.shopOrders.pageInfo;
                setPaginationState({
                  ...paginationState,
                  pageInfos,
                  currentPage: nextPage
                });

                const mappedData = newData.shopOrders.edges.map(
                  ({ node: { __typename, ...item } }) => item
                );

                resolve({
                  data: mappedData,
                  page: query.page,
                  totalCount: newData.shopOrders.totalCount
                });
              });
          })
        }
        title='Your Orders'
      />
    </div>
  );

  // return (
  //   <>
  //     <Typography variant='h4' align='center'>
  //       You do not have any orders right now.
  //     </Typography>
  //     <br></br>
  //     <center>
  //       <Button
  //         color='primary'
  //         component={Link}
  //         variant='contained'
  //         to={reverse(`${routes.shop.dashboard.placeOrder.self}`, {
  //           shopUsername
  //         })}>
  //         Shop for products
  //       </Button>
  //     </center>
  //   </>
  // );
};

export default ShopOrders;
