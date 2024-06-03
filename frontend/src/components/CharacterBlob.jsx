import { useState, useRef, useEffect } from 'react'

export default function CharacterBlob({id=0, character, x, y, controls = false, blockSizeOverride=false}) {


    const {color, shape} = character
    const [pickups, setPickups] = useState([])

    const blobRef = useRef(null)
    return (
        <div id={`blob-${id}`} ref={blobRef} className={`character-blob${blockSizeOverride ? " override" : ""}`} style={{
            left: `calc(${x} * var(--full-block))`, 
            top: `calc(${y} * var(--full-block))`,
            clipPath: shape,
        }}>
            <div className='inner' style={{
                backgroundColor: color,
                clipPath: shape,
                }}>
                {pickups}
            </div>
        </div>
    )
}