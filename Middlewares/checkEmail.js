
import User from "../Models/user.model.js";

const checkEmail = async (req,res,next) =>{
    let foundUser = await User.findOne({email: req.body.email}).select("+password");
    if(req.url == "/register"){
        if(foundUser){
          return res.status(409).json({message: "User Already Exists"})
        }
        next();
    }else if(req.url == "/login"){
        if(foundUser){
            req.foundUser = foundUser;
            next();
        }else{
            return res.status(422).json({message: "Invalid Password or Email"})
        }
    }else{
        res.status(404).json({message: "Not Found"})
    }
}

export default checkEmail;