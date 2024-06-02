import { useRef, useEffect, useState } from 'react';

import CharacterBlob from './CharacterBlob';

import '../assets/styles/map.css'

export default function DrawnMap({mapObject, preview=true, aesthetics, characters=[], blockSizeOverride=false, selfMove=false }) {
    const {name, map, spawns=[]} = mapObject
    console.log(map)



    function resizeMap(containerWidth, containerHeight, mapWidth, mapHeight) { // gets fired by resize
        // const mapIsTallerThanWide = map.length > map[0].length // If this is false, it could also be square. considering rotating the map down the road
        const mapRatio = mapWidth / mapHeight;
        const mapRatioRotated = mapHeight / mapWidth;
        const windowRatio = containerWidth / containerHeight;

        if (mapRatio > windowRatio) {
            // console.log("0 mapRatio > windowRatio")
            if (mapRatioRotated > windowRatio) {
                // console.log("00 mapRatioRotated > windowRatio")
                if(mapRatioRotated < mapRatio){
                    // console.log("000 mapRatioRotated < mapRatio")
                    document.documentElement.style.setProperty('--full-block',  80 / mapHeight + "vw")
                    document.documentElement.style.setProperty('--map-transform', "translate(-50%, -50%) rotate(90deg)") // mapHeight, vw, rotate
                }else if (mapRatioRotated >= mapRatio){
                    // console.log("001 mapRatioRotated > mapRatio")
                    document.documentElement.style.setProperty('--full-block',  80 / mapWidth + "vw")
                    document.documentElement.style.setProperty('--map-transform', "translate(-50%, -50%)") // mapWidth, vw
                }
            } else if (mapRatioRotated <= windowRatio) {
                // console.log("01 mapRatioRotated <= windowRatio")
                document.documentElement.style.setProperty('--full-block',  80 / mapWidth + "vw")
                document.documentElement.style.setProperty('--map-transform', "translate(-50%, -50%)") // mapWidth, vw
                if((windowRatio / mapRatioRotated) < (mapRatio)){
                    // console.log(`010 (windowRatio / mapRatioRotated) < (mapRatio)`)
                    document.documentElement.style.setProperty('--full-block',  80 / mapWidth + "vh")
                    document.documentElement.style.setProperty('--map-transform', "translate(-50%, -50%) rotate(90deg)") // mapWidth, vh, rotate
                }
            }
        } else if ( mapRatio <= windowRatio) {
            // console.log("1 mapRatio <= windowRatio", mapRatio / windowRatio)
            if (mapRatioRotated > windowRatio) {
                // console.log("10 mapRatioRotated > windowRatio", mapRatioRotated / windowRatio)
                document.documentElement.style.setProperty('--full-block',  80 / mapHeight + "vw")
                document.documentElement.style.setProperty('--map-transform', "translate(-50%, -50%) rotate(90deg)") // mapHeight, vw, rotate
                if((windowRatio / mapRatioRotated) < (mapRatio)){
                    // console.log(`100 (windowRatio / mapRatioRotated) < (mapRatio)`)
                    document.documentElement.style.setProperty('--full-block',  80 / mapHeight + "vh")
                    document.documentElement.style.setProperty('--map-transform', "translate(-50%, -50%)") // mapHeight, vh
                }
            } else if (mapRatioRotated <= windowRatio) {
                // console.log("11 mapRatioRotated <= windowRatio")
                if(mapRatioRotated < mapRatio){
                    // console.log("110 mapRatioRotated < mapRatio")
                    document.documentElement.style.setProperty('--full-block',  80 / mapHeight + "vh")
                    document.documentElement.style.setProperty('--map-transform', "translate(-50%, -50%)") // mapHeight, vh
                }else if (mapRatioRotated >= mapRatio){
                    // console.log("111 mapRatioRotated > mapRatio")
                    document.documentElement.style.setProperty('--full-block',  80 / mapWidth + "vh")
                    document.documentElement.style.setProperty('--map-transform', "translate(-50%, -50%) rotate(90deg)") // mapWidth, vh, rotate
                }
            }
        }
        // document.documentElement.style.setProperty('--full-block',  fullBlock)  // toying with idea of minifying
        // document.documentElement.style.setProperty('--map-transform', `translate(-50%, -50%) ${rotate ? "rotate(90deg)" : ""}`)
        if(mapRatio == 1){
            document.documentElement.style.setProperty('--map-transform', "translate(-50%, -50%)")
        }
    }
    if(!blockSizeOverride){
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
    } else {
        document.documentElement.style.setProperty('--full-block', blockSizeOverride)
    }
    // when map is rotated, 0 0 becomes top right
    const mapContainerRef = useRef()

    useEffect(() => {
        
        const tileElements = Object.values(mapContainerRef.current.children).filter((child) => child.className == "row").map(({children}) => {
            return Object.values(children).map((element) => {
                return element
            })
        })
        const blobElements = Object.values(mapContainerRef.current.children).filter((child) => child.className == "character-blob").map((element) => {
            return element
        })
        console.log("tileElements: ", tileElements)
        console.log("blobElements: ", blobElements)
        Object.values(blobElements).forEach((blob, index) => {
            const animationOptions = {
                duration: 3000,
                iterations: Infinity,
                direction: 'alternate',
                delay: - 3000 + (index * 3000/blobElements.length)
            }
            const animateShapeKeys = aesthetics.shapes.map((shape) => {return {clipPath: shape.clipPath}})

            blob.children[0].animate(aesthetics.colors.map((color) => {
                    return {backgroundColor: color.hex}
                }),
            animationOptions)
            blob.animate(animateShapeKeys, animationOptions)
            blob.children[0].animate(animateShapeKeys, animationOptions)
        })
        
        
    }, [mapObject])
    return (
        <>
            <div className="map-container" ref={mapContainerRef}>{
                map.map((row, rowIndex) => {
                    return <div key={rowIndex} className="row">{row.map((tile, tileIndex) =>{
                        const noRight = !row[tileIndex+1]
                        const noDown = !map[rowIndex+1] || !map[rowIndex+1][tileIndex]
                        return <div key={tileIndex} x={tileIndex} y={rowIndex} className={tile == 1 ? "tile" : "tile blank"} style={{backgroundColor: tile==1 && aesthetics.colors[0].hex + "66"}}>
                                {tile == 1 && <>
                                    <Edge classes="horizontal" color={aesthetics.colors[0].hex}/>                   {/* top edge */}
                                    <Edge classes="vertical" color={aesthetics.colors[0].hex}/>                     {/* left edge */}
                                    {noRight && <Edge classes="vertical end" color={aesthetics.colors[0].hex}/>}    {/* right edge */}
                                    {noDown && <Edge classes="horizontal end" color={aesthetics.colors[0].hex}/>}   {/* bottom edge */}
                                </>}
                            </div>
                        

                    })}</div>}
                )
            }
            {preview && spawns.map((spawn, index) => {
                if(characters.length >= index){
                    return <CharacterBlob key={index} shape={aesthetics.shapes[0]} x={spawn[0]} y={spawn[1]}/>
                }
            })}
            {selfMove && <CharacterBlob shape={aesthetics.shapes[0]} x={0} y={0} selfMove={true}/>}
            </div>
        </>
    )
}

function Edge ({classes, color}){
    return (
        <div className={`edge ${classes}`} >
            <div className="half-edge" style={{backgroundColor: color}}></div>
            <div className="half-edge end" style={{backgroundColor: color}}></div>
        </div>
    )
}