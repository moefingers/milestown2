// package imports
import { useEffect, useState, useRef } from 'react'
import { Link } from "react-router-dom"
import Peer from 'peerjs'

// component imports
import ThemeButtons from '../components/ThemeButtons'

// script imports
import { env } from '../assets/js/determineEnvironment.mjs'
import { getPeers } from '../assets/js/customFetch'
import stringMatch from '../assets/js/stringMatch'

// style imports
import '../assets/styles/form-connections.css'

export default function FormConnection() {
    
    const [clientObject, setClientObject] = useState(null)
    const [clientConnectionObject, setClientConnectionObject] = useState(null)

    const [connectionProcessing, setConnectionProcessing] = useState(false)

    // peer list
    const [peerList, setPeerList] = useState([])
    const [peerQuery, setPeerQuery] = useState('')

    const [connectedPeers, setConnectedPeers] = useState([])


    function toggleConnectionToPeer(event, Id) {
        connectedPeers.forEach((peer) => {
            if(peer.id == Id){
                console.log('id already connected', Id)
                peer.close()
                setConnectedPeers(connectedPeers.filter(peer => peer.id !== Id))
            }
        })
        
        if(connectedPeers.includes(Id)){
            // ADD CODE TO DISCONNECT PEER
        } else {
            if(connectedPeers.length >= 4){
                notifyOnTarget('already max connections',event.target, 100, 5)
                return
            }
            let peerConnection = clientObject.connect(Id)

            setConnectionProcessing(true)

            peerConnection.on('open', () => {
                console.log('connected to peer', Id)
                setConnectionProcessing(false)
                setConnectedPeers([...connectedPeers, {id: Id, connection: peerConnection}])
            })
            peerConnection.on('error', (error) => {
                console.log('error connecting to peer', Id,error)
                notifyOnTarget('error connecting to peer', event.target, 100, 5)
                setConnectionProcessing(false)
                return
            })
            peerConnection.on('close', () => {
                console.log('disconnected from peer', Id)
                setConnectionProcessing(false)
                setConnectedPeers(connectedPeers.filter(peer => peer.id !== Id))
                console.log(connectedPeers)
            })
            
        }
    }

    function notifyOnTarget(notification,target, flashDuration, iterations) {
        const originalText = target.innerHTML
            target.innerHTML = notification
            target.animate([
                { color: 'var(--negative-color)' },
                { color: 'var(--foreground-one)' },
            ], {
                duration: flashDuration,
                iterations: iterations,
                direction:"alternate"
            })
            setTimeout(() => {target.innerHTML = originalText}, flashDuration * iterations)
    }

    const clientIdInputRef = useRef(null)

    const [clientId, setClientId] = useState(localStorage.getItem('clientId'))


    async function getAndSetPeerList() {
    // Dependencies for below function:
        const peers = await getPeers()
        console.log(peers);
        if(peers.toString() !== peerList.toString()){
            setPeerList(peers)
        }
        return peers
    }
    // async function checkIfIdTaken(id) {
    // //Dependencies for function:
    // // getAndSetPeerList
    // // clearClientId
    // // clientIdInputRef
    //     const peers = await getAndSetPeerList()
    //     if(peers.includes(id)){
    //         clearClientId()
    //         clientIdInputRef?.current.classList.add('invalid')
    //         clientIdInputRef?.current.setCustomValidity('That identity is already taken. Choose a different one')
    //         console.log(id, " is already taken, wiped.")
    //         return true
    //     }
    //     return false
    // }
    async function checkIfIdTaken(id) {
        //Dependencies for function:
        // getAndSetPeerList
        // clearClientId
        // clientIdInputRef
        let client = new Peer(id,env.clientPeerSettings)
        client.on('error', (error) => {
            if(client.disconnected){
                clearClientId()
                clientIdInputRef.current?.classList.add('invalid')
                clientIdInputRef.current?.setCustomValidity('That identity is already taken. Choose a different one')
                console.log(id, " is already taken, clientId wiped.")
            }
            if(error.type == 'unavailable-id' && !client.disconnected){
                console.log('Client already connected, unavailable id, likely caused by current connection already open')
            }
        })
        return client.disconnected
        }
    async function storeClientId(id) {
    // Dependencies for function:
    // checkIfIdTaken
    // setClientId
    // Called by:
    // checkIfIdTaken
        if(await checkIfIdTaken(id)){return}
        localStorage.setItem('clientId', id)
        setClientId(id)
    }
    function clearClientId() {
    // Dependencies function:
    // setClientId
        let client = new Peer(clientId,env.clientPeerSettings)
        client.destroy()
        localStorage.removeItem('clientId')
        setClientId(null)
    }

    
    useEffect(() => {
        if (!clientId) {return}
        console.log("clientId: ", clientId)
        async function asynchronouslyValidateIdAndConstructAndRegisterPeer() {
            // check if id taken, clears if so
            if(await checkIfIdTaken(clientId) || !clientId){return}
            // construct peer if clientid present and not taken
            const client = new Peer(clientId,env.clientPeerSettings)
            console.log(client)
            setClientObject(client)

            client.on('error', (error) => {
                console.log(error)
                client.destroy()
                setClientObject(null)
            })
        }
        asynchronouslyValidateIdAndConstructAndRegisterPeer()
    }, [clientId])

    function validateInput(event){
        const regex = /^[a-zA-Z0-9][a-zA-Z0-9_\- ]*[a-zA-Z0-9]$/;
        if (!regex.test(event.target.value)) {
            event.target.classList.add('invalid');
            event.target.setCustomValidity('The ID must start and end with an alphanumeric character (lower or upper case character or a digit). In the middle of the ID spaces, dashes (-) and underscores (_) are allowed.');
        } else {
            event.target.setCustomValidity('');
            event.target.classList.remove('invalid');
        }
    }
    

    async function constructAndRegisterPeer( setConnectionObject, handleDataReception, oldConnection=null){
        // IMPORTANT: we can set a custom id by saying Peer(id, options) // https://peerjs.com/docs/
        // let peer = new Peer(env.clientPeerSettings)
        if(await checkIfIdTaken(clientId)){return}
        if(oldConnection){
            console.log(oldConnection)
            console.log("dumping old connection")
            oldConnection.disconnect()
            setConnectedClientConnection(null)
        }

        let peer = new Peer(clientId,env.clientPeerSettings)
        // peer.on('open', (id) => {
        //     console.log('connection open with id: ' + id);
        //     setConnectedClientId(id)
        // });
        // peer.on('error', (error) => {
        //     console.log(error)
        //     setConnectedClientError(error)
        // });
        // peer.on('connection', (connection) => {
        //     connection.on('data', handleDataReception)

        //     console.log('remotely initiated connection')
        //     setConnectedClientConnection(connection)
        // })
        // peer.on('close', () => {
        //     console.log('peer closed')
        //     setConnectedClientConnection(null)
        // })
        return peer
    }

    return (
        <>  
            <ThemeButtons />
            <Link to={".."}>go back</Link>
            <h1>FormConnection.jsx</h1>
            <div className="center-wrapper form-connection">
                {!clientId 
                ?
                    <>
                        <h1 className='digital-dream'>IDENTIFY YOURSELF</h1>
                        <form onSubmit={(event) => {event.preventDefault(); storeClientId(event.target.children[0].value)}}>
                            <input ref={clientIdInputRef}onChange={validateInput} type="text" name="clientId" id="clientId" />
                            <input type="submit" value="submit" />
                        </form>
                    </>
                :
                    <>
                        <h1 className='digital-dream'>HUMAN IDENTIFIED:</h1>
                        <h1>[<span>{clientId}</span>]<button className='clickable dark' onClick={() => clearClientId()}>reset identity</button></h1>
                        <div className='digital-dream'>choose adversary<button className='clickable dark' onClick={getAndSetPeerList}>refresh list</button></div>
                        <input type="text" name="peerQuery" id="peerQuery" onChange={(event)=>{setPeerQuery(event.target.value)}}/>
                        <ul>{peerList.filter((peerId) => (connectedPeers.includes(peerId) || peerId !== clientId && stringMatch(peerId, peerQuery))).map((peerId) => { return (
                            <li
                                key={peerId} 
                                className={`clickable ${connectedPeers.includes(peerId) ? 'connected' : ''}`} 
                                onClick={(event)=>{toggleConnectionToPeer(event, peerId)}}
                            >{peerId}</li>
                        )})}</ul>
                    </>
                }
            </div>
        </>
    )
}

/*
ideas

make connection with instructions

set id?

show new map, blur it, and unblur it once the map change is confirmed received by recipient

add a button to full map list,
map list would open and be a modal
but it would close when you pick a map or have back button


*/