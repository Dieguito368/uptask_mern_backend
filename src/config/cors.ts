import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
    origin: (origin, callback) => {
        let whiteList = [ process.env.FRONTEND_URL ]

        if(process.argv[2] === '--api') {
            whiteList.push(undefined)
        }

        if(whiteList.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Error de CORS'));
        }
    }
}