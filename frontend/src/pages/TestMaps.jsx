import { useEffect, useState } from 'react'

import { Link } from "react-router-dom"

import { getMaps, getAesthetics } from '../assets/js/customFetch'

import ThemeButtons from '../components/ThemeButtons'
import DrawnMap from '../components/DrawnMap'

export default function TestMaps() {

    const [mapList, setMapList] = useState([])
    const [map, setMap] = useState(null)
    const [aesthetics, setAesthetics] = useState(null)
  
  
    useEffect(() => {
      getMaps().then((data) => setMapList(data))
      getAesthetics().then((data) => setAesthetics(data))
    },[])

    return (
        <>
            <ThemeButtons />
            <h1>TestMaps.jsx</h1> <Link to={".."}> go back</Link>
            <ul>{mapList.map((map, index) => <li key={index} className='clickable' onClick={(event)=>{setMap(map)}}>{map.name}</li>)}</ul>

            {map && <DrawnMap 
                mapObject={map} 
                aesthetics={aesthetics} 
                characters={[1,2,3,4].map((num, ind) => { return {color: aesthetics.colors[num].hex, shape: aesthetics.shapes[0].clipPath}})}/>}
      
        </>
    )
}