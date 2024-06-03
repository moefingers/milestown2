import { useEffect, useState } from 'react'

import { Link } from "react-router-dom"



import { env } from './assets/js/determineEnvironment.mjs'// This determines the index path.. On github pages, it's "/milestown2" whereas on localhost or Render.com it's "/"

import LightSwitch from './components/LightSwitch'
import DrawnMap from './components/DrawnMap'
import SplashTitle from './components/SplashTitle'

import { getMaps, getAesthetics } from './assets/js/customFetch'

function App() {

  const [mapList, setMapList] = useState([])
  const [map, setMap] = useState(null)
  const [aesthetics, setAesthetics] = useState(null)


  useEffect(() => {
    getMaps().then((data) => setMapList(data))
    getAesthetics().then((data) => setAesthetics(data))
  },[])



  return ( // returning an empty set of <> means the parent will adopt its children
    <> 

      <LightSwitch/>
      <Link to={"TestClient"} >go to test client page</Link>


      {/* <ul>{mapList.map((map, index) => <li key={index} style={{cursor: 'pointer'}} onClick={(event)=>{setMap(map)}}>{map.name}</li>)}</ul> */}

      {/* {map && <DrawnMap mapObject={map} aesthetics={aesthetics} characters={[1,2,3,4].map((num, ind) => { return {color: aesthetics.colors[num].hex, shape: aesthetics.shapes[0].clipPath}})}/>} */}
      <SplashTitle/>
      
    </>
  )
}

export default App
