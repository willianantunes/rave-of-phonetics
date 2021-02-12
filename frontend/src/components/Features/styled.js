import styled from "styled-components"
import { Box, Typography } from "@material-ui/core"

export const Title = styled(Typography).attrs({
  component: "h1",
  variant: "h5",
  align: "center",
})``

export const FeaturesWrapper = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  justify-content: center;
  margin-top: 25px;
`
