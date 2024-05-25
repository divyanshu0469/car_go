import { useAuthContext } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ActiveRides = () => {
  
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState({
      message: '',
      error: ''
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_ROUTE}api/activeRides`, { token: authUser.token});
        if(response.status === 201) {
            setErrors({...errors, message: '', error: ''});
            setResults(response.data.results);
        }
    } catch (err) {
        console.log(err);
        setErrors(errors => ({...errors, message: '', error: ((err as AxiosError).response?.data?.error ?? 'an error') as string }));
    }
}


const handleLinkToProfile = (user_id) => {
    navigate(`/profile/${user_id}`);
}


  return (
    <div className="flex flex-col justify-center items-center text-lg max-sm:text-base">

      {results && <div className="bg-white mt-6 w-1/2 max-sm:w-10/12 rounded-md text-barkBlue text-center">
                {results.map((result, index) => (
                    <p key={index} className="p-2 m-2 rounded-md w-full max-sm:w-11/12 hover:shadow-bottom flex flex-col items-center gap-3">
                        {result?.name}<br/>
                        <div className="relative border-2 p-2 rounded-md border-darkBlue w-fit">
                            <p className=" text-gray-500 absolute text-xs bg-white top-[-10px] left-1/10 px-1">leaving on</p>{new Date(result?.date).toLocaleDateString()}
                        </div>
                        <div className="relative border-2 p-2 rounded-md border-darkBlue w-24">
                            <p className=" text-gray-500 absolute text-xs bg-white top-[-10px] left-1/10 px-1">empty seats</p>{result?.passengers}
                        </div>
                        <div className="relative border-2 p-2 rounded-md border-darkBlue w-fit">
                            <p className=" text-gray-500 absolute text-xs bg-white top-[-10px] left-1/10 px-1">from</p>{result?.source.name}
                        </div>
                        <div className="relative border-2 p-2 rounded-md border-darkBlue w-fit">
                            <p className=" text-gray-500 absolute text-xs bg-white top-[-10px] left-1/10 px-1">to</p>{result?.dest.name}
                        </div>
                        <div className="relative border-2 p-2 rounded-md border-darkBlue w-fit">
                            <p className=" text-gray-500 absolute text-xs bg-white top-[-10px] left-1/10 px-1">vehicle</p>{result?.vehicle || 'Not Provided'}
                        </div>
                        <button onClick={() => {
                            handleLinkToProfile(result?.userId);
                        }} className="bg-lightBlue shadow-bottom text-white rounded-md px-3  w-1/3 hover:opacity-85 hover:scale-95 max-md:w-2/3 mt-4 py-2">Contact</button>
                    </p>
                ))}
                </div>
            }
    </div>
  )
}

export default ActiveRides