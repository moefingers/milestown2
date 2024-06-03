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
} from "react-router-dom";

////////////////////////////
//// COMPONENT IMPORTS /////
////////////////////////////
import { env } from './assets/js/determineEnvironment.mjs'

import App from './App.jsx'
import Error from './pages/Error.jsx'
import TestClient from './pages/TestClient.jsx';


//////////////////////
//// REACT ROUTER ////
//////////////////////
const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <App />
      },
      {
        path: "TestClient",
        element: <TestClient />
      }
    ],
  }
], {basename: env.indexPath});


//////////////////////////
//// REACT DOM SETUP, ////
////   STRICT MODE,   ////
////     ROUTER       ////
//////////////////////////
import './assets/styles/main.css'
import './assets/styles/infinity-response.css'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)


//////////////////////
//// DEVELOPMENT  ////
//////////////////////
console.log("window.location.hostname: ",  window.location.hostname)
console.log("frontend env: ", env)