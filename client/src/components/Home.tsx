import { useState } from "react";
import Autocomplete from "./utils/Autocomplete";
import { SourceContext } from "../context/SourceContext";
import { DestContext } from "../context/DestContext";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { authUser } = useAuthContext(); 
    const navigate = useNavigate();

    const [source, setSource] = useState();
    const [dest, setDest] = useState();
    const [passengers, setPassengers] = useState(1);
    const [date, setDate] = useState('');
    const [results, setResults] = useState([]);
    const [errors, setErrors] = useState({
        message: '',
        error: ''
    });
    
    const handleSearch = async (e) => {
        e.preventDefault();

        if(source?.lat === dest?.lat && dest?.lng === source?.lng) {
            setErrors(errors => ({...errors, error: 'Source and destination cannot be the same', message: ''}));
            return;
        }
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_ROUTE}api/search`, { token: authUser.token, source, dest, date, passengers });
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

    return(
    <SourceContext.Provider value={{source, setSource}}>
    <DestContext.Provider value={{dest, setDest}}>
    <div className="flex flex-col justify-center items-center text-lg max-sm:text-base">
            <form onSubmit={handleSearch} className="bg-white p-2 rounded-md text-center shadow-2xl flex flex-col w-1/2 max-sm:w-10/12 justify-center items-center">

                <p className="text-5xl text-darkBlue font-bold p-4">Find a ride</p>
                <div className="flex flex-col w-4/5 items-center rounded-md">
                    <label htmlFor="date" className="flex flex-row max-sm:flex-col items-center gap-2">
                        <p className="bg-transparent pl-2">leaving when ?</p>
                        <input required type="date" name="date" id="date" min={new Date().toISOString().split('T')[0]} value={date} onChange={(e: { target: { value: any; }; }) => {setDate(e.target.value);setErrors({message: '', error: ''});} } className="hover:bg-gray-200 p-4 rounded-md w-1/2 max-sm:w-11/12 focus:outline-none"/>
                    </label>
                    
                    <label htmlFor="passengers" className="flex flex-row items-center p-4 rounded-md gap-2">
                        <input required type="number" min={1} name="passengers" id="passengers" onChange={(e) => {setPassengers(e.target.value);setErrors({message: '', error: ''});} } value={passengers} placeholder="1" className="w-16 max-sm:w-8 p-2 rounded-md hover:bg-gray-200 bg-transparent focus:outline-none"/>
                        <p className="bg-transparent pl-2">Passengers</p>
                    </label>

                    <Autocomplete type="source"/>
                    <Autocomplete type="destination"/>
                </div>

                {errors.error && <p className="text-red-600 text-md">{errors.error}</p>}

                {errors.message && <p className="text-green-600 text-md">{errors.message}</p>}

                <div className="flex flex-row max-md:flex-col gap-3">
                    <button type="submit" className="bg-lightBlue shadow-bottom text-white rounded-md px-3  w-1/3 hover:opacity-85 hover:scale-95 max-md:w-2/3 mt-4 py-2">Search</button>
                    <button onClick={() => {navigate('/activeRides')}} className="bg-lightBlue shadow-bottom text-white rounded-md px-3  w-1/3 hover:opacity-85 hover:scale-95 max-md:w-2/3 mt-4 py-2">Active Rides</button>
                </div>
                
            </form>
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
    </DestContext.Provider>
    </SourceContext.Provider>
    )
}
export default Home;