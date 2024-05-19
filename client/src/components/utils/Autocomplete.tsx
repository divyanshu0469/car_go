import { useContext, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete"
import { SourceContext } from "../../context/SourceContext";
import { DestContext } from "../../context/DestContext";

const Autocomplete = ( {type} ) => {
    
    const [value, setValue] = useState(null);

    const sourceContext = useContext(SourceContext);
    const destContext = useContext(DestContext);

    const setSource = sourceContext?.setSource;
    const setDest = destContext?.setDest;

    const getLatNLong = (place, type) => {
        const placeId = place.value.place_id;
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        service.getDetails({placeId}, (place, status) => {
            if (status === "OK" && place?.geometry && place?.geometry.location) {
                if(type === "source") {
                    setSource({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                        name: place.formatted_address,
                        label: place.name
                    })
                } else {
                    setDest({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                        name: place.formatted_address,
                        label: place.name
                    })
                }
            }
        });
    }

  return (
    <label htmlFor={type === "source" ? "source" : "dest"} className="hover:bg-gray-200 p-4 w-full hover:cursor-pointer flex flex-row max-sm:flex-col rounded-md" >
        <i className="fa-solid fa-location-dot text-darkBlue p-2 "></i>
        <GooglePlacesAutocomplete 
        apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
        selectProps={{
            value,
            onChange: (place)=> {
                getLatNLong(place, type);
                setValue(place);
            },
            placeholder: type === "source" ? "leaving from" : "going to" ,
            isClearable: true,
            required: true,
            id: type === "source" ? "source" : "dest" ,
            name: type === "source" ? "source" : "dest" ,
            className: 'w-full text-left',
            
            components: {
                DropdownIndicator: false,
            },
            styles: {
                input: (provided) => ({
                    ...provided,
                    cursor: 'pointer'
                }),
                control: (provided) => ({
                    ...provided,
                    backgroundColor: "transparent",
                    border: "none",
                    boxShadow: "none",
                })
            }
            
        }}/>
    </label>
  )
}

export default Autocomplete