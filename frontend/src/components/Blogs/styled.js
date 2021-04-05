import styled from "styled-components"
import { Box, Paper, Typography } from "@material-ui/core"

export const BlogEntries = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  justify-content: center;
  margin-top: 25px;
`

export const Title = styled(Typography).attrs({
  component: "h1",
  variant: "h5",
  align: "center",
})``

export const ArticleTitle = styled(Typography).attrs({
  component: "h2",
  variant: "h5",
  align: "center",
})``

export const ArticleDescription = styled(Typography).attrs({})``

export const ArticleWrapper = styled(Paper).attrs({ component: "article", elevation: 3 })`
  padding: ${props => props.theme.spacing(3)}px;
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-flow: column;
`
export const ArticleHeaderWrapper = styled(Box).attrs({ component: "header" })``
export const ArticleSection = styled(Box).attrs({ component: "section" })``
