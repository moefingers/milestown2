import {env} from '../../determineEnvironment.mjs'

async function customFetch(method = 'GET', path = '/date', body = undefined) {
    const res = await fetch(env.backend + path, {
        method: method,
        headers: method == 'POST' ? {'Content-Type': 'application/json'} : {},
        body: JSON.stringify(body)
    })
    const data = await res.json()
    return data
}

const getAllOffers = () => customFetch('GET', '/offer')
const postOffer = (offer) => customFetch('POST', '/offer', offer)
const deleteAllOffers = () => customFetch('DELETE', '/offer')
const getMaps = () => customFetch('GET', '/maps')
const getAesthetics = () => customFetch('GET', '/aesthetics')


export {customFetch, getAllOffers, postOffer, deleteAllOffers, getMaps, getAesthetics}