function Validation(values){
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    
    if(values.email === ""){
        error.email='Email is required'
    }
    else if(!email_pattern.test(values.email)) { 
        error.email="Invalid Email"
    }else{
        error.email=""
    }

    if(values.password === ""){
        error.password = "Password should not be empty"
    }
    else if(!password_pattern.test(values.password)){
        error.password = "Debe de contener mayuscula, minuscula y numeros"
    }else{
        error.password = ""
    }
    return error;
}

export default Validation;