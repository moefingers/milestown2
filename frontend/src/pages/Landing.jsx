import { useEffect, useState, useRef, useContext } from 'react'

import { Link } from "react-router-dom"



import { env } from '../assets/js/determineEnvironment.mjs'// This determines the index path.. On github pages, it's "/milestown2" whereas on localhost or Render.com it's "/"

import ThemeButtons from '../components/ThemeButtons'
import SplashTitle from '../components/SplashTitle'

import { ClientContext } from '../clientContext'

import '../assets/styles/landing.css'


export default function Landing() {
  const {clientObject, currentLobby} = useContext(ClientContext)




  return ( // returning an empty set of <> means the parent will adopt its children
    <> 

      <ThemeButtons/>

      <div className="center-wrapper">
        <SplashTitle/>
        <div className="landing-options">
          <Link to={"TestMaps"} className='clickable'>test maps</Link>
          <Link to={"FormConnection"} className='clickable'>{clientObject?.disconnected == false ? (currentLobby ? 'see lobby' : 'play') : 'connect'}</Link>
          
          {clientObject?.disconnected == false ? <>
            <div className='warning'>
              {currentLobby ? `You're in a lobby!` : `You're connected!`}
            </div>
          </>: <>
            
          </>}
        </div>
      </div>
      
    </>
  )
}