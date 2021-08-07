const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require ('bcrypt');
const shortid = require('shortid');


const signup =(req, res) =>{
    User.findOne({email: req.body.email})
    .exec(async (error, user) =>{
        
        if(user) return res.status(400).json({
            message: "Admin Already registered"
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
            userName: shortid.generate(),
            role:'admin'
        });

        console.log(_user);

        _user.save((error, data) =>{
             console.log(data);
            
            if(data){
                return res.status(201).json({
                    message: "Admin created Successfully"
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
            if(isPassword && user.role === 'admin'){
                const token = jwt.sign({_id: user._id, role:user.role}, process.env.JWT_SECRET, {expiresIn:'1d'});
                const {_id, firstName, lastName, email, role, fullName} = user;
                res.cookie('token', token, {expiresIn: '1d'});
                res.status(201).json({
                    token, 
                    user: {
                      _id,  firstName, lastName, fullName, role, email
                    }
                })
            }
        }
        else{
            return res.status(400).json({message: 'Something went wrong again!'});
        }
    });
}

const signout = (req, res) =>{
    res.clearCookie('token');
    res.status(200).json({
        message: "Signed out successfully"
    })
}


module.exports = {
    signup, signin, signout
}
