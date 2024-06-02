import { useEffect, useState } from 'react'

import { Link } from "react-router-dom"



import { env } from './determineEnvironment.mjs'// This determines the index path.. On github pages, it's "/milestown2" whereas on localhost or Render.com it's "/"

import DrawnMap from './components/DrawnMap'
import { getMaps, getDate } from './assets/js/customFetch'

function App() {

  const [mapList, setMapList] = useState([])
  const [map, setMap] = useState(null)

  async function fetchData() {
    const res = await fetch(env.backend + '/date', {method: 'GET'})
    const data = await res.json()
    return data
  }

  useEffect(() => {
    console.log("getting date from /date endpoint for general testing")
    getDate().then((data) => console.log(data))

    getMaps().then((data) => setMapList(data))
  },[])



  return ( // returning an empty set of <> means the parent will adopt its children
    <> 

      <h1>h1 in app test</h1>
      <Link to={"TestClient"} >go to test client page</Link>


      <ul>
        {mapList.map((map, index) => <li key={index} style={{cursor: 'pointer'}} onClick={(event)=>{setMap(map)}}>{map.name}</li>)}
      </ul>

      {map && <DrawnMap map={map} />}

    </>
  )
}

export default App
