import { rm } from "fs/promises";

async function deleteDist() {
    try {
        await rm('../../backend/dist', { recursive: true, force: true });
    } catch (error) {
        console.log(error)
    }
}

deleteDist()