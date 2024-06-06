// keep wrapper for strict mode, also, this file has react router for spa
///////////////////////////////////
//// DEPENDENCY/MODULE IMPORTS ////
///////////////////////////////////
import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  createHashRouter,
} from "react-router-dom";

////////////////////////////
//// COMPONENT IMPORTS /////
////////////////////////////
import { env } from './assets/js/determineEnvironment.mjs'

/* Pages for routing */
import Landing from './pages/Landing.jsx'
import Error from './pages/Error.jsx'
import TestClient from './pages/TestClient.jsx';
import TestMaps from './pages/TestMaps.jsx';
import FormConnection from './pages/FormConnection.jsx';
import Network from './pages/Network.jsx';

/* Context to keep track of clientObject, clientId, currentLobby */
import  ClientContextProvider  from './clientContext'

/* Styles.. These will be applied to everything in the application.*/
import './assets/styles/main.css'
import './assets/styles/infinity-response.css'


//////////////////////
//// REACT ROUTER ////
//////////////////////
const router = createHashRouter([
  {
    path: "/",
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />
      },
      {
        path: "TestClient",
        element: <TestClient />
      },
      {
        path: "TestMaps",
        element: <TestMaps />
      },
      {
        path: "FormConnection",
        element: <FormConnection />
      },
      {
        path: "Network",
        element: <Network/>
      }
    ],
  }
], {basename: env.indexPath});


//////////////////////////
//// REACT DOM SETUP, ////
////   STRICT MODE,   ////
////     ROUTER       ////
//////////////////////////
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClientContextProvider>
      <RouterProvider router={router}/>
    </ClientContextProvider>
  </React.StrictMode>,
)


//////////////////////
//// DEVELOPMENT  ////
//////////////////////
console.log("window.location.hostname: ",  window.location.hostname)
console.log("window.location.pathname: ",  window.location.pathname)
console.log('window.location.origin: ',  window.location.origin)
console.log('window.location.hash:', window.location.hash)
console.log("frontend env: ", env)