import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './LoginValidation'
import axios from "axios"

function Login(){
    const[values, setValues] = useState({
        email: '',
        password: ''

    })
    
    const navigate = useNavigate();
    const [errors, setErrors] = useState({}) 
    const handleInput = (event) => {
        setValues(prev =>({ ...prev, [event.target.name]: [event.target.value]}))
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values));
        if (errors.email === "" && errors.password === "") {
            axios.post('http://localhost:8081/login', values)
                .then(res => {
                    if (res.data.status === "Success") {
                        // Almacenar el idUsuario en el estado o donde sea necesario
                        const idUsuario = res.data.idUsuario;
                        // Navegar a la página 'home' y pasar el idUsuario
                        navigate('/home', { state: { idUsuario } });
                    } else {
                        alert("Usuario no registrado");
                    }
                })
                .catch(err => console.log(err));
        }
    }
    
    
    return(
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100 custom-bg'>
            <div className='bg-white p-3 rounded w-25'>
            <h2>Sign-in</h2>
                <form action='' onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="text" placeholder='Enter email' name='email' onChange={handleInput} className='form-control rounded-0' />
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="passwrod"><strong>Password</strong></label>
                        <input type="password" placeholder='Enter Password' name='password' onChange={handleInput} className='form-control rounded-0' />
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </div>
                    <button type='submit' className='btn btn-success w-100'>Log in</button>
                    <p></p>
                    <Link to="/signup" className='btn btn-default border w-100 bg-light text-decoration-none'>Create Account</Link>
                </form>
            </div>
        </div>
    )
}

export default Login