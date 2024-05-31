import { useRouteError, Link } from "react-router-dom"

import { env } from '../determineEnvironment.mjs'

export default function Error() {
    const error = useRouteError()
    return (
        <>
            <h1>something has gone HORRIBLY wrong</h1>
            <p>Please provide the following to the developers.</p>
            <p>{window.location.pathname + " " + window.location.hash}</p>
            <p>{window.location.toString()}</p>

            <p>
                <i>{error?.statusText}</i>
                <i>{error?.message}</i>
            </p>

            <Link to={env.indexPath}><strong>go to home</strong></Link>
            
        </>
    )
}