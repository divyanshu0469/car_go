import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios, { AxiosError } from "axios";

const MyRides = () => {
    const { authUser } = useAuthContext();

    const [results, setResults] = useState([]);
    const [errors, setErrors] = useState({
        message: '',
        error: ''
    });
    

    useEffect(() => {
        axios.post(import.meta.env.VITE_SERVER_ROUTE+'api/myRides', { token: authUser.token }).then((response) => {
            if(response.status === 201) {
                setErrors({...errors, message: '', error: ''});
                setResults(response.data.results);
            }
        }).catch((err) => {
            console.log(err);
            setErrors(errors => ({...errors, message: '', error: ((err as AxiosError).response?.data?.error ?? 'an error') as string }));
            
        })
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5001/api/deleteRide/${id}`).then((response) => {
            if(response.status === 201) {
                window.location.reload();
            }
        }).catch((err) => {
            console.log(err);
            setErrors(errors => ({...errors, message: '', error: ((err as AxiosError).response?.data?.error ?? 'an error') as string }));
        })
    }

    return(
        <div className="flex flex-col justify-center items-center text-lg">
            {errors.error && <p className="text-red-600 text-md">{errors.error}</p>}

            {errors.message && <p className="text-green-600 text-md">{errors.message}</p>}
            
            {results && <div className="bg-white mt-6 w-fit rounded-md text-barkBlue text-center flex flex-col">
                {results.map((result, index) => (
                    <p key={index} className="p-2 m-2 rounded-md w-full">
                        {result?.name}<br/>
                        leaving on : {new Date(result?.date).toLocaleDateString()}<br/>
                        total seats available : {result?.passengers}<br/>
                        going from : {result?.source.name}<br/>
                        going to : {result?.dest.name}<br/>
                        {result?.vehicle}<br/>
                        <button className="bg-red-500 p-2 rounded-md text-white hover:shadow-bottom" onClick={() => handleDelete(result?._id) }>Delete</button>
                    </p>
                ))}
            </div>
            }
        </div>
    )
}
export default MyRides;