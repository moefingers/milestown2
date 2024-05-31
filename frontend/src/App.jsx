import { useEffect, useState } from 'react'

import { config } from './frontendEnvironment.mjs'

function App() {

  async function fetchData() {
    const res = await fetch(config.backend)
    const data = await res.json()
    console.log(data)
  }

  useEffect(() => {
    console.log(config)

    fetchData()

    
  },[])

  return ( // returning an empty set of <> means the parent will adopt its children
    <> 
      <h1>h1 in app test</h1>
      <button onClick={playGame}>play</button>
    </>
  )
}

export default App
