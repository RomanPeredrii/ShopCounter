import express from 'express';
import { NextFunction } from 'connect';

const PORT = process.env.PORT || 3000;
const app = express();

type HTTPparam = {
    req: Request, 
    res: Response, 
    next: NextFunction
}

app.get('/', (param: HTTPparam): void => 
//@ts-ignore

param.res.status(200).
    json({
    message: 'Running'
}));

app.listen(PORT, () => console.log(`Using ${PORT} port`))