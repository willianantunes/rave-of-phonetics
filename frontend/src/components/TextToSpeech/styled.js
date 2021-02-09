import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"
import { FormControl, LinearProgress } from "@material-ui/core"

export const CustomCard = styled(Card)`
  & .MuiFormGroup-row {
    justify-content: center;
  }
`

export const UnsupportedVoiceEngine = styled(Typography)`
  margin: 15px 0px 15px 0px;
`

export const AvailableVoicesFormControl = styled(FormControl)`
  margin: 15px 0px 15px 0px;
`

export const LoadingVoices = styled(LinearProgress)`
  margin: 15px 0px 15px 0px;
`
