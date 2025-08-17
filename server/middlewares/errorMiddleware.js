// error middleware || next function
const errorMiddleware = (err, req, res, next)=>{
    console.log(err);
    //default error message
    const defaultError = {
        statusCode: 500,
        message: err
    }

    //missing field
    if(err.name === 'validation'){
        defaultError.statusCode = 400;
        defaultError.message = Object.values(err.errors).map(item => item.message).join(',')
    };

    //duplicate error
    if(err.code && err.code === 11000){
        defaultError.statusCode = 400;
        defaultError.message = `${Object.keys(err.keyValue)} field has to be unique`
    }

    res.status(defaultError.statusCode).json({ message: defaultError.message });
};

export default errorMiddleware;




//! 1st method
// const errorMiddleware = (err, req, res, next)=>{
//     console.log(err);
    // res.status(500).send({
    //     success: false,
    //     message: 'Something Went Wrong',
    //     err
    // });
// };

// export default errorMiddleware;