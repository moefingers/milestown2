
import '../assets/styles/map.css'

export default function DrawnMap({mapObject}) {



    const {name, map, spawns} = mapObject

    return (
        <>
            <h1>DrawnMap.jsx, map[name]: {mapObject.name}</h1>
            <div className="map-container">{
                map.map((row, rowIndex) => {
                    return <div key={rowIndex} className="row">{row.map((tile, tileIndex) =>{
                        const noRight = !row[tileIndex+1]
                        const noDown = !map[rowIndex+1] || !map[rowIndex+1][tileIndex]
                        return <div key={tileIndex} className={tile == 1 ? "tile" : "tile blank"}>
                                {tile == 1 && <>
                                    <Edge classes="horizontal" /> {/* top edge */}
                                    <Edge classes="vertical"/> {/* left edge */}
                                    {noRight && <Edge classes="vertical end"/>} {/* right edge */}
                                    {noDown && <Edge classes="horizontal end" />} {/* bottom edge */}
                                </>}
                                {tile}
                            </div>

                    })}</div>}
                )
            }</div>
        </>
    )
}

function Edge ({classes}){
    return (
        <div className={`edge ${classes}`}>
            <div className="half-edge"></div>
            <div className="half-edge end"></div>
        </div>
    )
}