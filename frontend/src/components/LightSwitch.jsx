

import '../assets/styles/light-switch.css'
import themes from '../assets/js/themes'

export default function LightSwitch() {


    function applyTheme(themeToApply) {
        console.log("applying theme: ", themeToApply)
        document.documentElement.style.setProperty('--background-one', themes[themeToApply].backgrounds[0])
        document.documentElement.style.setProperty('--foreground-one', themes[themeToApply].foregrounds[0])
        document.documentElement.style.setProperty('color-scheme', themes[themeToApply].colorScheme)
    }
    function toggleLights(event) {
        if(localStorage.getItem('Theme') == 1){
            localStorage.setItem('Theme', 0)
            applyTheme(0)
        } else {
            localStorage.setItem('Theme', 1)
            applyTheme(1)
        }
    }
    
    applyTheme(localStorage.getItem('Theme') || 0)
    

    return (
        <>
            <button className="light-switch" onClick={toggleLights}>💡</button>
        </>
    )
}