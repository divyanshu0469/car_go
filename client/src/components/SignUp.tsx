import { ChangeEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        cPassword: '',
        aadharNumber: '',
        gender: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        cPassword: '',
        aadharNumber: '',
        gender: '',
        message: '',
        success: ''
    });
    const [selectedGender, setSelectedGender] = useState('');

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value} = event.target;
        setFormData({ ...formData, [name]: value });
        setErrors({...errors, [name]: '' });
    }

    const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedGender(value);
        setFormData({...formData, gender: value});
      };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let valid = true;
        const { name, email, mobile, password, cPassword, aadharNumber, gender} = formData;
        const nameRegex = /^[a-zA-Z]+(?:\s+[a-zA-Z]+)*$/;
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        const moblieRegex = /^[+]?[0-9()-.\s]{10,10}$/;
        const aadharRegex = /^[0-9]{12,12}$/;

        if(name.trim().length === 0 || !nameRegex.test(name)) {
            setErrors(errors => ({...errors, name: 'Please provide a valid name' }) );
            valid = false;
        }
        if(!emailRegex.test(email)) {
            setErrors(errors => ({...errors, email: 'Please provide a valid email' }) );
            valid = false;
        }
        if(!moblieRegex.test(mobile)) {
            setErrors(errors => ({...errors, mobile: 'Please provide a valid mobile number' }) );
            valid = false;
        }
        if(cPassword !== password) {
            valid = false;
            setErrors(errors => ({...errors, password: 'Passwords do not match'}) );
        }
        if(password.length < 6) {
            setErrors(errors => ({...errors, password: 'Password should be atleast 6 characters'}))
        }
        
        if(!aadharRegex.test(aadharNumber)) {
            setErrors(errors => ({...errors, aadharNumber: 'Aadhar number should be a 12 digit number' }) );
            valid = false;
        }
        if(gender === '') {
            setErrors(errors => ({...errors, gender: 'Select a gender'}) );
            valid = false;
        }
        if(valid) {
            try {
                const response = await axios.post(`${import.meta.env.VITE_SERVER_ROUTE}api/auth/signup`, { name, email, mobile, password, gender, aadharNumber });
                if(response.status === 201) {
                    setErrors(errors => ({...errors, success: 'Signup successful'}));
                    setTimeout(() => {
                        navigate('/verify');
                    }, 2000);
                }
            } catch (err: unknown) {
                // console.log("Error during signup", err);
                setErrors(errors => ({...errors, message: ((err as AxiosError).response?.data?.error ?? 'an error') as string }));
            }
        }
    }

    return (
    <div className="w-full h-full p-4 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-3/4 max-lg:w-3/4 max-lg:flex-col max-sm:w-3/4 select-none h-full p-3 rounded-lg flex gap-3 justify-around items-center max:md:flex-col bg-white text-darkBlue text-lg font-semibold outline-2 outline">
            <div className="flex justify-center flex-col items-center">
                <h1 className="font-extrabold text-5xl mt-6 mb-12 px-6 text-center max-sm:text-3xl">Sign Up</h1>
                <p className="max-sm:text-sm text-center">Already have an account ? <Link to="/login" className="text-lightBlue underline">Login</Link></p>
            </div>
            <div className="flex flex-col max-lg:w-full justify-center items-center w-1/2 h-full gap-3 py-4">
                <input required onChange={handleInputChange} value={formData.name} name="name" type="text" id="name" placeholder="Name" className="text-black focus:outline-none hover:bg-gray-200 text-left rounded-md h-6 py-5 px-3 w-1/2 max-md:w-2/3"/>
                {errors.name && <p className="text-red-600 text-xs">{errors.name}</p>}
                <input required onChange={handleInputChange} value={formData.email} name="email" type="email" id="email" placeholder="Email" className="text-black focus:outline-none hover:bg-gray-200 text-left rounded-md h-6 py-5 px-3 w-1/2 max-md:w-2/3"/>
                {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
                <input required onChange={handleInputChange} value={formData.mobile} name="mobile" type="phone" id="mobile" placeholder="Mobile" className="text-black focus:outline-none hover:bg-gray-200 text-left rounded-md h-6 py-5 px-3 w-1/2 max-md:w-2/3"/>
                {errors.mobile && <p className="text-red-600 text-xs">{errors.mobile}</p>}
                <input required onChange={handleInputChange} value={formData.password} name="password" type="password" id="password" placeholder="Password" className="text-black focus:outline-none hover:bg-gray-200 text-left rounded-md h-6 py-5 px-3 w-1/2 max-md:w-2/3"/>
                <input required onChange={handleInputChange} value={formData.cPassword} name="cPassword" type="text" id="cPassword" placeholder="Confirm Password" className="text-black focus:outline-none hover:bg-gray-200 text-left rounded-md h-6 py-5 px-3 w-1/2 max-md:w-2/3"/>
                {errors.password && <p className="text-red-600 text-xs">{errors.password}</p>}
                <input required onChange={handleInputChange} value={formData.aadharNumber} name="aadharNumber" type="phone" id="aadharNumber" placeholder="Enter Aadhar Number" className="text-black focus:outline-none hover:bg-gray-200 appearance-none text-left rounded-md h-6 py-5 px-3 w-1/2 max-md:w-2/3"/>
                {errors.aadharNumber && <p className="text-red-600 text-xs">{errors.aadharNumber}</p>}
                <div>
                    <label htmlFor="gender">Gender: </label>
                    <select required id="gender" onChange={handleGenderChange} value={selectedGender} className="bg-white focus:outline-none hover:bg-gray-200 text-black rounder-lg">
                        <option value=""></option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                {errors.message && <p className="text-red-600 text-md">{errors.message}</p>}
                {errors.success && <p className="text-green-600 text-md">{errors.success}</p>}
                <button type="submit" className="bg-lightBlue text-white rounded-md px-3  w-1/3 hover:opacity-85 hover:scale-105 max-md:w-2/3 mt-4 py-2">Submit</button>
                
            </div>
        </form>
    </div>
    )
}

export default SignUp