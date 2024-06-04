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

    const clientIdInputRef = useRef(null)

    const [clientId, setClientId] = useState(null)

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
    async function getAndSetPeerList() {
    // Dependencies for below function:
        const peers = await getPeers()
        console.log(peers, peerList);
        if(peers.toString() !== peerList.toString()){
            console.log('updating peerlist')
            setPeerList(peers)
        }
        return peers
    }; getAndSetPeerList()
    async function checkIfIdTaken(id) {
        const peers = await getAndSetPeerList()
        if(peers.includes(id)){
            console.log(id, " is already taken.")
            return true
        }
        return false
    }

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
            if(!clientObject.disconnected){
                console.log('attempting to peer since client is connected to server')
                let peerConnection = clientObject.connect(Id)
                console.log(peerConnection)
            }
            
        }
    }

    async function validateIdAndStoreClient(id) {
        resetClient()
        let client
        if(await checkIfIdTaken(id)){
            notifyOnTarget('', clientIdInputRef.current, 100, 5);
            return
        }
        client = new Peer(id, env.clientPeerSettings)
        setClientObject(client)
        setClientId(id)
        localStorage.setItem('clientId', id)
        console.log(client)
        return client
    }

    async function resetClient(event) {
        console.log('clearing client')
        if(clientObject){
            clientObject.destroy()
            setClientObject(null)
        }
        if(clientId){
            setClientId(null)
        }
        localStorage.removeItem('clientId')
    }

    
    useEffect(() => {
        if(localStorage.getItem('clientId')){
            validateIdAndStoreClient(localStorage.getItem('clientId'))
        }
    }, [])


    


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
                        <form onSubmit={(event) => {event.preventDefault(); validateIdAndStoreClient(event.target.children[0].value)}}>
                            <input ref={clientIdInputRef} onChange={validateInput} type="text" name="clientId" id="clientId" />
                            <input type="submit" value="submit" />
                        </form>
                    </>
                :
                    <>
                        <h1 className='digital-dream'>HUMAN IDENTIFIED:</h1>
                        <h1>[<span>{clientId}</span>]<button className='clickable dark' onClick={resetClient}>reset identity</button></h1>
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