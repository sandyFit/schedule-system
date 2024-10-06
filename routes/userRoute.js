import express from 'express';
import { registerUser, verifyUserPassword } from '../models/userModel.js';

const router = express.Router();

// User registration route
router.post('/register', async (req, res) => {
    console.log('Request Body:', req.body); // Log request body
    const { email, password } = req.body;

    // Check if email and password are defined
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const result = await registerUser(email, password);
    if (result.success) {
        return res.status(200).json({ success: true, message: result.message, user: result.user });
    } else {
        return res.status(400).json({ success: false, message: result.message });
    }
});


// User login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const result = await verifyUserPassword(email, password);
    if (result.success) {
        return res.status(200).json({ success: true, message: result.message, user: result.user });
    } else {
        return res.status(400).json({ success: false, message: result.message });
    }
});

export default router;
