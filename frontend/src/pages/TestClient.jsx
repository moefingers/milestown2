import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { env } from '../determineEnvironment.mjs'

export default function TestClient() {

    const[devResponse, setDevResponse] = useState(false)

    async function postOffer(offer) {
        const res = await fetch(env.backend + '/offer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(offer)
        })
        const data = await res.json()
        return data
    }

    async function offerButtonClicked(){
        console.log("useeffect")
        
        try {
            async function generateOffer() {
                const pc = new RTCPeerConnection();
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                console.log(offer)
                
                // const response = await postOffer(offerJson);
                // console.log(response)

                const res = await postOffer(offer)
                setDevResponse(res)
                // await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(response)));
                // const answer = await pc.createAnswer();
                // await pc.setLocalDescription(answer);
                // const answerJson = JSON.stringify(answer);
                // // await postOffer(answerJson); 
                // console.log(answerJson)         
            }
            generateOffer()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        

    }, [])


    return (
        <>
            <h1>test client</h1>
            <Link to={env.indexPath}>go back</Link>

            <button onClick={offerButtonClicked}>post ip, port to server</button>

            <div>{devResponse && JSON.stringify(devResponse, null, 2)}</div>
        </>
    )
}