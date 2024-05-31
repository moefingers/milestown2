import { useEffect, useState } from 'react'

import { Link } from "react-router-dom"

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
      <button>play</button>
      <Link to="/TestClient" >go to test client</Link>

    </>
  )
}

export default App
