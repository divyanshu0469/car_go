import axios, { AxiosError } from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext.tsx";
import { Link } from "react-router-dom";

const Profile = () => {
  const { authUser } = useAuthContext();

  const [account, setAccount] = useState(false);
  const [about, setAbout] = useState(true);

  const [newProfile, setNewProfile] = useState<File | null>(null);
  
  const [profileData, setProfileData] = useState({
    profilePic: '',
    name: '',
    miniBio: '',
    mobile: '',
    gender: '',
    email: '',
    message: '',
    success: ''
  });
  const [errors, setErrors] = useState({
    profilePic: '',
    name: '',
    miniBio: '',
    mobile: '',
    gender: '',
    message: '',
    success: ''
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value} = event.target;
    setProfileData({ ...profileData, [name]: value });
    setErrors({...errors, [name]: '' });
  }
  const getDetails = async () => {
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_ROUTE+'api/getProfile', { token:authUser.token });
      if(response.status === 201) {
        setProfileData({
          profilePic: response.data.profilePic,
          name: response.data.name,
          miniBio: response.data.miniBio,
          mobile: response.data.mobile,
          gender: response.data.gender,
          email: response.data.email,
          message: '',
          success: ''
        });
      }
    } catch (err) {
      console.log("Error during getPic", err);
    }
  }
  
  useEffect(() => {
    getDetails();
  }, [])

  const uploading = async (formData: FormData) => {
    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/divyyanshu/image/upload', formData )
        profilePic = res.data.url;
      
    } catch (error) {
      console.error('Error:', error);
    }
  }

  let profilePic = '';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, miniBio, mobile } = profileData;
    let valid = true;

    const nameRegex = /^[a-zA-Z]+(?:\s+[a-zA-Z]+)*$/;
    const moblieRegex = /^[+]?[0-9()-.\s]{10,10}$/;

    if(name.trim().length === 0 || !nameRegex.test(name)) {
      setErrors(errors => ({...errors, name: 'Please provide a valid name' }) );
      valid = false;
    }
    if(!moblieRegex.test(mobile)) {
      setErrors(errors => ({...errors, mobile: 'Please provide a valid mobile number' }) );
      valid = false;
    }
    
    if(valid) {
      
      if(newProfile) {
        if(newProfile.type !== 'image/png' && newProfile.type !== 'image/jpeg' && newProfile.type !== 'image/jpg') {
          setErrors(errors => ({...errors, licensePic: 'Please upload a valid image' }) );
          return;
        }
        const formData = new FormData();
        formData.append('file', newProfile);
        formData.append('upload_preset', 'tqumfukj');
        uploading(formData);
      }
      
      setTimeout(() => {
        axios.post(import.meta.env.VITE_SERVER_ROUTE+'api/setProfile', {token: authUser.token, name: name, miniBio: miniBio, mobile: mobile, profilePic: profilePic})
        .then((response) => {
          if(response.status === 201) {
              setErrors(errors => ({...errors, success: 'Profile changes saved'}));
              getDetails();
          }
        })
        .catch((err: unknown) => {
          setErrors(errors => ({...errors, message: ((err as AxiosError).response?.data?.error?? 'an error') as string }));
        })
        .finally(() => {
          setTimeout(() => {
              setErrors({...errors, success: ''});
          }, 2000);
        })
      }, 5000);
    }
  }


  

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-3/4 text-center text-white">
        <div className="flex flex-row w-full h-full justify-center items-center">

          <button onClick={() => {
            setAccount(false);
            setAbout(true);
          }} className="w-2/4 opacity-50 focus:opacity-100 border-b-2 border-white shadow-lg">Profile Details</button>

          <button onClick={() => {
            setAccount(true);
            setAbout(false);
          }} className="w-2/4 focus:opacity-100 opacity-50 border-b-2 border-white shadow-lg">Account Details</button>
        </div>


        {
          about && <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col justify-center items-center w-full gap-3 py-4">

          <label htmlFor="newProfile" className="relative group max-sm:static">
            <img  src={profileData.profilePic} className="block group-hover:opacity-60 rounded-full w-40 h-40"/>
            <div className="absolute top-0 max-sm:hidden   opacity-0 w-fit h-fit cursor-pointer group-hover:opacity-100 rounded-full">
              <img src="edit-pencil.png" className="w-[30px] h-[30px] m-16" />
            </div>
          </label>
          <input type="file" id="newProfile" 
          onChange={(e) => {
            if(e.target.files) {
              setNewProfile(e.target.files[0]);
            }
            setErrors({...errors, profilePic: ''});            
          }} 
          name="newProfile" className="hidden"/>
          
          {errors.profilePic && <p className="text-red-600 text-xs">{errors.profilePic}</p>}

          <div className="w-full flex flex-row items-center justify-center gap-2 max-sm:flex-col">
            <label htmlFor="name" className="relative border-2 rounded-md p-2 border-darkBlue h-fit w-fit mt-2 hover:bg-gray-100 bg-white">
              <p className=" text-gray-500 absolute text-xs bg-white rounded-sm top-0 left-1/10 px-1">Name</p>
              <input required onChange={handleInputChange} value={profileData.name} name="name" type="text" id="name" placeholder="Name" className="text-gray-600 text-left focus:outline-none rounded-md p-2 hover:bg-gray-100 "/>
            </label>
            <label htmlFor="gender" className="relative border-2 rounded-md p-2 border-darkBlue mt-2 hover:bg-gray-100 bg-white">
              <p className=" text-gray-500 absolute text-xs bg-white rounded-sm top-0 left-1/10 px-1">Gender</p>
              <p className="text-gray-600 text-left rounded-md  p-2 max-md:w-2/3  focus:outline-none hover:bg-gray-100">{profileData.gender}</p>
            </label>
          </div>
          
          {errors.name && <p className="text-red-600 text-xs">{errors.name}</p>}

          <label htmlFor="miniBio" className="relative border-2 rounded-md p-2 border-darkBlue h-fit w-3/6 mt-2 hover:bg-gray-100 bg-white">
            <p className=" text-gray-500 absolute text-xs bg-white rounded-sm top-0 left-1/10 px-1">Bio</p>
            <textarea onChange={handleInputChange} value={profileData.miniBio} name="miniBio" id="miniBio" placeholder='What would you like other members to know about you?' className="text-gray-600 text-left rounded-lg py-5 px-3 w-full h-fit focus:outline-none hover:bg-gray-100 "/>
          </label>
          {errors.miniBio && <p className="text-red-600 text-xs">{errors.miniBio}</p>}

          <label htmlFor="mobile" className="relative border-2 rounded-md p-2 border-darkBlue h-fit w-fit mt-2 hover:bg-gray-100 bg-white">
            <p className=" text-gray-500 absolute text-xs bg-white rounded-sm top-0 left-1/10 px-1">Mobile</p>
            <input required onChange={handleInputChange} value={profileData.mobile} name="mobile" type="phone" id="mobile" placeholder="Mobile" className="text-gray-600 text-left rounded-md  p-2 max-md:w-2/3  focus:outline-none hover:bg-gray-100"/>
          </label>
          {errors.mobile && <p className="text-red-600 text-xs">{errors.mobile}</p>}

          {errors.message && <p className="text-red-600 text-md">{errors.message}</p>}
          {errors.success && <p className="text-green-600 text-md">{errors.success}</p>}

          <button type="submit" className="bg-white text-lightBlue rounded-md px-3  w-fit hover:opacity-85 hover:scale-95 max-md:w-2/3 mt-4 py-2">Save</button>

        </form>
        }

        {
          account && <p className="flex flex-col justify-center items-center w-full gap-3 py-4">

            Email : {profileData.email}

            <Link to="/aadharDetails" className="bg-white text-lightBlue rounded-md px-3  w-fit hover:opacity-85 hover:scale-95 max-md:w-2/3 mt-4 py-2">Aadhar Details</Link>
            
            <Link to="/licenseDetails" className="bg-white text-lightBlue rounded-md px-3  w-fit hover:opacity-85 hover:scale-95 max-md:w-2/3 mt-4 py-2">License Details</Link>

            <Link to="/password" className="bg-white text-lightBlue rounded-md px-3  w-fit hover:opacity-85 hover:scale-95 max-md:w-2/3 mt-4 py-2">Change Password</Link>

          </p>
        }
      </div>
    </div>
  )
}

export default Profile