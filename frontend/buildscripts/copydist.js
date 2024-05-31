import { cp } from "fs/promises";

async function copyDist() {
    try {
        await cp('../dist', '../../backend/dist', { recursive: true, force: true });
    } catch (error) {
        console.log(error)
    }
}

copyDist()