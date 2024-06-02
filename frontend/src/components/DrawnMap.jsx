import { Link } from "react-router-dom"

import '../assets/styles/map.css'

export default function DrawnMap({map}) {
    return (
        <>
            <Link to={".."}>go back</Link>
            <h1>DrawnMap.jsx, map[name]: {map.name}</h1>
            <div className="map-container">
                {map.map.map((row, index) => <div key={index} className="row">{row.map((tile, index) => <div key={index} className="tile">{tile}</div>)}</div>)}
            </div>
        </>
    )
}