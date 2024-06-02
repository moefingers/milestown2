import { useEffect, useState } from 'react'

import '../assets/styles/splash.css'
import './DrawnMap'
import DrawnMap from './DrawnMap'


export default function Splash({setSplashOn}) {

    useEffect(() => {
        setTimeout(() => {
            setSplashOn(false)
        }, 5000);
    }, [])


    return (<>

       <div className="splash-container">
            <h1>
                <span>Milest</span>
                <DrawnMap 
                    mapObject={{map:[[1]]}} 
                    selfMove={true} 
                    aesthetics={{colors: [{hex: "#000000"}], 
                    shapes: [{clipPath: "polygon(50% 0%, 95% 20%, 100% 50%, 95% 80%, 50% 100%, 5% 80%, 0% 50%, 5% 20%)"}]}} 
                    blockSizeOverride={`var(--splash-title-height)`}
                />
                <span>wn 2</span>
            </h1>
        </div>

    </>)
}