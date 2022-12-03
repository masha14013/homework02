import dotenv from 'dotenv'
dotenv.config()

import {runDb} from "./repositories/db";
import app from "./app";

const port = process.env.PORT || 5000


const startApp = async () => {
    await runDb()

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()