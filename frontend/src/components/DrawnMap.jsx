
import '../assets/styles/map.css'

export default function DrawnMap({mapObject}) {
    const {name, map, spawns} = mapObject


    function resizeMap(containerWidth, containerHeight, mapWidth, mapHeight) { // gets fired by resize
        // const mapIsTallerThanWide = map.length > map[0].length // If this is false, it could also be square. considering rotating the map down the road
        const mapRatio = mapWidth / mapHeight;
        const mapRatioRotated = mapHeight / mapWidth;
        const windowRatio = containerWidth / containerHeight;

        let divisor
        let rotate

        if (mapRatio > windowRatio) {
            console.log("0 mapRatio > windowRatio")
            if (mapRatioRotated > windowRatio) {
                console.log("00 mapRatioRotated > windowRatio")
                if(mapRatioRotated < mapRatio){
                    console.log("000 mapRatioRotated < mapRatio")
                    document.documentElement.style.setProperty('--full-block',  80 / mapHeight + "vw")
                    document.documentElement.style.setProperty('--map-transform', "translate(-50%, -50%) rotate(90deg)") // mapHeight, vw, rotate
                }else if (mapRatioRotated >= mapRatio){
                    console.log("001 mapRatioRotated > mapRatio")
                    document.documentElement.style.setProperty('--full-block',  80 / mapWidth + "vw")
                    document.documentElement.style.setProperty('--map-transform', "translate(-50%, -50%)") // mapWidth, vw
                }
            } else if (mapRatioRotated <= windowRatio) {
                console.log("01 mapRatioRotated <= windowRatio")
                document.documentElement.style.setProperty('--full-block',  80 / mapWidth + "vw")
                document.documentElement.style.setProperty('--map-transform', "translate(-50%, -50%)") // mapWidth, vw
                if((windowRatio / mapRatioRotated) < (mapRatio)){
                    console.log(`010 (windowRatio / mapRatioRotated) < (mapRatio)`)
                    document.documentElement.style.setProperty('--full-block',  80 / mapWidth + "vh")
                    document.documentElement.style.setProperty('--map-transform', "translate(-50%, -50%) rotate(90deg)") // mapWidth, vh, rotate
                }
            }
        } else if ( mapRatio <= windowRatio) {
            console.log("1 mapRatio <= windowRatio", mapRatio / windowRatio)
            if (mapRatioRotated > windowRatio) {
                console.log("10 mapRatioRotated > windowRatio", mapRatioRotated / windowRatio)
                document.documentElement.style.setProperty('--full-block',  80 / mapHeight + "vw")
                document.documentElement.style.setProperty('--map-transform', "translate(-50%, -50%) rotate(90deg)") // mapHeight, vw, rotate
                if((windowRatio / mapRatioRotated) < (mapRatio)){
                    console.log(`100 (windowRatio / mapRatioRotated) < (mapRatio)`)
                    document.documentElement.style.setProperty('--full-block',  80 / mapHeight + "vh")
                    document.documentElement.style.setProperty('--map-transform', "translate(-50%, -50%)") // mapHeight, vh
                }
            } else if (mapRatioRotated <= windowRatio) {
                console.log("11 mapRatioRotated <= windowRatio")
                if(mapRatioRotated < mapRatio){
                    console.log("110 mapRatioRotated < mapRatio")
                    document.documentElement.style.setProperty('--full-block',  80 / mapHeight + "vh")
                    document.documentElement.style.setProperty('--map-transform', "translate(-50%, -50%)") // mapHeight, vh
                }else if (mapRatioRotated >= mapRatio){
                    console.log("111 mapRatioRotated > mapRatio")
                    document.documentElement.style.setProperty('--full-block',  80 / mapWidth + "vh")
                    document.documentElement.style.setProperty('--map-transform', "translate(-50%, -50%) rotate(90deg)") // mapWidth, vh, rotate
                }
            }
        }
        // document.documentElement.style.setProperty('--full-block',  80 / divisor)
        // document.documentElement.style.setProperty('--map-transform', `translate(-50%, -50%) ${rotate ? "rotate(90deg)" : ""}`)
    }
    onresize = () => resizeMap(
        document.documentElement.clientWidth,
        document.documentElement.clientHeight,
        map[0].length,
        map.length
    )
    resizeMap(
        document.documentElement.clientWidth,
        document.documentElement.clientHeight,
        map[0].length,
        map.length
    )

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
                                    <Edge classes="horizontal" />                   {/* top edge */}
                                    <Edge classes="vertical"/>                      {/* left edge */}
                                    {noRight && <Edge classes="vertical end"/>}     {/* right edge */}
                                    {noDown && <Edge classes="horizontal end" />}   {/* bottom edge */}
                                </>}
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