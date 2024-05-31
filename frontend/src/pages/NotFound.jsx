import { useRouteError } from "react-router-dom"

export default function NotFound() {
    const error = useRouteError()
    return (
        <>
            <h1>something has gone HORRIBLY wrong</h1>
            <p>Please provide the following to the developers.</p>
            <p>{window.location.pathname + " " + window.location.hash}</p>
            <p>{window.location.toString()}</p>

            <p>
                <i>{error.statusText}</i>
                <i>{error.message}</i>
            </p>
            
        </>
    )
}