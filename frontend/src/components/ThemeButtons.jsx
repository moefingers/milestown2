import { useState } from 'react'

import '../assets/styles/theme-buttons.css'
import themes from '../assets/js/themes'

export default function LightSwitch() {
    const [themeState, setThemeState] = useState(0)

    function applyTheme(themeToApply) {
        console.log("applying theme: ", themeToApply)
        localStorage.setItem('Theme', themeToApply)
        setThemeState(themeToApply)
        Object.entries(themes[themeToApply].attributes).forEach((entry) => {
            // document.documentElement.setAttribute(Object.key, attribute.value)
            // console.log(entry)
            document.documentElement.style.setProperty(entry[0], entry[1])
        })
    }
    function toggleLights(event) {
        if(localStorage.getItem('Theme') == 0){
            applyTheme(1)
        } else {
            applyTheme(0)
        }
    }

    if(themeState != localStorage.getItem('Theme')){
        applyTheme(localStorage.getItem('Theme') || 0)
    }
    

    return (
        <>
        <div className='theme-buttons'>
            <button className="light-switch" onClick={toggleLights}>💡</button>
            <div className='custom-picker'>
                <div className="list">
                    {themes.map((theme, index) => <button className="clickable" key={index} onClick={() => applyTheme(index)}>{theme.name}</button>)}
                </div>
                
                <button className='button'>🎨</button>
            </div>
        </div>
        </>
    )
}