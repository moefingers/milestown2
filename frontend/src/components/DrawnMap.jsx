import { useRef, useEffect, useState } from 'react';

import CharacterBlob from './CharacterBlob';

import '../assets/styles/map.css'

export default function DrawnMap({mapObject, preview=true, aesthetics, characters=[], blockSizeOverride=undefined, setSplashElements, splashElements }) {
    const {name, map, spawns=[]} = mapObject
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
        document.documentElement.style.setProperty('--full-block-override', blockSizeOverride)
    }
    // when map is rotated, 0 0 becomes top right
    const mapContainerRef = useRef()

    useEffect(() => {
        
        const tileElements = Object.values(mapContainerRef.current.children).filter((child) => child.className.includes("row")).map(({children}) => {
            return Object.values(children).map((element) => {
                return element
            })
        }).flat(1)
        const edgeElements = Object.values(mapContainerRef.current.children).filter((child) => child.className.includes("row")).map(({children}) => {
            return Object.values(children).map(({children}) => {
                return Object.values(children).map(({children}) => {
                    return Object.values(children).map((element) => {
                        return element
                    })
                })
            })
        }).flat(3)
        const blobElements = Object.values(mapContainerRef.current.children).filter((child) => child.className.includes("character-blob")).map((element) => {
            return element
        }).flat(1)
        console.log("tileElements: ", tileElements)
        console.log("blobElements: ", blobElements)
        console.log("edgeElements: ", edgeElements)
        Object.values(blobElements).filter((blob) => !blob.className.includes("override")).forEach((blob, index) => {
            const animationOptions = {
                duration: 3000,
                iterations: 2 - (index / blobElements.length),
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

        if(setSplashElements && splashElements.toString() != [...tileElements, ...blobElements, ...edgeElements].toString()){
            setSplashElements([...tileElements, ...blobElements, ...edgeElements])
        }
        
    }, [mapObject])
    return (
        <>
            <div className="map-container" ref={mapContainerRef}>{
                map.map((row, rowIndex) => {
                    return <div key={rowIndex} className="row">{row.map((tile, tileIndex) =>{
                        const noRight = !row[tileIndex+1]
                        const noDown = !map[rowIndex+1] || !map[rowIndex+1][tileIndex]
                        return <div id={`tile-${tileIndex}-${rowIndex}`} key={tileIndex} x={tileIndex} y={rowIndex} className={`${tile == 1 ? "tile" : "tile blank"} ${blockSizeOverride ? "override" : ""}`} style={{backgroundColor: tile==1 && aesthetics.colors[0].hex + "66"}}>
                                {tile == 1 && <>
                                    <Edge classes="horizontal" color={aesthetics.colors[0].hex} coords={{type: "h", x: tileIndex, y: rowIndex}}/>                   {/* top edge */}
                                    <Edge classes="vertical" color={aesthetics.colors[0].hex} coords={{type: "v", x: tileIndex, y: rowIndex}}/>                     {/* left edge */}
                                    {noRight && <Edge classes="vertical end" color={aesthetics.colors[0].hex} coords={{type: "v", x: tileIndex+1, y: rowIndex}}/>}    {/* right edge */}
                                    {noDown && <Edge classes="horizontal end" color={aesthetics.colors[0].hex} coords={{type: "h", x: tileIndex, y: rowIndex+1}}/>}   {/* bottom edge */}
                                </>}
                            </div>
                        

                    })}</div>}
                )
            }
            {preview ? spawns.map((spawn, index) => {
                if(characters.length >= index + 1){
                    return <CharacterBlob key={index} character={characters[index]} x={spawn[0]} y={spawn[1]}/>
                }
            }) :
                characters.map((character, index) => {
                    return <CharacterBlob key={index} character={character} x={character.x} y={character.y}/>
                })
            }
            {setSplashElements && <CharacterBlob character={{shape:aesthetics.shapes[0].clipPath, color:aesthetics.colors[0].hex}} x={0} y={0} setSplashElements={setSplashElements} blockSizeOverride={true}/>}
            </div>
        </>
    )
}

function Edge ({classes, color, coords}){
    const {type, x, y} = coords
    let firstHalf = `${type}-${x}-${y}`
    let secondHalf = type == "h" ? `${type}-${x + ",5"}-${y}` : `${type}-${x}-${y+",5"}`
    return (
        <div className={`edge ${classes}`} >
            <div className="half-edge" style={{backgroundColor: color}} id={firstHalf}/>
            <div className="half-edge end" style={{backgroundColor: color}} id={secondHalf}/>
        </div>
    )
}