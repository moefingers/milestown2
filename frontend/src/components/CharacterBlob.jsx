import { useState, useRef, useEffect } from 'react'

export default function CharacterBlob({id=0, color=undefined, shape, x, y, controls = false}) {
    console.log(id, color, shape, x, y, controls)
    const [pickups, setPickups] = useState([])

    const blobRef = useRef(null)
    return (
        <div id={`blob-${id}`} ref={blobRef} className="character-blob" style={{
            left: `calc(${x} * var(--full-block))`, 
            top: `calc(${y} * var(--full-block))`,
            clipPath: shape.clipPath,
        }}>
            <div className='inner' style={{
                backgroundColor: color,
                clipPath: shape.clipPath,
                }}>
                {pickups}
            </div>
        </div>
    )
}