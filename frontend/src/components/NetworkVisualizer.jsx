
import { useEffect, useState} from 'react'
import '../assets/styles/network-visualizer.css'

export default function NetworkVisualizer({clientId, playerList}) {
    const [lineElements, setLineElements] = useState([])
    const [playerPairs, setPlayerPairs] = useState([])

    useEffect(() => {
        playerList.forEach((player, index) => {
            const deg = (360 * index / playerList.length)
            const rad = deg * Math.PI / 180
            const x = 50 * Math.cos(rad) + 50
            const y = 50 * Math.sin(rad) + 50
            console.log(player.playerId, x, y)
            playerList[index].x = x
            playerList[index].y = y
        })
    
        console.log("playerList", playerList)
        let pairs = []
        let lines = []
        playerList.forEach((player, index) => {
            const remainingList = playerList.slice(index + 1)
            console.log(remainingList)
            remainingList.forEach(otherPlayer => {
                const angleOfSlope = Math.atan((otherPlayer.y - player.y)/(otherPlayer.x - player.x)) * (180 / Math.PI)
                pairs.push({
                    players: [player, otherPlayer],
                    connected: false,
                    lineElement: {
                        origin: [player.x, player.y], 
                        angle: angleOfSlope,
                        reverseVector: otherPlayer.x - player.x >= 0,
                        length: Math.sqrt(Math.pow(otherPlayer.x - player.x, 2) + Math.pow(otherPlayer.y - player.y, 2))
                    }
                })
            })
        })
        // console.log("pairs", pairs)
        setPlayerPairs(pairs)
}, [])

    useEffect(() => {
        console.log("playerPairs", playerPairs)
    }, [playerPairs])

    useEffect(() => {
        console.log("playerList", playerList)
    }, [playerList])


    return (
        <div className="network-visualizer">
            {playerList.map((player, index) => {return <div 
                style={{"--position": index / playerList.length}}
                key={player.playerId}
                className={player.owner ? 'client owner' : 'client'}
                >{player.playerId} {index / playerList.length}</div>}
            )}
            {playerPairs.map((pair, index) => {
                return <div key={index} className="line" style={{
                    "--angle": pair.lineElement.angle + (pair.lineElement.reverseVector ? 180 : 0) + "deg", 
                    "--length": pair.lineElement.length + "%", 
                    "--origin-x": pair.lineElement.origin[0] + "%", 
                    "--origin-y": pair.lineElement.origin[1] + "%"
                }}></div>
            })}
        </div>
    )
}