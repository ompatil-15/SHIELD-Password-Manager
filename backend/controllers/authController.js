import User from '../models/Users.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ email }).exec()

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = password === foundUser.password;

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "id": foundUser._id,
                "email": foundUser.email,
            }
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "email": foundUser.email },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing email and roles 
    res.json({ accessToken })
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ email: decoded.email }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": foundUser.email,
                        "id": foundUser._id
                    }
                },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        })
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { 
        fullName = '', 
        email = '', 
        password = '', 
        phone = '', 
        address = '', 
        dob = '', 
        pan = '', 
        aadhaar = '', 
        passport = '' 
    } = req.body;
    
    if(!fullName || !email || !password){
        return res.status(400).json({ message: 'All fields are required' });
    }

    //lean strips extra mongoos methods
    //exec to get back a promise when you pass in value not need when no valeus passed like find()
    const duplicate = await User.findOne({ email }).lean().exec();

    if(duplicate) {
        return res.status(409).json({ message: 'Email already exists'});
    }

    // const encryptedPassword = encrypt(password);

    const userObject = { fullName, email, password, phone, dob, address, pan, aadhaar, passport}

    const user = await User.create(userObject);

    if(user) {
        res.status(201).json({ message: `New user ${email} created`});
    } else {
        res.status(400).json({ message: 'Error while creating user'});
    }
})

export {
    login,
    refresh,
    logout,
    createNewUser
};