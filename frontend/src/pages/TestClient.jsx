import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { Peer } from 'peerjs'

import { env } from '../determineEnvironment.mjs'

export default function TestClient() {

    const[devResponse, setDevResponse] = useState(false)

    const [peer, setPeer] = useState(null)
    const [peerId, setPeerId] = useState(null)
    const[peerIdInput, setPeerIdInput] = useState('')

    async function fetchCustom(method = 'GET', path = '/date', body = undefined) {
        const res = await fetch(env.backend + path, {
            method: method,
            headers: method == 'POST' ? {'Content-Type': 'application/json'} : {},
            body: JSON.stringify(body)
        })
        const data = await res.json()
        return data
    }
    const getAllOffers = () => fetchCustom('GET', '/offer')
    const postOffer = (offer) => fetchCustom('POST', '/offer', offer)
    const deleteAllOffers = () => fetchCustom('DELETE', '/offer')


    async function generateOffer(){
        const rtcConfig = {
          iceServers: [
            {
              urls: "stun:stun.1.google.com:19302",
            },
          ],
        };

        try {
            // construct peer connection
            const pc = new RTCPeerConnection(rtcConfig);

            // create offer
            const offer = await pc.createOffer({
                iceRestart: true,
            });

            // set local description
            await pc.setLocalDescription(offer);


            return offer
        } catch (error) {
            console.log(error)
        }
    }

    async function registerWithPeerServer(){
        let peer = new Peer({
            host: '/',
            path: '/peerjs/listener',
            port: 3000
        })

        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            setPeerId(id)
        });
        peer.on('error', (error) => {
            console.log(error)
        });
        peer.on('connection', (connection) => {
            console.log('connection')
            connection.on('data', (data) => {
                console.log(data)
            })
        })

        setPeer(peer)
    }
    async function connectToPeer(peerId){
        console.log('attempting to connect to peer ' + peerId)
        let connection = peer.connect(peerId)
        connection.on('data', (data) => {
            console.log("received data: " + data)
        })
        connection.on('open', () => {
            console.log('connection open')
        })
    }


    return (
        <>
            <h1>test client</h1>
            <Link to={".."}>go back</Link>

            {/* <button onClick={async (event)=>{await postOffer(await generateOffer()); setDevResponse(await getAllOffers())}}>post offer to server</button>

            <button onClick={async (event)=>{await deleteAllOffers(); setDevResponse(await getAllOffers())}}>delete all offers</button>

            <button onClick={async (event)=>{setDevResponse(await getAllOffers())}}>get all offers</button> */}

            <button onClick={async (event)=>{registerWithPeerServer()}} >register with peerserver</button>
            {peer && <>
                <input type="text" onChange={(event)=>{setPeerIdInput(event.target.value)}} value={peerIdInput}/><button onClick={async (event)=>{connectToPeer(peerIdInput)}}> connect to peer</button>
            </>}
            <div>my id: {peerId}</div>
            


            <div>{devResponse && JSON.stringify(devResponse, null, 2)}</div>
        </>
    )
}