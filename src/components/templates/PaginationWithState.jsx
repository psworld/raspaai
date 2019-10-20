import React from "react"

import Button from "@material-ui/core/Button"

const PaginationWithState = props => {
  const {
    hasNextPage,
    currentPageEndCursor,
    pageNo,
    setPageNo,
    pageInfo,
    setPageInfo,
  } = props
  function handleNext(currentPageEndCursor, pageNo) {
    const newPageInfo = pageInfo
    newPageInfo[pageNo] = { startCursor: currentPageEndCursor }
    setPageInfo(newPageInfo)
    setPageNo(pageNo + 1)
  }
  return (
    <>
      <Button
        disabled={!hasNextPage}
        onClick={() => handleNext(currentPageEndCursor, pageNo)}
        variant="contained"
        color="secondary"
      >
        Next
      </Button>
      <Button
        variant="contained"
        color="secondary"
        disabled={pageNo === 1}
        onClick={() => setPageNo(pageNo - 1)}
      >
        Back
      </Button>
    </>
  )
}

export default PaginationWithState
