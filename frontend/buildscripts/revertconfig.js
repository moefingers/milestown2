import { rename } from "fs/promises";

async function revertConfig() {
    try {
        await rename('../vite.config.js', '../vite.config.js.gh'); // rename current config to gh
        await rename('../vite.config.js.temp', '../vite.config.js'); // rename original config to current
    } catch (error) {
        console.log(error)
    }
}

revertConfig()