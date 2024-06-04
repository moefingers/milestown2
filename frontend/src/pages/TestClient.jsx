import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"

import { Peer } from 'peerjs'

import { env } from '../assets/js/determineEnvironment.mjs'

import '../assets/styles/_testing.css'

import { getPeers } from "../assets/js/customFetch"

export default function TestClient() {

    useEffect(() => {
        retrievePeers()
    }, [])

    const [peerList, setPeerList] = useState([])

    const [clientId, setClientId] = useState('')

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

    async function retrievePeers(event){

        setPeerList(await getPeers())

    }


    async function checkIfIdTaken(id) {
        const peers = await getPeers()
        if(peers.includes(id)){
            console.log(id, " is already taken.")
            return true
        }
        return false
    }

    async function constructAndRegisterPeer(setConnectionState, setConnectionObject, handleDataReception, oldConnection=null){
        // IMPORTANT: we can set a custom id by saying Peer(id, options) // https://peerjs.com/docs/
        // let peer = new Peer(env.clientPeerSettings)
        if(await checkIfIdTaken(clientId)){return}
        console.log(oldConnection)
        if(oldConnection){
            console.log("dumping old connection")
            oldConnection.destroy()
            setConnectionObject(null)
            setConnectionState(null)
        }
        let peer = new Peer(clientId,env.clientPeerSettings)
        

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
            console.log('remoteConnection open')

            sendMessage(`Connected.`, true, remoteConnection)
            setConnectionState(true)
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

    }

    // DEPENDENCIES in parent context for following function
    // logRef
    // connectionRef, if using default
    // setVisualLog
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
            <h1 className="test-client-title">test client</h1>
            <Link to={".."}>go back</Link>

            {/* <button onClick={async (event)=>{await postOffer(await generateOffer()); setDevResponse(await getAllOffers())}}>post offer to server</button>

            <button onClick={async (event)=>{await deleteAllOffers(); setDevResponse(await getAllOffers())}}>delete all offers</button>

            <button onClick={async (event)=>{setDevResponse(await getAllOffers())}}>get all offers</button> */}

            <input type="text" placeholder="optional custom id for you" onChange={(event)=>{setClientId(event.target.value)}} value={clientId}/>
            <button onClick={async (event)=>{setPeer(await constructAndRegisterPeer(setRemoteConnectionSuccessful, setCurrentConnection, handleDataReception, peer));retrievePeers(event);}} >register with peerserver</button>
            {peer && <>
                <input type="text"  placeholder="peer id (them)" onChange={(event)=>{setPeerIdInput(event.target.value)}} value={peerIdInput}/>
                <button onClick={(event)=>{setCurrentConnection(connectToPeer(peer, peerIdInput, setRemoteConnectionSuccessful, handleDataReception, sendMessage))}}> connect to peer</button>
            </>}
            {peerId && <div className="clickable" onClick={(event)=> {navigator.clipboard.writeText(peerId); console.log("copied to clipboard") }}>copy to clipboard my id:{peerId}</div>}
            
            {peerList.length > 0 && peerId && 
            <div>
                <h2>peer list</h2>
                <button className="clickable" onClick={(event)=>{retrievePeers(event)}}>refresh peer list</button>
                {peerList.filter((peer)=>peer !== peerId).map((remotePeerId, index) => <div className="clickable" onClick={(event)=>{setCurrentConnection(connectToPeer(peer, remotePeerId, setRemoteConnectionSuccessful, handleDataReception, sendMessage))}} key={index}>connect to:{remotePeerId}</div>)}
            </div>}
            <hr />
            {remoteConnectionSuccessful && <>
                {/* <input type="text" placeholder="chat input" onKeyUp={(event)=>{setChatInput(event.target.value); if(event.key === "Enter"){sendMessage(chatInput) }}} onChange={(event)=>{setChatInput(event.target.value)}} value={chatInput}/> */}
                <form onSubmit={(event) => {event.preventDefault(); sendMessage(event.target.children[0].value)}}>
                    <input type="text" name="clientId" id="clientId" />
                    <input type="submit" value="submit" />
                </form>
                {/* <button onClick={(event)=>{sendMessage(chatInput)}}>send chat</button> */}
            </>}
            
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