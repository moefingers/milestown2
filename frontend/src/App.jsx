import { useEffect, useState } from 'react'

import { Link } from "react-router-dom"



import { env } from './determineEnvironment.mjs'// This determines the index path.. On github pages, it's "/milestown2" whereas on localhost or Render.com it's "/"

import DrawnMap from './components/DrawnMap'
import Splash from './components/Splash'

import { getMaps, getAesthetics } from './assets/js/customFetch'

function App() {

  const [mapList, setMapList] = useState([])
  const [map, setMap] = useState(null)
  const [aesthetics, setAesthetics] = useState(null)
  const [splashOn, setSplashOn] = useState(false)


  useEffect(() => {
    getMaps().then((data) => setMapList(data))
    getAesthetics().then((data) => setAesthetics(data))

    setSplashOn(true)
  },[])



  return ( // returning an empty set of <> means the parent will adopt its children
    <> 

      <h1>h1 in app test</h1>
      <Link to={"TestClient"} >go to test client page</Link>


      <ul>
        {mapList.map((map, index) => <li key={index} style={{cursor: 'pointer'}} onClick={(event)=>{setMap(map)}}>{map.name}</li>)}
      </ul>

      {/* {map && <DrawnMap mapObject={map} aesthetics={aesthetics}/>} */}
      {splashOn && <Splash setSplashOn = {setSplashOn}/>}

    </>
  )
}

export default App
