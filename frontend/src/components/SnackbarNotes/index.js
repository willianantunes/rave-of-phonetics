import React from "react"
import * as S from "./styled"
import Slide from "@material-ui/core/Slide"
import { useDispatch, useSelector } from "react-redux"
import { toggleMessage } from "../../redux/slices/messageBoardSlice"

function SlideTransition(props) {
  return <Slide {...props} direction="up" />
}

export function SnackbarNotes() {
  // Infrastructure
  const dispatch = useDispatch()
  // Redux things
  const { open, message } = useSelector(state => state.messageBoard)

  const handleClose = () => {
    dispatch(toggleMessage())
  }

  return (
    <S.CustomSnackbar
      open={open}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      message={message}
      key={SlideTransition.name}
    />
  )
}
