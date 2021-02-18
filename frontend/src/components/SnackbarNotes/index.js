import React from "react"
import * as S from "./styled"
import Slide from "@material-ui/core/Slide"
import { useDispatch, useSelector } from "react-redux"
import { closeMessage } from "../../redux/slices/messageBoardSlice"
import MuiAlert from "@material-ui/lab/Alert"

function SlideTransition(props) {
  return <Slide {...props} direction="up" />
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

export function SnackbarNotes() {
  // Infrastructure
  const dispatch = useDispatch()
  // Redux things
  const { open, message } = useSelector(state => state.messageBoard)

  const handleClose = (event, reason) => {
    // if (reason === "clickaway") {
    //   return
    // }
    dispatch(closeMessage())
  }

  return (
    <S.CustomSnackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      message={message}
      key={SlideTransition.name}
    />
  )

  // return (
  //   <S.CustomSnackbar
  //     open={open}
  //     autoHideDuration={6000}
  //     onClose={handleClose}
  //     // TransitionComponent={SlideTransition}
  //     // message={message}
  //     key={message}
  //   >
  //     <Alert onClose={handleClose} severity="info">
  //       {message}
  //     </Alert>
  //   </S.CustomSnackbar>
  // )
}
