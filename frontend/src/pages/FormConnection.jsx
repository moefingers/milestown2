import { useEffect, useState } from 'react'

import { Link } from "react-router-dom"

import ThemeButtons from '../components/ThemeButtons'

import '../assets/styles/form-connections.css'

export default function FormConnection() {
    const [clientId, setClientId] = useState(localStorage.getItem('clientId'))


    function storeClientId(id) {
        localStorage.setItem('clientId', id)
        setClientId(id)
    }
    function clearClientId() {
        localStorage.removeItem('clientId')
        setClientId(null)
    }

    function validateInput(event){
        const regex = /^[a-zA-Z0-9]+[\w-]*[a-zA-Z0-9]+$/;
        if (!regex.test(event.target.value)) {
            event.target.classList.add('invalid');
            event.target.setCustomValidity('ID must start and end with an alphanumeric character and can contain spaces, dashes, and underscores.');
        } else {
            event.target.setCustomValidity('');
            event.target.classList.remove('invalid');
        }
    }

    return (
        <>  
            <ThemeButtons />
            <Link to={".."}>go back</Link>
            <h1>FormConnection.jsx</h1>
            {!clientId 
            ?
                <div>
                    <h1>IDENTIFY YOURSELF</h1>
                    <form onSubmit={(event) => {event.preventDefault(); storeClientId(event.target.children[0].value)}}>
                        <input onChange={validateInput} type="text" name="clientId" id="clientId" />
                        <input type="submit" value="submit" />
                    </form>
                </div>
            : 
                <div>
                    <h1>HUMAN IDENTIFIED: <span>{clientId}</span></h1>
                    <button  className='clickable' onClick={() => clearClientId()}>clear id</button>
                </div>
            }
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