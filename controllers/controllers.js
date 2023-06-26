const asyncHandler  = require('express-async-handler');
const User = require('../models/userModel');
const Product = require('../models/ProductModel');
const bcrypt = require('bcrypt');
const {compareSync} = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = asyncHandler( async(req, res)=>{
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
        res.status(400);
        throw new Error("All fields are required");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("user already registered");
    }
    //Hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });
    console.log(user);
    if(user){
        res.status(201).json({_id: user._id, email: user.email});
    }
});


const login = asyncHandler(async (req, res) => {
    User.findOne({email: req.body.email}).then(user => {
        if(!user){
            return res.status(401).send({
                sucess: false,
                message: 'User not found'
            })
        }
        if(!compareSync(req.body.password, user.password)){
            console.log(user.password, user.password)
            return res.status(401).send({
                sucess: false,
                message: 'The User not found'
            })
        }
        const payload = {
            email: user.email,
            id: user._id
        }

        const token = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: "1d"})

        return res.status(200).send({
            sucess: true,
            message: "login successful",
            token: "Bearer " + token
        })
    });

});

// const getUsers =async (req, res)=>{
//     const users = await User.find();
//     res.send(users);
// };


const getProducts = asyncHandler( async(req, res)=>{
    const products = await Product.find({user_id: req.user.id});
    res.send(products);
});

const addProducts = asyncHandler( async(req, res)=>{
    const { name, description, amount } = req.body;
    if(!name || !description || !amount) {
        res.status(400);
        throw new Error("All fields are required");
    }
    const newProduct = await Product.create({
        productName:name,
        productDesc:description,
        amount,
        user_id: req.user.id
    });
    console.log(newProduct);
    res.send("Product added successfully")
});

module.exports = {register, login, getProducts, addProducts};

