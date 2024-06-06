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
    <RouterProvider router={router}/>
  </React.StrictMode>,
)


//////////////////////
//// DEVELOPMENT  ////
//////////////////////
console.log("window.location.hostname: ",  window.location.hostname)
console.log("frontend env: ", env)