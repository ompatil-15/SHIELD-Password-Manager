import User from '../models/Users.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
    const { email, hash } = req.body

    if (!email || !hash) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ email }).exec()

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    // console.log('package', foundUser.encryptedPackage)

    const { encryptedPackage } = foundUser;
    const encryptedPackageBase64 = atob(encryptedPackage);
    const encryptedPackageBytes = new Uint8Array(encryptedPackageBase64.length);

    for (let i = 0; i < encryptedPackageBase64.length; i++) {
        encryptedPackageBytes[i] = encryptedPackageBase64.charCodeAt(i);
    }

    const hashBytes = encryptedPackageBytes.slice(16+12);
    const base64Hash = btoa(String.fromCharCode(...hashBytes));

    const match = hash === base64Hash;

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "id": foundUser._id,
                "email": foundUser.email,
                "encryptedPackage": foundUser.encryptedPackage
            }
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '30m' }
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
                        "id": foundUser._id,
                        "email": foundUser.email,
                        "encryptedPackage": foundUser.encryptedPackage
                    }
                },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: '30m' }
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
// @route POST /auth/new
// @access Public
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
        passport = '',
        encryptedPackage = '' 
    } = req.body;
    
    if(!fullName || !email || !encryptedPackage){
        return res.status(400).json({ message: 'All fields are required' });
    }

    //lean strips extra mongoose methods
    //exec to get back a promise when you pass in value not need when no valeus passed like find()
    const duplicate = await User.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec();

    if(duplicate) {
        return res.status(409).json({ message: 'Email already exists'});
    }

    const userObject = { fullName, email, password, phone, dob, address, pan, aadhaar, passport, encryptedPackage}

    const user = await User.create(userObject);

    if(user) {
        res.status(201).json({ message: `New user ${email} created`});
    } else {
        res.status(400).json({ message: 'Error while creating user'});
    }
})

// @desc Get user salt
// @route GET /auth
// @access Public
const getSalt = asyncHandler(async(req, res) => {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email: email }).lean();

    if(!user) {
        return res.status(400).json({message: 'User not found'});
    }

    const { encryptedPackage } = user; 

    if(!encryptedPackage) {
        return res.status(400).json({message: 'No encryption package found'});
    }
    
    const encryptedPackageBase64 = atob(encryptedPackage);
    const encryptedPackageBytes = new Uint8Array(encryptedPackageBase64.length);

    for (let i = 0; i < encryptedPackageBase64.length; i++) {
        encryptedPackageBytes[i] = encryptedPackageBase64.charCodeAt(i);
    }

    const saltBytes = encryptedPackageBytes.slice(0, 16);

    const base64Salt = btoa(String.fromCharCode(...saltBytes));

    res.json({ salt: base64Salt });
})

export {
    login,
    refresh,
    logout,
    createNewUser,
    getSalt
};