import { ChangeEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import { Link } from 'react-router-dom';
import { useAuthContext } from "../context/AuthContext.tsx";

const Login = () => {
    const { setAuthUser } = useAuthContext();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        message: '',
        success: ''
    });
    
    const [loading, setLoading] = useState(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value} = event.target;
        setFormData({ ...formData, [name]: value });
        setErrors({...errors, [name]: '' });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);

        e.preventDefault();

        let valid = true;
        const { email, password} = formData;
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

        if(!emailRegex.test(email)) {
            setErrors(errors => ({...errors, email: 'Please provide a valid email' }) );
            valid = false;
        }
        if(password.length < 6) {
            setErrors(errors => ({...errors, password: 'Password should be atleast 6 characters'}));
            valid = false;
        }
        if(valid) {
            try {
                const response = await axios.post(`${import.meta.env.VITE_SERVER_ROUTE}api/auth/login`, { email, password });
                if(response.status === 201) {
                    setErrors(errors => ({...errors, success: 'Login successful'}));
                    setLoading(false);

                    const data = response.data;
                    
                    localStorage.setItem('user-info', JSON.stringify(data));
                    
                    setTimeout(() => {
                        setErrors(errors => ({...errors, success: 'Login successful'}));
                        setAuthUser(data);
                        window.location.reload();
                    }, 1000);
                }
            } catch (err: unknown) {
                console.log("Error during login", err);
                setErrors(errors => ({...errors, message: ((err as AxiosError).response?.data?.error ?? 'an error') as string }));
                setTimeout(() => {
                    setErrors(errors => ({...errors, message: ''}));
                }, 1000);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
        
    }

    return (
    <div className="w-full h-3/4 p-4 font-lato flex justify-center items-center">
        <form noValidate onSubmit={handleSubmit} className="w-3/4 max-lg:w-1/2 max-sm:w-3/4 select-none h-full p-3 rounded-lg flex gap-3 max-lg:flex-col justify-around items-center bg-darkBlue text-white text-lg font-semibold outline-2 outline-double">
            <div className="flex justify-center flex-col items-center">
                <h1 className="font-extrabold text-5xl mt-6 mb-12 px-6 text-center max-sm:text-3xl">Login</h1>
                <p className="text-center">Don't Have an account ? <Link to="/signup" className="text-lightBlue underline">Sign Up</Link></p>
            </div>
            <div className="flex flex-col justify-center items-center w-1/2 max-lg:w-full h-full gap-3 py-4">
                <input required onChange={handleInputChange} value={formData.email} name="email" type="email" id="email" placeholder="Email" className="text-black text-left rounded-md h-6 py-5 px-3 w-1/2 max-md:w-2/3"/>
                {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
                <input required onChange={handleInputChange} value={formData.password} name="password" type="password" id="password" placeholder="Password" className="text-black text-left rounded-md h-6 py-5 px-3 w-1/2 max-md:w-2/3"/>
                {errors.password && <p className="text-red-600 text-xs">{errors.password}</p>}
                {errors.message && <p className="text-red-600 text-md">{errors.message}</p>}
                {errors.success && <p className="text-green-600 text-md">{errors.success}</p>}
                {!loading &&
                <button type="submit" className="bg-white text-lightBlue rounded-md px-3  w-1/3 hover:opacity-85 hover:scale-95 max-md:w-2/3 mt-4 py-2">Submit</button>
                }
                {loading &&
                <button className="bg-white text-lightBlue rounded-md px-3 w-1/3 max-md:w-2/3 mt-4 py-2">
                    <span className=" font-black">Loading...</span>
                </button>}
            </div>
        </form>
    </div>
    )
}

export default Login