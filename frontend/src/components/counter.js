import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Button, Typography } from "@material-ui/core"
import { increment } from "../redux/slices/counterSlice"

export default function Counter() {
  const dispatch = useDispatch()
  const { count } = useSelector(state => state.counter)

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Typography variant="body2" color="textSecondary" align="center">
        Count: {count}
      </Typography>
      <Button color="primary" onClick={e => dispatch(increment())}>
        Increment
      </Button>
    </Box>
  )
}
