import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"

import { Peer } from 'peerjs'

import { env } from '../determineEnvironment.mjs'

export default function TestClient() {


    const [peer, setPeer] = useState(null)
    const [peerId, setPeerId] = useState(null)

    const [currentConnection, setCurrentConnection] = useState(null)
    const connectionRef = useRef({})
    connectionRef.current = currentConnection

    const [remoteConnectionSuccessful, setRemoteConnectionSuccessful] = useState(false)

    const [peerIdInput, setPeerIdInput] = useState('')

    const [chatInput, setChatInput] = useState('')
    const [visualLog, setVisualLog] = useState([])
    const logRef = useRef({})
    logRef.current = visualLog



    function constructAndRegisterPeer(setConnectionState, setConnectionObject, handleDataReception){
        // IMPORTANT: we can set a custom id by saying Peer(id, options) // https://peerjs.com/docs/
        let peer = new Peer(env.clientPeerSettings)

        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            setPeerId(id)
        });
        peer.on('error', (error) => {
            console.log(error)
        });
        peer.on('connection', (connection) => {
            connection.on('data', handleDataReception)

            console.log('remotely initiated connection')
            setConnectionState(true)
            setConnectionObject(connection)

        })
        peer.on('close', () => {
            console.log('peer closed')
        })
        

        return peer
    }
    function connectToPeer(currentPeer, remotePeerId, setConnectionState, handleDataReception, sendMessage){
        console.log('attempting to connect to peer ' + remotePeerId)
        let remoteConnection = currentPeer.connect(remotePeerId)

        remoteConnection.on('data', handleDataReception)


        remoteConnection.on('open', () => {
            sendMessage(`Connected.`, true, remoteConnection)


            console.log('remoteConnection open')
            // setVisualLog([...visualLog, `local message - connected to ${remotePeerId}`])
            setConnectionState(true)
            // setConnectionObject(remoteConnection)
        })
        
        return remoteConnection
    }

    const cyrb53 = (str, seed = 0) => { // https://stackoverflow.com/a/52171480
        let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
        for(let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
        h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
        h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
      
        return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    };
    // DEPENDENCIES in parent context for following function
    // logRef
    // visualLog
    // setVisualLog
    // currentConnectionRef
    function handleDataReception(data){
        console.log("received, ", data)
        console.log(logRef.current)
        if(data.type === "receipt"){
            const logWithReceipt = logRef.current.map(logEntry => {
                if(logEntry.hash === data.hash){
                    return {...logEntry, received: true}
                } else {
                    return logEntry
                }
            })
            setVisualLog(logWithReceipt)
        } else if (data.type === "message"){
            connectionRef.current.send({
                time: new Date().toISOString(),
                hash: data.hash,
                type: "receipt"
            })
            setVisualLog([...logRef.current, data])
        }

        

        // console.log("received data: ", cyrb53(data.toString(), 1), data )
        // console.log("Old message array: ", logRef.current)
        // console.log("New message array: ", [...logRef.current, data])

    }

    function sendMessage(message, system=false, connection=connectionRef.current){
        const currentTime = new Date().toISOString()

        const msgObject ={
            owner: system ? 'remote/system' : "remote",
            message: message,
            time: currentTime,
            hash: cyrb53(message + currentTime, 1),
            received: null,
            type: "message"
        }

        connection.send(msgObject)
        
        setVisualLog([...logRef.current, {
            ...msgObject,
            owner: system ? 'local/system' : 'local',
            received: false
        }])

    }


    return (
        <>
            <h1>test client</h1>
            <Link to={".."}>go back</Link>

            {/* <button onClick={async (event)=>{await postOffer(await generateOffer()); setDevResponse(await getAllOffers())}}>post offer to server</button>

            <button onClick={async (event)=>{await deleteAllOffers(); setDevResponse(await getAllOffers())}}>delete all offers</button>

            <button onClick={async (event)=>{setDevResponse(await getAllOffers())}}>get all offers</button> */}

            <button onClick={(event)=>{setPeer(constructAndRegisterPeer(setRemoteConnectionSuccessful, setCurrentConnection, handleDataReception))}} >register with peerserver</button>
            {peer && <>
                <input type="text" onChange={(event)=>{setPeerIdInput(event.target.value)}} value={peerIdInput}/>
                <button onClick={(event)=>{setCurrentConnection(connectToPeer(peer, peerIdInput, setRemoteConnectionSuccessful, handleDataReception, sendMessage))}}> connect to peer</button>
            </>}
            <div>my id: </div>
            <div style={{cursor: 'pointer'}} onClick={(event)=> {navigator.clipboard.writeText(peerId); console.log("copied to clipboard") }}>{peerId}</div>
            {remoteConnectionSuccessful && <>
                <input type="text" onKeyUp={(event)=>{setChatInput(event.target.value); if(event.key === "Enter"){sendMessage(chatInput) }}} onChange={(event)=>{setChatInput(event.target.value)}} value={chatInput}/>
                <button onClick={(event)=>{sendMessage(chatInput)}}>send chat</button>
            </>}
            <hr />
            <div className="visual-log">{visualLog.map(({message, time, owner, received}, index) => 
                <div key={index}>
                    {time} - {owner}<br/>
                    {message} <br/>
                    {received == true && <div>Received.</div>}{ received == false &&  <div>pending receipt</div>}<br />
                </div> 
            )}</div>

        </>
    )
}


// below is old code that doesn't use peerjs that i'm not yet willing to scrap
    // async function fetchCustom(method = 'GET', path = '/date', body = undefined) {
    //     const res = await fetch(env.backend + path, {
    //         method: method,
    //         headers: method == 'POST' ? {'Content-Type': 'application/json'} : {},
    //         body: JSON.stringify(body)
    //     })
    //     const data = await res.json()
    //     return data
    // }
    // const getAllOffers = () => fetchCustom('GET', '/offer')
    // const postOffer = (offer) => fetchCustom('POST', '/offer', offer)
    // const deleteAllOffers = () => fetchCustom('DELETE', '/offer')


    // async function generateOffer(){
    //     const rtcConfig = {
    //       iceServers: [
    //         {
    //           urls: "stun:stun.1.google.com:19302",
    //         },
    //       ],
    //     };

    //     try {
    //         // construct peer connection
    //         const pc = new RTCPeerConnection(rtcConfig);

    //         // create offer
    //         const offer = await pc.createOffer({
    //             iceRestart: true,
    //         });

    //         // set local description
    //         await pc.setLocalDescription(offer);


    //         return offer
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }