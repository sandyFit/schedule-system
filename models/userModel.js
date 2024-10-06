import pool from '../config/database.js';
import bcrypt from 'bcrypt';

// Function to register a new user
export const registerUser = async (req, res) => {
    const { username, email, password, user_type } = req.body; // Ensure username is included

    try {
        // Check if the user already exists
        const existingUserQuery = 'SELECT * FROM users WHERE email = $1';
        const existingUserResult = await pool.query(existingUserQuery, [email]);

        if (existingUserResult.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new user into the database
        const insertUserQuery = 'INSERT INTO users (username, email, password, user_type) VALUES ($1, $2, $3, $4) RETURNING *';
        const newUserResult = await pool.query(insertUserQuery, [username, email, hashedPassword, user_type]);

        // Respond with the new user data
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUserResult.rows[0]
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ success: false, message: 'Error registering user' });
    }
};

// Function to find a user by email
export const findUserByEmail = async (email) => {
    try {
        const userQuery = 'SELECT * FROM users WHERE email = $1';
        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            return { success: false, message: 'User not found' };
        }

        return { success: true, user: userResult.rows[0] };
    } catch (err) {
        console.error('Error finding user by email:', err.stack);
        return { success: false, message: 'Error finding user' };
    }
};

// Function to verify user password
export const verifyUserPassword = async (email, password) => {
    try {
        // Find user by email
        const userResult = await findUserByEmail(email);
        if (!userResult.success) {
            return { success: false, message: 'User not found' };
        }

        const user = userResult.user;

        // Compare password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { success: false, message: 'Invalid password' };
        }

        return { success: true, message: 'Password verified', user };
    } catch (err) {
        console.error('Error verifying user password:', err.stack);
        return { success: false, message: 'Error verifying password' };
    }
};
