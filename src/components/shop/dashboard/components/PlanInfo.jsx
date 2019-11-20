/* eslint-disable no-script-url */

import React from "react"
import Link from "@material-ui/core/Link"
import Typography from "@material-ui/core/Typography"
import gql from "graphql-tag"
import { useQuery } from "react-apollo"

import ErrorPage from "../../../core/ErrorPage"
import Loading from "../../../core/Loading"

const BRAND_PLAN_INFO = gql`
  query($publicBrandUsername: String!) {
    brand(publicBrandUsername: $publicBrandUsername) {
      id
      publicUsername
      planIssuedAt
      planExpiryDate
      noOfProducts
      plan {
        id
        planId
        price
        productSpace
        validityDuration
      }
    }
  }
`

const PLAN_INFO = gql`
  query($publicShopUsername: String!) {
    shop(publicShopUsername: $publicShopUsername) {
      id
      properties {
        noOfProducts
        planIssuedAt
        planExpiryDate
        plan {
          id
          planId
          name
          price
          productSpace
          validityDuration
        }
      }
    }
  }
`

const PlanInfoCard = ({
  price,
  planExpiryDate,
  productSpace,
  noOfProducts,
}) => {
  return (
    <React.Fragment>
      {/* <Title>Plan Details</Title> */}
      <Typography component="p" variant="h6">
        ₹ {price} plan
      </Typography>
      {/* <Typography>Validity: {validityDuration.split(",")[0]}</Typography> */}
      <Typography color="textSecondary">
        expires on {planExpiryDate.toDateString()}
      </Typography>
      <Typography>
        {productSpace - noOfProducts} product space remaining out of total{" "}
        {productSpace}
        {/* <CircularProgress
          variant="static"
          value={availableProductSpaceTage}
        /> */}
      </Typography>
      {/* <Typography>Total Product Space: {productSpace}</Typography> */}

      <Typography>
        Days left : {parseInt((planExpiryDate - new Date()) / 8.64e7)}
      </Typography>
      <div>
        <Link color="primary" href="javascript:;">
          View Details
        </Link>
      </div>
    </React.Fragment>
  )
}

const BrandPlanInfo = ({ publicUsername }) => {
  const { loading, error, data } = useQuery(BRAND_PLAN_INFO, {
    variables: { publicBrandUsername: publicUsername },
  })
  if (loading) return <Loading></Loading>
  if (error) return <ErrorPage></ErrorPage>
  if (data) {
    const {
      id,
      planIssuedAt: planIssuedAtStr,
      planExpiryDate: planExpiryDateStr,
      noOfProducts,
      plan: { planId, price, productSpace, validityDuration },
    } = data.brand
    const planExpiryDate = new Date(planExpiryDateStr)
    const planIssuedAt = new Date(planIssuedAtStr)

    return (
      <PlanInfoCard
        price={price}
        planExpiryDate={planExpiryDate}
        productSpace={productSpace}
        noOfProducts={noOfProducts}
      ></PlanInfoCard>
    )
  }
}

const ShopPlanInfo = ({ publicUsername }) => {
  const { loading, error, data } = useQuery(PLAN_INFO, {
    variables: { publicShopUsername: publicUsername },
  })
  if (loading) return <Loading></Loading>
  if (error) return <ErrorPage></ErrorPage>
  if (data) {
    const {
      id,
      properties: {
        planIssuedAt: planIssuedAtStr,
        planExpiryDate: planExpiryDateStr,
        noOfProducts,
        plan: { planId, price, productSpace, validityDuration },
      },
    } = data.shop
    const planExpiryDate = new Date(planExpiryDateStr)
    const planIssuedAt = new Date(planIssuedAtStr)
    return (
      <PlanInfoCard
        price={price}
        planExpiryDate={planExpiryDate}
        productSpace={productSpace}
        noOfProducts={noOfProducts}
      ></PlanInfoCard>
    )
  }
}

export default function PlanInfo({ publicUsername, isBrand }) {
  if (isBrand) {
    return <BrandPlanInfo publicUsername={publicUsername}></BrandPlanInfo>
  } else {
    return <ShopPlanInfo publicUsername={publicUsername}></ShopPlanInfo>
  }
}
