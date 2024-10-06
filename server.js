import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js'; // Ensure the path is correct

dotenv.config({ path: './config/.env' });

const app = express(); 
app.use(express.json());

// Allow CORS requests from your frontend
app.use(cors({
    origin: 'http://localhost:5173', // Replace this with your frontend's URL
}));

// Register the user routes
app.use('/api/users', userRoute); // This should correctly register the user routes

const port = process.env.PORT || 5050;

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(port, () => {
    console.log(`Server initialized at port ${port} in mode: ${process.env.NODE_ENV}`);
});
