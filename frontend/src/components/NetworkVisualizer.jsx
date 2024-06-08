
import { useEffect, useState, useContext} from 'react'

import { ClientContext } from '../ClientContext'

import '../assets/styles/network-visualizer.css'

export default function NetworkVisualizer({clientId, playerList}) {
    const {playerPairs, setPlayerPairs} = useContext(ClientContext)

    useEffect(() => {
        // This must be in a separate for loop because the next loop needs these values from later indices
        playerList.forEach((player, index) => {
            const deg = (360 * index / playerList.length)
            const rad = deg * Math.PI / 180
            const x = 50 * Math.cos(rad) + 50
            const y = 50 * Math.sin(rad) + 50
            console.log(player.playerId, x, y)
            playerList[index].onCircleX = x
            playerList[index].onCircleY = y
        })
    
        console.log("playerList", playerList)
        let pairs = []
        playerList.forEach((player, index) => {
            const remainingList = playerList.slice(index + 1)
            console.log(remainingList)
            remainingList.forEach(otherPlayer => {
                const angleOfSlope = Math.atan((otherPlayer.onCircleY - player.onCircleY)/(otherPlayer.onCircleX - player.onCircleX)) * (180 / Math.PI)
                pairs.push({
                    pair: [player.playerId, otherPlayer.playerId],
                    connected: false,
                    lineElement: {
                        origin: [player.onCircleX, player.onCircleY], 
                        angle: angleOfSlope,
                        reverseVector: otherPlayer.onCircleX - player.onCircleX >= 0,
                        length: Math.sqrt(Math.pow(otherPlayer.onCircleX - player.onCircleX, 2) + Math.pow(otherPlayer.onCircleY - player.onCircleY, 2))
                    }
                })
            })
        })
        // console.log("pairs", pairs)
        setPlayerPairs(pairs)
}, [])

    // useEffect(() => {
    //     console.log("playerPairs", playerPairs)
    //     console.log("playerList", playerList)
    // }, [playerPairs, playerList])


    return (
        <div className="network-visualizer">
            <div className="background"/>
            {playerList.map((player, index) => {return <div 
                style={{"--position": index / playerList.length}}
                key={player.playerId}
                className={`client${player.owner ? ' owner' : ''}${player.playerId === clientId ? ' self' : ''}`}
                >{player.playerId}</div>}
            )}
            {playerPairs.map((pair, index) => {
                return <div key={index} className={`line${pair.connected ? ' connected' : ''}`} style={{
                    "--angle": pair.lineElement.angle + (pair.lineElement.reverseVector ? 180 : 0) + "deg", 
                    "--length": pair.lineElement.length + "%", 
                    "--origin-x": pair.lineElement.origin[0] + "%", 
                    "--origin-y": pair.lineElement.origin[1] + "%"
                }}></div>
            })}
        </div>
    )
}