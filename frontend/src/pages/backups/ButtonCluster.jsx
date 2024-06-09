import { useEffect, useState, useContext } from 'react'

import { useInterval } from 'usehooks-ts'



import { ClientContext } from '../ClientContext'

import '../assets/styles/button-cluster.css'

export default function ButtonCluster({movementFunctions}) {

    const {
        clientId
    } = useContext(ClientContext)


    const [inputPressed, setInputPressed] = useState(false)
    const [currentDirection, setCurrentDirection] = useState("")

    const [movementDelayed, setMovementDelayed] = useState(false)
    useEffect(() => {
        if(movementDelayed) {
            setTimeout(() => {
                setMovementDelayed(false)
            }, 350);
        } else {
            
        }
    }, [movementDelayed])

    useEffect(() => {
        if(currentDirection != "" && inputPressed && !movementDelayed) {
            setMovementDelayed(true)
            movementFunctions[currentDirection](clientId)
        }
    }, [inputPressed])

    useInterval(() => {
        movementFunctions[currentDirection](clientId)
    }, currentDirection != "" ? 350 : null)


    // if mouse down inside element and then mouse is moved out of element, there is a problem where mouse up is not sent
    return (
        <div className='input-intercept' onMouseDown={() => setInputPressed(true)} onMouseUp={ () => setInputPressed(false)}>
            <div className="button-cluster">
                {['up', 'left', 'down', 'right'].map((direction, index) => {
                    return (
                        <div key={index} className={`movement-button ${direction} ${currentDirection == direction ? "active" : ""}`}
                        onMouseEnter={inputPressed ? ()=>setCurrentDirection(direction)  : ()=>setCurrentDirection("")   } 
                        onMouseLeave={inputPressed ? ()=>setCurrentDirection("")    : ()=>setCurrentDirection("")   } 
                        onMouseDown={()=>setCurrentDirection(direction)}
                        onMouseUp={()=>setCurrentDirection("")}/>
                    )
                })}
            </div>
        </div>
    )
}