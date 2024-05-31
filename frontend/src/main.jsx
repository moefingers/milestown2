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
import { env } from './determineEnvironment.mjs'

import App from './App.jsx'
import Error from './pages/Error.jsx'
import TestClient from './pages/TestClient.jsx';


//////////////////////
//// REACT ROUTER ////
//////////////////////
const indexPath = window.location.hostname === "moefingers.github.io" ? "milestown2" : "/"
const router = createBrowserRouter([
  {
    path: indexPath,
    children: [
      {
        index: true,
        element: <App />,
        errorElement: <Error />
      },
      {
        path: indexPath + "/TestClient",
        element: <TestClient />
      }
    ]
  }
]);

//////////////////////////
//// REACT DOM SETUP, ////
////   STRICT MODE,   ////
////     ROUTER       ////
//////////////////////////
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)


//////////////////////
//// DEVELOPMENT  ////
//////////////////////
console.log(window.location.hostname)
console.log(env)