import { useEffect, useState } from 'react'

import { useInterval} from 'usehooks-ts'

import '../assets/styles/countdown.css'


export default function CountDown({initialCount}) {
    const [count, setCount] = useState(initialCount)



    useInterval(() => {
        if(count <= .1){
            setCount(0)
        } else {
            setCount(count => (count - 0.1).toFixed(1))
        }
    }, count > 0 ? 100 : null)

    useEffect(() => {
        setCount(initialCount)
    }, [initialCount])


    return (
        <div id="countdown">{count}</div>
    )
}