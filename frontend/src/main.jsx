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
import App from './App.jsx'
import NotFound from './pages/NotFound.jsx'


//////////////////////
//// REACT ROUTER ////
//////////////////////
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "*",
    element: <NotFound />,
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
