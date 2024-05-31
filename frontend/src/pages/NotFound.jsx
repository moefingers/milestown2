export default function NotFound() {
    return (
        <>
            <h1>something has gone HORRIBLY wrong 404 style</h1>
            <p>Please provide the following to the developers.</p>
            <p>{window.location.pathname + " " + window.location.hash}</p>
            <p>{window.location.toString()}</p>
        </>
    )
}