import React from "react"
import { connect } from "react-redux"
import { Box, Button, Typography } from "@material-ui/core"

function Counter({ count, increment }) {
  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Typography variant="body2" color="textSecondary" align="center">
        Count: {count}
      </Typography>
      <Button color="primary" onClick={increment}>
        Increment
      </Button>
    </Box>
  )
}

const mapStateToProps = store => {
  const nameOfYourReducer = "counter"
  return { count: store[nameOfYourReducer].count }
}

const mapDispatchToProps = dispatch => {
  return { increment: () => dispatch({ type: `INCREMENT` }) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter)
