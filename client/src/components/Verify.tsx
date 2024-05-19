import { ChangeEvent, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Verify = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [errors, setErrors] = useState({
        code: '',
        message: '',
        success: ''
    });

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setCode(value);
        setErrors(errors => ({...errors, code: ''}));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let valid = true;

        if(code.length < 6 || code.length > 6 || isNaN(parseInt(code))) {
            setErrors(errors => ({...errors, code: 'enter a valid 6 digit code' }) );
            valid = false;
        }
        if(valid) {
            try {
                const response = await axios.post(import.meta.env.VITE_SERVER_ROUTE+'api/auth/verify', { code });
                if(response.status === 201) {
                    setErrors(errors => ({...errors, success: 'Verification Successfull'}));
                    console.log(response);
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000)
                } else {
                    setErrors(errors => ({...errors, code: 'incorrect code'}));
                }
                
            } catch (err) {
                console.log("Error during login", err);
                setErrors(errors => ({...errors, message: err.response.data.error}));
                
            }
        }
    }

    return (
    <div className="w-full h-3/4 p-4 font-lato flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-3/4 max-lg:w-1/2 max-sm:w-3/4 select-none h-full p-3 rounded-lg flex gap-3 flex-col justify-around items-center bg-gradient-to-t from-darkBlue via-lightBlue to-darkBlue text-white text-lg font-semibold outline-2 outline-double">
            <div className="flex justify-center flex-col items-center">
                <h1 className="font-extrabold text-5xl mt-6 mb-12 px-6 text-center max-sm:text-3xl">Verify Mail</h1>
            </div>
            <div className="flex flex-col justify-center items-center w-1/2 max-lg:w-full h-full gap-3 py-4">
                <label htmlFor="code" className="text-center">Please enter verification code sent to your email :</label>
                <input required onChange={handleInputChange} value={code} name="code" type="phone" id="code" placeholder="Code" className="text-black text-left rounded-md h-6 py-5 px-3 w-1/2 max-md:w-2/3"/>
                {errors.code && <p className="text-red-600 text-sm">{errors.code}</p>}
                {errors.success && <p className="text-green-600 text-md">{errors.success}</p>}
                <button type="submit" className="bg-white text-lightBlue rounded-md px-3  w-fit hover:opacity-85 hover:scale-105 max-md:w-fit mt-4 py-2">Verify</button>
            </div>
        </form>
    </div>
    )
}

export default Verify