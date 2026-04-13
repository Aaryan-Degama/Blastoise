import React from 'react'
import { useParams } from 'react-router-dom'

function MediaDetail() {

    const {mediaID} = useParams()
  return (
    <div>MediaDetail: {mediaID}</div>
  )
}

export default MediaDetail