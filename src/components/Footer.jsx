import React from "react"

import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import Link from "./core/Link"
import { Container, Grid, Box } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white,
    },
    ul: {
      margin: 0,
      padding: 0,
    },
    li: {
      listStyle: "none",
    },
    a: {
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}))

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" to="/">
        Raspaai
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  )
}

const Footer = ({ social }) => {
  const classes = useStyles()

  const footers = [
    {
      title: "Company",
      description: ["Team", "History", "Contact us", "Locations"],
    },
    {
      title: "Features",
      description: [
        "Cool stuff",
        "Random feature",
        "Team feature",
        "Developer stuff",
        "Another one",
      ],
    },
    {
      title: "Legal",
      description: ["Privacy policy", "Terms of use"],
    },
  ]

  const footersList = {
    social: [
      { title: "Twitter", url: `https://twitter.com/${social.twitter}` },
      {
        title: "Facebook",
        url: `https://www.facebook.com/${social.facebook}/`,
      },
      {
        title: "Instagram",
        url: `https://www.instagram.com/${social.instagram}/`,
      },
    ],
  }

  return (
    <Container component="footer" className={classes.footer}>
      <Grid container spacing={4} justify="space-evenly">
        {footers.map(footer => (
          <Grid item xs={6} sm={3} key={footer.title}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              {footer.title}
            </Typography>
            <ul>
              {footer.description.map(item => (
                <li key={item}>
                  <Typography>{item}</Typography>
                </li>
              ))}
            </ul>
          </Grid>
        ))}
        <Grid item xs={6} sm={3}>
          <Typography variant="h6" color="textPrimary" gutterBottom>
            Social
          </Typography>
          <ul>
            {footersList.social.map(item => (
              <li key={item.title}>
                <Typography>
                  <a
                    style={{ color: "inherit" }}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {item.title}
                  </a>
                </Typography>
              </li>
            ))}
          </ul>
        </Grid>
      </Grid>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  )
}

export default Footer
