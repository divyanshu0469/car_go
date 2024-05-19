import { ChangeEvent, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";

const Password = () => {
    const {authUser} = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        og: '',
        new: '',
        cp: ''
    });
    const [errors, setErrors] = useState({
        og: '',
        new: '',
        cp: '',
        message: '',
        success: ''
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({...errors, [name]: '' });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        const { og, new: newPassword, cp } = formData;
        
        let valid = true;

        if(og.length < 6) {
            setErrors(errors => ({...errors, og: 'Password should be atleast 6 characters'}))
            valid = false;
        }

        if(newPassword.length < 6) {
            setErrors(errors => ({...errors, new: 'Password should be atleast 6 characters'}))
            valid = false;
        }

        if(cp.length < 6) {
            setErrors(errors => ({...errors, cp: 'Password should be atleast 6 characters'}))
            valid = false;
        }

        if(og === newPassword) {
            setErrors(errors => ({...errors, new: "Please enter a different password"}))
            valid = false;
        }

        if(cp !== newPassword) {
            setErrors(errors => ({...errors, cp: 'Passwords Do not match'}))
            valid = false;
        }

        if(valid) {
            try {
                const response = await axios.put(import.meta.env.VITE_SERVER_ROUTE+'api/changePass', { token: authUser.token, old: og, newPassword });
                if(response.status === 201) {
                    setErrors(errors => ({...errors, success: response.data.success}));
                    setLoading(false);
                    setTimeout(() => {
                        localStorage.removeItem('user-info');
                        window.location.reload();
                        setErrors(errors => ({...errors, success: ''}));
                    }, 2000);
                } 
            } catch (err: unknown) {
                console.log("Error during login", err);
                setErrors(errors => ({...errors, og: ((err as AxiosError).response?.data?.error ?? 'an error') as string }));
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
        
    }
  return (
    <div className="w-full h-3/4 p-4 font-lato flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-3/4 max-lg:w-1/2 max-sm:w-3/4 select-none h-full p-3 rounded-lg flex gap-3 max-lg:flex-col justify-around items-center bg-darkBlue text-white text-lg font-semibold outline-2 outline-double">
            
            <div className="flex justify-center flex-col items-center">
                <h1 className="font-extrabold text-5xl mt-6 mb-12 px-6 text-center max-sm:text-3xl">Change Password</h1>
                <p className="text-center">(User will be logged out)</p>
            </div>
            <div className="flex flex-col justify-center items-center w-1/2 max-lg:w-full h-full gap-3 py-4">
                <input required onChange={handleInputChange} value={formData.og} name="og" type="password" id="og" placeholder="Old Password" className="text-black text-left rounded-md h-6 py-5 px-3 w-1/2 max-md:w-2/3"/>
                {errors.og && <p className="text-red-600 text-xs">{errors.og}</p>}
                <input required onChange={handleInputChange} value={formData.new} name="new" type="text" id="new" placeholder="New Password" className="text-black text-left rounded-md h-6 py-5 px-3 w-1/2 max-md:w-2/3"/>
                {errors.new && <p className="text-red-600 text-xs">{errors.new}</p>}
                <input required onChange={handleInputChange} value={formData.cp} name="cp" type="password" id="cp" placeholder="Confirm Password" className="text-black text-left rounded-md h-6 py-5 px-3 w-1/2 max-md:w-2/3"/>
                {errors.cp && <p className="text-red-600 text-xs">{errors.cp}</p>}
                {errors.message && <p className="text-red-600 text-md">{errors.message}</p>}
                {errors.success && <p className="text-green-600 text-md">{errors.success}</p>}
                <div className="flex flex-row gap-3">
                    {!loading &&
                    <button type="submit" className="bg-white text-lightBlue rounded-md px-3  w-1/2 hover:opacity-85 hover:scale-95 max-md:w-2/3 mt-4 py-2">Submit</button>
                    }
                    {loading &&
                    <button className="bg-white text-lightBlue rounded-md px-3 w-1/3 max-md:w-2/3 mt-4 py-2">
                        <span className=" font-black">Loading...</span>
                    </button>}
                    <button disabled className="bg-white text-lightBlue rounded-md px-3  w-1/2 hover:opacity-85 hover:scale-95 max-md:w-2/3 mt-4 py-2"><Link to="/profile">Cancel</Link></button>
                </div>
                
            </div>
        </form>
    </div>
  )
}

export default Password