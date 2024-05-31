import { useEffect, useState } from 'react'

import { env } from './frontendEnvironment.mjs'

function App() {

  async function fetchData() {
    const url = window.location.hostname === 'localhost'
      ? env.localbackend
      : env.livebackend
    const res = await fetch(url + '/date', {method: 'GET'})
    const data = await res.json()
    return data
  }

  useEffect(() => {
    fetchData().then(data => console.log(data))

    
  },[])

  return ( // returning an empty set of <> means the parent will adopt its children
    <> 
      <h1>h1 in app test</h1>
      <button>play</button>
    </>
  )
}

export default App
