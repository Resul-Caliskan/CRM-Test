import React from 'react'
import { useState } from 'react'
import axios from "axios";

import { useNavigate } from 'react-router-dom';
import { validateForm } from '../utils/formValidation';
import { setAuthToken } from "../utils/setAuthToken"
import { getMe } from '../services/getMe';
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState("");
    const [showPassword, setShowPassword] = useState("");
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    


    const handleSubmit = async (e) => {
        console.log("aaaapii "+apiUrl);
        e.preventDefault();
        const errors = validateForm(email, password)

        if (Object.keys(errors).length === 0) {

            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                    email,
                    password,
 
 
                });
                const token = response.data.accessToken
                localStorage.setItem("token", token);
                setAuthToken(token);

                const refreshToken = response.data.refreshToken;
                localStorage.setItem("refreshToken", refreshToken);
                setMessage(response.data.accessToken);
                console.log("token " + response.data.accessToken);

                const responseMe = getMe();
                responseMe.then(data => {
                    console.log("cevap:", data);
                    dispatch(login(data.user));
                    if (data.user.role ==='admin') {
                        navigate('/adminhome');
                        console.log("if "+data.user.role);
                    }
                    else {
                        navigate('/home');
                        console.log("else "+data.user.role);
                    }
                });

            } catch (error) {
                console.error(error.response.data.message);
                setErrors({ login: error.response.data.message });
            }

        }
        else {
            setErrors(errors);
            console.log(errors);
        }

    };
    return (
        <div className='grid cols-1'>
            <div className='flex flex-col justify-center items-center h-screen  bg-gray-100'>
                <form onSubmit={handleSubmit} className='max-w-[400px] w-full  mx-auto bg-white p-4 border-1 shadow-lg'>
                    <h2 className='text-4xl font-bold text-center my-6'>LOG IN</h2>
                    <div className='flex flex-col py-2'>
                        <label>E-mail</label>
                        <input value={email} className={`border p-2 ${errors.email ? 'border-red-500' : ''}`} type='text' onChange={(e) => setEmail(e.target.value)}></input>
                        {errors.email && <p className="text-red-500">{errors.email}</p>}
                    </div>
                    <div className='flex flex-col py-2'>
                        <div className='relative'>
                            <label>Password</label>
                            <input value={password} className={`block w-full border p-2 ${errors.password ? 'border-red-500' : ''}`} type={showPassword ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)}></input>
                            <span className="absolute end-2.5 bottom-2.5">
                                {showPassword ? <FaEyeSlash onClick={() => setShowPassword(false)} /> : <IoEyeSharp onClick={() => setShowPassword(true)} />}
                            </span>
                        </div>
                        {errors.password && <p className="text-red-500">{errors.password}</p>}
                        {errors.login && <p className="text-red-500">{errors.login}</p>}
                    </div>
                    <button type='submit' className='border w-full my-5 p-2 bg-indigo-600  hover:bg-indigo-500 text-white'>Sign in</button>
                    <a href='/demand'><p className='text-zinc-600 underline'>Kayıt için talep oluşturunuz.</p></a>
                    {/* <p className='flex items-center'><input className='mr-2' type='checkbox'></input>Remember me</p> */}
                    {isAuthenticated && <p>{user.userRole}</p>}
                </form>
            </div>

        </div>
    )
}