import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { env } from '../determineEnvironment.mjs'

export default function TestClient() {

    const[devResponse, setDevResponse] = useState(false)

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
        try {
            // construct peer connection
            const pc = new RTCPeerConnection();

            // create offer
            const offer = await pc.createOffer();

            // set local description
            await pc.setLocalDescription(offer);


            return offer
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <h1>test client</h1>
            <Link to={".."}>go back</Link>

            <button onClick={async (event)=>{await postOffer(await generateOffer()); setDevResponse(await getAllOffers())}}>post offer to server</button>

            <button onClick={async (event)=>{await deleteAllOffers(); setDevResponse(await getAllOffers())}}>delete all offers</button>

            <button onClick={async (event)=>{setDevResponse(await getAllOffers())}}>get all offers</button>


            <div>{devResponse && JSON.stringify(devResponse, null, 2)}</div>
        </>
    )
}