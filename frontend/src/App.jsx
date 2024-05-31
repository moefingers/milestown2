import { useEffect, useState } from 'react'

import { Link } from "react-router-dom"

// This determines the index path.. On github pages, it's "/milestown2" whereas on localhost or Render.com it's "/"

import { env } from './determineEnvironment.mjs'

function App() {

  async function fetchData() {
    const res = await fetch(env.backend + '/date', {method: 'GET'})
    const data = await res.json()
    return data
  }

  useEffect(() => {
    console.log("getting date from /date endpoint for general testing")
    fetchData().then(data => console.log(data))

    
  },[])

  return ( // returning an empty set of <> means the parent will adopt its children
    <> 

      <h1>h1 in app test</h1>
      <Link to={"TestClient"} >go to test client page</Link>

    </>
  )
}

export default App
