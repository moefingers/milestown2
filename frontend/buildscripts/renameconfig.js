import { rename } from "fs/promises";

async function renameConfig() {
    try {
        await rename('../vite.config.js', '../vite.config.js.temp'); // rename current config to gh
        await rename('../vite.config.js.gh', '../vite.config.js'); // rename original config to current
    } catch (error) {
        console.log(error)
    }
}

renameConfig()