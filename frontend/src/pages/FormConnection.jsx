// package imports
import { useEffect, useState, useRef } from 'react'
import { Link } from "react-router-dom"
import Peer, { SerializationType } from 'peerjs'

// component imports
import ThemeButtons from '../components/ThemeButtons'

// script imports
import { env } from '../assets/js/determineEnvironment.mjs'
import { getPeers, getLobbies, joinLobby, createLobby, leaveLobby, deleteLobby } from '../assets/js/customFetch'
import stringMatch from '../assets/js/stringMatch'

// style imports
import '../assets/styles/form-connections.css'

export default function FormConnection() {

    const [currentLobby, setCurrentLobby] = useState(null)
    const [lobbyList, setLobbyList] = useState([])
    
    const [clientObject, setClientObject] = useState(null)
    const clientObjectRef = useRef({})
    clientObjectRef.current = clientObject
    const [clientConnectionObject, setClientConnectionObject] = useState(null)

    const [connectionProcessing, setConnectionProcessing] = useState(false)

    // peer list
    const [peerList, setPeerList] = useState([])
    const [lobbyQuery, setLobbyQuery] = useState('')

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
        console.log(notification)
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
        // console.log(peers, peerList);
        if(peers.toString() !== peerList.toString()){
            console.log('updating peerlist')
            setPeerList(peers)
        }
        return peers
    }
    async function checkIfIdTaken(id) {
        const peers = await getAndSetPeerList()
        if(peers.includes(id)){
            console.log(id, " is already taken.")
            clientIdInputRef.current.setCustomValidity('That identity is already taken. Choose a different one')
            const oldPlaceholder = clientIdInputRef.current.placeholder
            clientIdInputRef.current.placeholder = id + ' taken'
            setTimeout(() => { clientIdInputRef.current.placeholder = oldPlaceholder}, 1500);
            clientIdInputRef.current.classList.add('invalid')
            return true
        } else {
            clientIdInputRef.current.setCustomValidity('')
            clientIdInputRef.current.classList.remove('invalid')
            return false
        }
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
        if(currentLobby){
            setCurrentLobby(null)
        }
        setLobbyQuery('')
        localStorage.removeItem('clientId')
    }


    function addToConnectedPeerList(id, connection){
        if(!connectedPeers.includes({id: id, connection: connection})){
            setConnectedPeers([...connectedPeers, {id: id, connection: connection}])
        }
    }
    function removeFromConnectedPeerList(id){
        setConnectedPeers(connectedPeers.filter(peerEntry => peerEntry.id !== id))
    }

    // wake up all the states by initializing client and storing it
    async function validateIdAndStoreClient(id) {
        resetClient()
        let client
        if(await checkIfIdTaken(id)){
            clientIdInputRef.current.value = localStorage.getItem('clientId')
            return
        }
        client = new Peer(id, env.clientPeerSettings)
        console.log(client.options.token)
        client.on('error', (error) => {
            console.log(error)
            console.log(error.type)
            if(error.type == 'network' || error.type == 'socket-closed' || error.type == 'socket-error'){
                setClientObject(null)
                setClientId(null)
            }
        })
        client.on('open', () => {
            console.log('client open event')
            getAndSetPeerList()
        })
        client.on('connection', (connection) => {
            setConnectionProcessing(true)
            console.log('client connection event (probably remote initiator)')
            connection.on('open', () => {
                console.log('client connection OPEN event (probably remote initiator)')
                setConnectionProcessing(false)
            })
            connection.on('data', (data) => { //receiving
                getAndSetPeerList()
                console.log('data: ', data)
            })
            connection.on('close', () => {
                console.log('remote? maybe client close')
                setConnectionProcessing(false)
            })
            connection.on('error', (error) => {
                console.log(error)
                setConnectionProcessing(false)
            })
        })

        setClientObject(client)
        setClientId(id)
        localStorage.setItem('clientId', id)
        // console.log(client)
        return client
    }


    async function getAndSetLobbies(){
        setConnectionProcessing(true)
        const lobbies = await getLobbies()
        setConnectionProcessing(false)
        console.log(lobbies)
        setLobbyList(lobbies)
        const lobby = lobbies.find(lobby => lobby.lobbyId === currentLobby?.lobbyId)
        if(currentLobby && !lobby){
            setCurrentLobby(null)
        } else if (lobby) {
            console.log('during the course of getAndSetLobbies, a lobby was found with id: ', lobby.lobbyId)
            if(lobby.playerList.find(player => player.playerId === clientId)){
                console.log('and it was found to have the client as a player. setting it as current lobby')
                setCurrentLobby(lobby)
            }
        }

        return lobbies
    }
    useEffect(() => {
        //useeffect on render
        console.log('useEffect on render')
        
        getAndSetLobbies()
        getAndSetPeerList()
        if(localStorage.getItem('clientId')){
            validateIdAndStoreClient(localStorage.getItem('clientId'))
        }
    }, [])

    let idSpanRef = useRef(null);
    useEffect(() => {
        if(idSpanRef.current){
            if(clientId.length > 10){  // 9, 9.6 - 10, 8.6 - 11, 7.9 - 12, 7.2 - 13, 6.7 - 14, 6.2 - 15, 5.8 - 16, 5.4 - 17 - 5.1 || 84.9x^-0.992
                let size = 118 * clientId.length ** -1.01 // 11, 10.4 - 12, 9.5 - 13, 8.8 - 14, 8.1 - 15, 7.6 - 16, 7.1 - 17, 6.7  || 118x^-1.01
                idSpanRef.current.style.fontSize = `min(${size}vw, ${size}vh)`
                idSpanRef.current.style.lineHeight = `min(${size}vw, ${size}vh)`
            }
        }
    }, [clientId])

    useEffect(() => {
        console.log('clientObject', clientObject)
        console.log('clientId', clientId)
    }, [clientObject, clientId])
    useEffect(() => {
        console.log('currentLobby', currentLobby)
    }, [currentLobby])

    async function handleLeaveLobby(){
        setConnectionProcessing(true)
        await leaveLobby(currentLobby.lobbyId, clientId, clientObject.options.token)
        setConnectionProcessing(false)
        setCurrentLobby(null)
        getAndSetLobbies()
        // setClientId(null)
    }
    async function handleDeleteLobby(){
        console.log(currentLobby.lobbyId, clientId, clientObject.options.token)
        setConnectionProcessing(true)
        const response = await deleteLobby(currentLobby.lobbyId, clientId, clientObject.options.token);
        console.log(response)
        setConnectionProcessing(false)
        setCurrentLobby(null)
        getAndSetLobbies()
    }
    async function handleJoinLobby(event, lobby){
        setConnectionProcessing(true)
        const response = await joinLobby(lobby.lobbyId, clientId, clientObject.options.token);
        console.log(response)
        setConnectionProcessing(false)
        if(response.joined != true){
            notifyOnTarget(response.message, event.target, 100, 10); return
        } else {
            setCurrentLobby(response.lobby)
            getAndSetLobbies()
        }
    }
    async function handleCreateLobby(event){
        event.preventDefault()
        setConnectionProcessing(true)
        let response = await createLobby(event.target.children[0].value, clientId, clientObject.options.token)
        setConnectionProcessing(false)
        console.log(response);
        if(!response.joined){notifyOnTarget(response.message, event.target, 100, 10); return};
        setCurrentLobby(response)
    }

    async function handleStartGame(event){
        event.preventDefault()
    }

    function filterLobbyList(lobby) { // return true or false on each lobby
        if(stringMatch(lobby.lobbyId, lobbyQuery)){
            return true
        }
        if(lobby.playerIds.some(playerId => stringMatch(playerId, lobbyQuery))){
            return true
        }
        return false
    }
    


    return (
        <>  
            <ThemeButtons />
            <div className="center-wrapper form-connection">
            <Link to={".."} className='clickable'>GO BACK</Link>
                {!clientId 
                ?
                    <>
                        <h1 className='digital-dream'>IDENTIFY YOURSELF</h1>
                        <form onSubmit={(event) => {event.preventDefault(); validateIdAndStoreClient(event.target.children[0].value)}}>
                            <input placeholder='input identity' ref={clientIdInputRef} onChange={validateInput} type="text" name="clientId" id="clientId" />
                            <input type="submit" value="submit" />
                        </form>
                    </>
                :
                    <>
                        <h1 className='digital-dream'>HUMAN IDENTIFIED</h1>
                        <h1 className='identity-and-buttons flex-row justify-space-between'>
                            <div className='identity'>[<div ref={idSpanRef}>{clientId}</div>]</div>
                            <div className='flex-column justify-end'>
                                <button className='clickable dark nowrap' onClick={resetClient}>reset identity</button>
                                <button className='clickable dark' onClick={getAndSetLobbies}>refresh</button>
                            </div>
                        </h1>

                        {!currentLobby ?<>
                            <h2 className="digital-dream">Create Lobby</h2>
                            <form onSubmit={handleCreateLobby}>
                                <input placeholder='Lobby ID' onChange={validateInput} type="text" name="lobbyId" id="lobbyId" className='create-lobby-input'/>
                                <input className='create-lobby-button' type="submit" value="+" />
                            </form>

                            <h2 className='digital-dream'>Join Lobby</h2>
                            <input type="text" name="peerQuery" id="peerQuery" placeholder={'filter lobbies or players'} onChange={(event)=>{setLobbyQuery(event.target.value)}}/>
                            <ul className={connectionProcessing ? 'no-access' : ''}>{lobbyList.filter(filterLobbyList).map((lobby)  => {return (
                                <li
                                    key={lobby.lobbyId} 
                                    className={`clickable`} 
                                    onClick={(event)=>handleJoinLobby(event, lobby)}
                                    lobby={lobby}
                                >Lobby: {lobby.lobbyId}
                                    <ul>{lobby.playerList.map((playerEntry) => <li key={playerEntry.playerId} className={playerEntry.owner ? 'owner' : ''}>{playerEntry.playerId}</li>) }</ul>
                                </li>
                            )})}</ul>
                        </> : <>
                            <h2 className="digital-dream">Lobby ID: <em className="three">{currentLobby.lobbyId}</em></h2>
                            <h2 className="digital-dream">Current Players:</h2>
                            <ul>{currentLobby?.playerList.map((playerEntry) => <li key={playerEntry.playerId} className={playerEntry.owner ? 'owner' : ''}>{playerEntry.owner ? 'Owner: ' : ''}{playerEntry.playerId}</li>) }</ul>
                            <div className='flex-row justify-space-between'>
                                {currentLobby?.playerList.some((playerEntry) => playerEntry.owner && playerEntry.playerId === clientId) ?
                                <>
                                    <button className='clickable dark' onClick={handleStartGame}>Start</button>
                                    <button className='clickable dark' onClick={handleLeaveLobby}>Leave (Delete)</button> 
                                </>: <>
                                    <button className='clickable dark' onClick={handleLeaveLobby}>Leave</button> 
                                </>}
                            </div>
                            
                            
                        </>}

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