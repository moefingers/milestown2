import { useEffect, useState } from 'react'

import { Link } from "react-router-dom"



import { env } from '../assets/js/determineEnvironment.mjs'// This determines the index path.. On github pages, it's "/milestown2" whereas on localhost or Render.com it's "/"

import ThemeButtons from '../components/ThemeButtons'
import SplashTitle from '../components/SplashTitle'

import '../assets/styles/landing.css'


export default function Landing() {





  return ( // returning an empty set of <> means the parent will adopt its children
    <> 

      <ThemeButtons/>

      <div className="center-wrapper">
        <SplashTitle/>
        <div className="landing-options">
          <Link to={"TestClient"} className='clickable'>test p2p chat</Link>
          <Link to={"TestMaps"} className='clickable'>test maps</Link>
          <Link to={"FormConnection"} className='clickable'>connect</Link>
        </div>
      </div>
      
    </>
  )
}