import { ChangeEvent, useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";

const License = () => {
  const { authUser } = useAuthContext();
  
  const [upload, setUpload] = useState<File | null>(null);
  let licenseURL = '';

  const [profileData, setProfileData] = useState({
    licensePic: '',
    licenseNumber: '',
    vehicle: '',
    message: '',
    success: ''
  });
  const [errors, setErrors] = useState({
    licensePic: '',
    licenseNumber: '',
    vehicle: '',
    message: '',
    success: ''
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value} = event.target;
    setProfileData({...profileData, [name]: value });
    setErrors({...errors, [name]: '' });
  }

  const getLicense = async () => {
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_ROUTE+'api/getDetails', { token:authUser.token });
      if(response.status === 201) {
        setProfileData({
            licensePic: response.data.user.licensePic,
            licenseNumber: response.data.user.licenseNumber !== null ? response.data.user.licenseNumber : '',
            vehicle: response.data.user.vehicle!== null? response.data.user.vehicle : '',
            message: '',
            success: ''
        });
      }
    } catch (err) {
      console.log("Error during getLicense", err);
    }
  }

  useEffect(() => {
    getLicense();
  }, [])

  const uploading = async (formData: FormData) => {
    try {
        const res = await axios.post('https://api.cloudinary.com/v1_1/divyyanshu/image/upload', formData );
        console.log(res.data);
        licenseURL = res.data.url;
      
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { licenseNumber, vehicle } = profileData;

    const licenseRegex = /^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$/;
    const vehicleNameRegex = /^[a-zA-Z0-9 .-]+$/;

    if(!licenseRegex.test(licenseNumber)) {
        setErrors(errors => ({...errors, aadharNumber: 'Please enter a valid License number' }) );
        return;
    }
    if(!vehicleNameRegex.test(vehicle)) {
        setErrors(errors => ({...errors, vehicle: 'Please enter a valid vehicle name' }) );
        return;
    }
    if(upload) {
        if(upload.type !== 'image/png' && upload.type !== 'image/jpeg' && upload.type !== 'image/jpg') {
            setErrors(errors => ({...errors, licensePic: 'Please upload a valid image' }) );
            return;
        }
        const formData = new FormData();
        formData.append('file', upload);
        formData.append('upload_preset', 'tqumfukj');
        await uploading(formData);
    }
    try {
        const response = await axios.post(import.meta.env.VITE_SERVER_ROUTE+'api/setLicense', { token:authUser.token, licenseNumber, licensePic: licenseURL, vehicle });
        if(response.status === 201) {
            setErrors(errors => ({...errors, success: 'License details saved'}));
            setInterval(() => {
                window.location.reload();
              }, 2000);
        }
    } catch(err) {
        console.log(err);
        setErrors(errors => ({...errors, message: ((err as AxiosError).response?.data?.error?? 'an error') as string }));
    }

  }

  return (
    <div className="text-lg text-white flex flex-col justify-center items-center">
        <p className="border-b-2 border-white text-center w-1/3">Your License Details</p>

        <form encType="multipart/form-data" onSubmit={handleSubmit} className="text-base p-2 flex flex-col justify-center items-center ">
            <img src={profileData.licensePic} className="block w-1/3 p-2"/>

            <label htmlFor="license_upload" className="p-2 text-center flex flex-col items-center"> Upload License : <input type="file" name="license_upload" id="license_upload" 
            onChange={(e) => {
            if(e.target.files) {
                setUpload(e.target.files[0]);
            }
            setErrors({...errors, licensePic: ''});
            }}
            /></label>
            {errors.licensePic && <p className="text-red-600 text-xs">{errors.licensePic}</p>}

            <label htmlFor="licenseNumber" className="relative border-2 rounded-md p-2 border-darkBlue h-fit w-fit mt-2 hover:bg-gray-100 bg-white">
              <p className=" text-gray-500 absolute text-xs bg-white rounded-sm top-0 left-1/10 px-1">License Number</p>
              <input required onChange={handleInputChange} value={profileData.licenseNumber} name="licenseNumber" type="text" id="licenseNumber" placeholder="License Number" className="text-gray-600 text-left focus:outline-none rounded-md p-2 hover:bg-gray-100 "/>
            </label>
            {errors.licenseNumber && <p className="text-red-600 text-xs">{errors.licenseNumber}</p>}


            <label htmlFor="vehicle" className="relative border-2 rounded-md p-2 border-darkBlue h-fit w-fit mt-2 hover:bg-gray-100 bg-white">
              <p className=" text-gray-500 absolute text-xs bg-white rounded-sm top-0 left-1/10 px-1">Personal Vehicle</p>
              <input required onChange={handleInputChange} value={profileData.vehicle} name="vehicle" type="text" id="licvehicleenseNumber" placeholder="Vehicle Name" className="text-gray-600 text-left focus:outline-none rounded-md p-2 hover:bg-gray-100 "/>
            </label>
            {errors.vehicle && <p className="text-red-600 text-xs">{errors.vehicle}</p>}


            {errors.message && <p className="text-red-600 text-md">{errors.message}</p>}
            {errors.success && <p className="text-green-600 text-md">{errors.success}</p>}

            <div className="flex flex-row gap-3">
                <button type="submit" className="bg-white text-lightBlue rounded-md px-3  w-fit hover:opacity-85 hover:scale-95 max-md:w-2/3 mt-4 py-2">Update</button>
                <button disabled className="bg-white text-lightBlue rounded-md px-3  w-fit hover:opacity-85 hover:scale-95 max-md:w-2/3 mt-4 py-2"><Link to="/profile">Cancel</Link></button>
            </div>
        </form>
    </div>
  )
}

export default License