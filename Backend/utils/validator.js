import validator from "validator";

const validateSignUpData = (req)=>{
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName){
        throw new Error("Please Enter First Name");
    }

    else if(!validator.isEmail(emailId)){
        throw new Error("Please Enter a valid email");
    }

    else if(!password || password.length<6){
        throw new Error("Please Enter a valid Password(Length must be at least 6)");
    }
}

export {validateSignUpData};