import { ChangeEvent, useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";

const Aadhar = () => {
  const { authUser } = useAuthContext();
  
  const [upload, setUpload] = useState<File | null>(null);
  let aadharURL = '';

  const [profileData, setProfileData] = useState({
    aadharPic: '',
    aadharNumber: '',
    message: '',
    success: ''
  });
  const [errors, setErrors] = useState({
    aadharPic: '',
    aadharNumber: '',
    message: '',
    success: ''
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value} = event.target;
    setProfileData({...profileData, [name]: value });
    setErrors({...errors, [name]: '' });
  }

  const getAadhar = async () => {
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_ROUTE+'api/getDetails', { token:authUser.token });
      if(response.status === 201) {
        setProfileData({
          aadharPic: response.data.user.aadharPic,
          aadharNumber: response.data.user.aadharNumber,
          message: '',
          success: ''
        });
      }
    } catch (err) {
      console.log("Error during getAadhar", err);
    }
  }

  useEffect(() => {
    getAadhar();
  }, [])

  const uploading = async (formData: FormData) => {
    try {
        const res = await axios.post('https://api.cloudinary.com/v1_1/divyyanshu/image/upload', formData );
        console.log(res.data);
        aadharURL = res.data.url;
      
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { aadharNumber } = profileData;
    const aadharRegex = /^[0-9]{12,12}$/;
    if(!aadharRegex.test(aadharNumber)) {
        setErrors(errors => ({...errors, aadharNumber: 'Aadhar number should be a 12 digit number' }) );
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
        const response = await axios.post(import.meta.env.VITE_SERVER_ROUTE+'api/setAadhar', { token:authUser.token, aadharNumber, aadharPic: aadharURL });
        if(response.status === 201) {
            setErrors(errors => ({...errors, success: 'Aadhar details saved'}));
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
        <p className="border-b-2 border-white text-center w-1/3">Your aadhar Details</p>

        <form encType="multipart/form-data" onSubmit={handleSubmit} className="text-base p-2 flex flex-col justify-center items-center ">
            <img src={profileData.aadharPic} className="block w-1/3 p-2"/>

            <label htmlFor="aadhar_upload" className="p-2 text-center flex flex-col items-center"> Upload Aadhar : <input type="file" name="aadhar_upload" id="aadhar_upload" 
            onChange={(e) => {
            if(e.target.files) {
              setUpload(e.target.files[0]);
            }
            setErrors({...errors, aadharPic: ''});
            }}
            /></label>
            {errors.aadharPic && <p className="text-red-600 text-xs">{errors.aadharPic}</p>}

            <label htmlFor="aadharNumber" className="relative border-2 rounded-md p-2 border-darkBlue h-fit w-fit mt-2 hover:bg-gray-100 bg-white">
              <p className=" text-gray-500 absolute text-xs bg-white rounded-sm top-0 left-1/10 px-1">Aadhar Number</p>
              <input required onChange={handleInputChange} value={profileData.aadharNumber} name="aadharNumber" type="text" id="aadharNumber" placeholder="Aadhar Number" className="text-gray-600 text-left focus:outline-none rounded-md p-2 hover:bg-gray-100 "/>
            </label>
            {errors.aadharNumber && <p className="text-red-600 text-xs">{errors.aadharNumber}</p>}


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

export default Aadhar