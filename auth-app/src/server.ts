import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDB } from './db/config';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

const PORT = process.env.PORT;

connectToDB();

app.use('/auth', authRoutes);
app.use('/auth/user', userRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send("Api is running");
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT${PORT}`);
});