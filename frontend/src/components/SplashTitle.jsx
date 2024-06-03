import { useEffect, useState } from 'react'

import '../assets/styles/splash.css'
import './DrawnMap'
import DrawnMap from './DrawnMap'


export default function SplashTitle() {

    const [splashElements, setSplashElements] = useState([])


    useEffect(() => {
        if(splashElements.length > 0){
            console.log("splashElements: ", splashElements)
            const orderedEdges = [
                {type: "h", x: "0", y:"0"}, // h top left
                {type: "h", x: "0,5", y:"0"}, // h top right
                {type: "v", x: "1", y:"0"}, // v top right
                {type: "v", x: "1", y:"0,5"}, // v bottom right
                {type: "h", x: "0,5", y:"1"}, // h bottom right
                {type: "h", x: "0", y:"1"}, // h bottom left
                {type: "v", x: "0", y:"0,5"}, // v bottom left
                {type: "v", x: "0", y:"0"} // v top left
            ].map(({type, x, y}, index) => {
                let orderedElement
                splashElements.forEach((element) => {
                    if(element.id == `${type}-${x}-${y}`){
                        orderedElement = element
                    }
                })
                return orderedElement
            })
            console.log("orderedEdges: ", orderedEdges)
            orderedEdges.forEach((element, index) => {
                element.animate([
                    {backgroundColor: "#ff0000", offset: 0, easing: 'ease-out'},
                    {backgroundColor: "#ff0000", offset: 1/18, easing: 'ease-out'},
                    {backgroundColor: "#ff0000", offset: 2/18, easing: 'ease-out'},

                    {backgroundColor: "#ff0000", offset: 8/18, easing: 'ease-out'},
                    {backgroundColor: "#000000", offset: 9/18, easing: 'ease-out'},

                    {backgroundColor: "#000000", offset: 16/18, easing: 'ease-out'},
                    {backgroundColor: "#000000", offset: 17/18, easing: 'ease-out'},
                    {backgroundColor: "#ff0000", offset: 18/18, easing: 'ease-out'},
                ], {
                    duration: 11250,
                    iterations: Infinity,
                    delay: - 5625 + 625 + (index * 625)
                })
            })
            const fullBlob = splashElements.filter((element) => element.className.includes("character-blob"))[0]
            const blobInner = fullBlob.children[0]
            blobInner.animate([
                {backgroundColor: "#ff0000", offset: 0},
                {backgroundColor: "#ff0000", offset: 4/9},
                {backgroundColor: "#000000", offset: 5/9},
                {backgroundColor: "#000000", offset: 8/9},

                {backgroundColor: "#ff0000", offset: 9/9},
            ], {
                duration: 11250,
                iterations: Infinity,
                delay: -5625
            })

            fullBlob.animate([
                {top: "0%", left: "0%", easing: 'ease-out'},
                {top: "0%", left: "50%", easing: 'ease-out'},
                {top: "0%", left: "100%", easing: 'ease-out'},
                {top: "50%", left: "100%", easing: 'ease-out'},
                {top: "100%", left: "100%", easing: 'ease-out'},
                {top: "100%", left: "50%", easing: 'ease-out'},
                {top: "100%", left: "0%", easing: 'ease-out'},
                {top: "50%", left: "0%", easing: 'ease-out'},
                {top: "0%", left: "0%", easing: 'ease-out'},
                {top: "0%", left: "0%", easing: 'ease-out'},
            ], { // 1/9 intervals
                duration: 5625, // 5 * 9/8 so each eighth is 625
                iterations: Infinity,
                delay: 0
            })

            const tile = splashElements.filter((element) => element.className.includes("tile"))[0]

            tile.animate([
                {backgroundColor: "#ff000055", offset: 0},
                {backgroundColor: "#33333355", offset: 2/18},
                
                {backgroundColor: "#33333355", offset: 7/18},
                {backgroundColor: "#00000077", offset: 9/18},
                {backgroundColor: "#33333355", offset: 11/18},

                {backgroundColor: "#33333355", offset: 16/18},
                {backgroundColor: "#ff000055", offset: 18/18},
            ], {
                duration: 11250,
                iterations: Infinity,
                delay: 0
            })

            
        }
    }, [splashElements])


    return (<>

       <div className="splash-container">
            <h1>
                <span className='first'>Milest</span>
                <div className="splash-square-wrapper">
                    <DrawnMap 
                        mapObject={{map:[[1]]}} 
                        aesthetics={{
                            colors: [{hex: "#ff0000"}, {hex: "#000000"}], 
                            shapes: [{clipPath: "polygon(50% 0%, 95% 20%, 100% 50%, 95% 80%, 50% 100%, 5% 80%, 0% 50%, 5% 20%)"}]
                        }} 
                        blockSizeOverride={`var(--splash-square)`}
                        setSplashElements={setSplashElements}
                        splashElements={splashElements}
                    />
                </div>
                
                <span className='second'>wn 2</span>
            </h1>
        </div>

    </>)
}