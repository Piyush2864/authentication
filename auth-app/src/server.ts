import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import { connectToDB } from './db/config';
import passport from 'passport';
import session from 'express-session';
import googleRoutes from './routes/googleRoutes';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
// app.use(session({
//     secret: process.env.SESSION_SECRET!,
//     resave: false,
//     saveUninitialized: false
// })
// );

// app.use(passport.initialize());
// app.use(passport.session());

const PORT = process.env.PORT;

connectToDB();

app.use('/auth', googleRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send("Api is running");
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT${PORT}`);
});