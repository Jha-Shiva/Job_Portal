import userModel from "../models/userModel.js"

export const registerController = async (req, res, next)=>{

        const {name,email,password, lastName } = req.body
        //validate
        if(!name){
            return next('name is required') //?Error middleware
        }
        if(!email){
            return next('email is required')
        }
        if(!password){
            return next('password is required and greater than 6 character')
        }

        //Checking allready registered
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return next('Email Already Registered Please Login')
        }

        //Creating new user
        const user = await userModel.create({ name, email, password, lastName })
        //token
        const token = user.createJWT()
        res.status(201).send({
            success: true,
            message: 'User Created Successfully',
            user:{
                email: user.email,
                name: user.name,
                lastName: user.lastName,
                location: user.location
            },
            token
        })
}

export const loginController = async (req, res , next)=> {
    const { email , password } = req.body;
    //validation
    if(!email || !password){
        return next('Please Provide all field')
    }

    //find user by email
    const user = await userModel.findOne({email}).select('+password')
    if(!user){
        return next('Invalid username or password')
    }

    //compare password
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return next('Invalid username or password')
    }
    //to hide password we make it undefined
    user.password = undefined

    const token = user.createJWT();
    res.status(200).json({
        success: true,
        message: 'Login Successfully',
        user,
        token
    })
}


//! Using try catch method
// export const registerController = async (req, res, next)=>{
//     try {
//         const {name,email,password, lastName } = req.body
//         //validate
//         if(!name){
//             // return res.status(400).send({success:false, message:'Please Provide name'})
//             next('name is required') //?Error middleware
//         }
//         if(!email){
//             // return res.status(400).send({success:false, message:'Please Provide email'})
//             next('email is required')
//         }
//         if(!password){
//             // return res.status(400).send({success:false, message:'Please Provide password'})
//             next('password is required and greater than 6 character')
//         }

//         //Checking allready registered
//         const existingUser = await userModel.findOne({email})
//         if(existingUser){
//             // return res.status(200).send({
//             //     success: false,
//             //     message: 'Email Already Registered Please Login'
//             // })
//             next('Email Already Registered Please Login')
//         }

//         //Creating new user
//         const user = await userModel.create({ name, email, password, lastName })
//         res.status(201).send({
//             success: true,
//             message: 'User Created Successfully',
//             user,
//         })
        
//     } catch (error) {
//         // console.log(error);
//         // res.status(400).send({
//         //     message:"Error in register controller",
//         //     success: false,
//         //     error
//         // })
//         next(error)
//     }
// }