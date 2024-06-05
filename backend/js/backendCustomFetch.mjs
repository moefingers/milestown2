
import dotenv from 'dotenv'; // import dot env
dotenv.config(); // load .env

let backend

if(process.env.NODE_ENV !== 'production'){
    backend = 'http://localhost:3000'
}else{
    backend = 'https://milestown2.onrender.com'
}

async function customFetch(method = 'GET', path = '/date', body = undefined) {
    const res = await fetch(backend + path, {
        method: method,
        headers: method == 'POST' ? {'Content-Type': 'application/json'} : {},
        body: JSON.stringify(body)
    })
    const data = await res.json()
    return data
}

const getPeers = () => customFetch('GET', '/peerjs/peers')


export default customFetch

export {customFetch, getPeers}