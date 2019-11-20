import React from 'react';

import Button from '@material-ui/core/Button';

const PaginationWithState = props => {
  const { fetchMore, pageInfo, ...other } = props;
  const [loading, setLoading] = React.useState(false);
  return (
    <>
      <Button
        disabled={!pageInfo.hasNextPage || loading}
        onClick={() =>
          fetchMore({
            variables: {
              endCursor: pageInfo.endCursor,
              ...other
            },
            updateQuery: (previousResults, { loading, fetchMoreResult }) => {
              console.info(fetchMoreResult);
              if (loading) {
                setLoading(true);
              }
              if (fetchMoreResult) {
                const newData = Object.values(fetchMoreResult)[0];
                const key = Object.keys(fetchMoreResult)[0];

                const newEdges = newData.edges;

                const prevEdges = Object.values(previousResults)[0].edges;

                setLoading(false);
                return newEdges.length
                  ? {
                      [key]: {
                        ...newData,
                        edges: [...prevEdges, ...newEdges]
                      }
                    }
                  : previousResults;
              }
            }
          })
        }
        variant='contained'
        color='secondary'>
        Load more
      </Button>
      {/* <Button
        variant="contained"
        color="secondary"
        disabled={pageNo === 1}
        onClick={() => setPageNo(pageNo - 1)}
      >
        Back
      </Button> */}
    </>
  );
};

export default PaginationWithState;
