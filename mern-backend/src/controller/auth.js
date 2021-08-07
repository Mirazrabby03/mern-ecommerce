const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require ('bcrypt');
const shortid = require('shortid');

const signup =(req, res) =>{

    User.findOne({email: req.body.email})
    .exec(async (error, user) =>{
        
        if(user) return res.status(400).json({
            message: "User Already registered"
        });

        const{
            firstName,
            lastName,
            email,
            password
        } = req.body;
        
        const hash_password = await bcrypt.hash(password, 10);

        const _user = new User({
            firstName,
            lastName,
            email,
            hash_password,
            userName: shortid.generate()
        });

        console.log(_user);

        _user.save((error, data) =>{
             console.log(data);
            
            if(data){
                return res.status(201).json({
                    message: "Registration Successful"
                });
            }
            if(error){
                return res.status(400).json({
                    message: 'Something went wrong'
                });
            }
        });

    });
}

const signin =(req, res) =>{
    User.findOne({email: req.body.email})
    .exec(async(error,user) =>{
        if(error) return res.status(400).json({error});
        if(user){
const isPassword = await user.authenticate(req.body.password);
            if(isPassword && user.role === 'user'){
                const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn:'1h'});
                const {_id, firstName, lastName, email, role, fullName} = user;
                res.status(201).json({
                    token, 
                    user: {
                      _id,  firstName, lastName, fullName, role, email
                    }
                });
            }else{
                return res.status(400).json({
                    message: 'Something went wrong!'
                })
            }
        }
        else{
            return res.status(400).json({message: 'Something went wrong again!'});
        }
    });
}



module.exports = {
    signup, signin
}

