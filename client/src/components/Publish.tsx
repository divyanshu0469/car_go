import { useState } from "react";
import { DestContext } from "../context/DestContext"
import { SourceContext } from "../context/SourceContext"
import Autocomplete from "./utils/Autocomplete"
import axios, { AxiosError } from "axios";
import { useAuthContext } from "../context/AuthContext";

const Publish = () => {

    const { authUser } = useAuthContext(); 

    const [source, setSource] = useState([]);
    const [dest, setDest] = useState([]);
    const [passengers, setPassengers] = useState(1);
    const [date, setDate] = useState('');
    const [errors, setErrors] = useState({
        message: '',
        error: ''
    });

    const handlePublish = async (e) => {
        e.preventDefault();

        if(source.lat === dest.lat && dest.lng === source.lng) {
            setErrors(errors => ({...errors, error: 'Source and destination cannot be the same', message: ''}));
            return;
        }
        
        try {
            const response = await axios.post(import.meta.env.VITE_SERVER_ROUTE+'api/publish', { token: authUser.token, source, dest, date, passengers })
            if(response.status === 201) {
                setErrors({...errors, message: response.data.message, error: ''});
            }
        } catch (err) {
            console.log(err);
            setErrors(errors => ({...errors, message: '', error: ((err as AxiosError).response?.data?.error ?? 'an error') as string }));
            setInterval(() => {
                setErrors(errors => ({...errors, message: '', error: ''}));
            }, 2000);
        }
    }
    
    return (
    <SourceContext.Provider value={{source, setSource}}>
    <DestContext.Provider value={{dest, setDest}}>
        <div className="flex flex-col justify-center items-center text-lg max-sm:text-base">
            <form onSubmit={handlePublish} className="bg-white p-2 rounded-md text-center shadow-2xl flex flex-col max-sm:w-10/12 w-1/2 justify-center items-center mb-4">

                <p className="text-5xl text-darkBlue font-bold p-4">Save money on your trip</p>

                <div className="flex flex-col w-4/5 items-center rounded-md">

                    <div className="flex flex-col justify-around w-full">
                            
                    </div>

                    <label htmlFor="date" className="flex flex-row max-sm:flex-col items-center gap-2">
                        <p className="bg-transparent pl-2">leaving when ?</p>
                        <input required type="date" name="date" id="date" min={new Date().toISOString().split('T')[0]} value={date} onChange={(e) => {setDate(e.target.value);setErrors({message: '', error: ''});} } className="hover:bg-gray-200 p-4 rounded-md w-1/2 max-sm:w-11/12 focus:outline-none"/>
                    </label>
                    
                    <label htmlFor="passengers" className="flex flex-row items-center p-4 rounded-md gap-2">
                        <p className="bg-transparent pl-2">how many empty seats do will you have?</p>
                        <input required type="number" min={1} name="passengers" id="passengers" onChange={(e) => {setPassengers(e.target.value);setErrors({message: '', error: ''});} } value={passengers} placeholder="1" className="w-16 p-2 rounded-md max-sm:w-8 hover:bg-gray-200 bg-transparent focus:outline-none"/>
                    </label>

                    <Autocomplete type="source"/>
                    <Autocomplete type="destination"/>
                </div>

                {errors.error && <p className="text-red-600 text-md">{errors.error}</p>}

                {errors.message && <p className="text-green-600 text-md">{errors.message}</p>}

                <button type="submit" className="bg-lightBlue shadow-bottom text-white rounded-md px-3  w-1/3 hover:opacity-85 hover:scale-95 max-md:w-2/3 mt-4 py-2">Publish</button>
                
            </form>
        </div>
    </DestContext.Provider>
    </SourceContext.Provider>
  )
}

export default Publish