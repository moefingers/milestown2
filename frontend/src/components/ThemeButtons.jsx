import { useState } from 'react'

import '../assets/styles/theme-buttons.css'
import themes from '../assets/js/themes'

export default function ThemeButtons({hidden = false}) {
    const [themeState, setThemeState] = useState(0)
    function applyTheme(themeToApply) {
        console.log("applying theme: ", themeToApply)
        localStorage.setItem('Theme', themeToApply)
        setThemeState(themeToApply)
        document.body.className = themeToApply
    }
    function toggleLights(event) {
        if(localStorage.getItem('Theme') == 'black-on-white') {
            applyTheme('two-shades-of-gray')
        } else {
            applyTheme('black-on-white')
        }
    }

    if(themeState != localStorage.getItem('Theme')){
        applyTheme(localStorage.getItem('Theme') || 'black-on-white')
    }
    

    return (
        <>
        <div className={`theme-buttons${hidden ? ' hidden' : ''}`}>
            <button className="light-switch" onClick={toggleLights}>💡</button>
            <div className='custom-picker'>
                <div className="list">
                    {themes.map((theme, index) => <button className="clickable" key={index} onClick={() => applyTheme(theme.class)}>{theme.name}</button>)}
                </div>
                
                <button className='button'>🎨</button>
            </div>
        </div>
        </>
    )
}