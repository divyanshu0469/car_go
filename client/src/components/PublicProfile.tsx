import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios";

const PublicProfile = () => {
    const { userId } = useParams();

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
      

      const getDetails = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_SERVER_ROUTE}api/getPublicProfile/${userId}`);
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

  return (
    <div className="flex flex-col items-center">
        <div className="bg-white rounded-md w-1/2 flex flex-col items-center gap-3 p-3">
            
            <div className="w-full grid grid-cols-2 max-md:grid-cols-1">
                <div className="flex justify-center items-center w-full">
                    <img  src={profileData.profilePic} className="block rounded-full w-40 h-40"/>
                </div>
                <div className="flex flex-col max-md:items-center">
                    <div className="relative border-2 rounded-md p-2 border-darkBlue w-fit mt-2 hover:shadow-bottom">
                        <p className=" text-gray-500 absolute text-xs bg-white top-[-10px] left-1/10 px-1">Name</p>{profileData.name}
                    </div>
                    <div className="relative border-2 rounded-md p-2 border-darkBlue w-fit mt-2 hover:shadow-bottom">
                        <p className=" text-gray-500 absolute text-xs bg-white top-[-10px] left-1/10 px-1">Gender</p>{profileData.gender}
                    </div>
                    <div className="relative border-2 col-span-2 rounded-md p-2 border-darkBlue w-fit mt-2 hover:shadow-bottom">
                        <p className=" text-gray-500 absolute text-xs bg-white top-[-10px] left-1/10 px-1">Bio</p>{profileData.miniBio}
                    </div>
                </div>
                
            </div>
            <p className="text-center">Please use mobile or email to connect with the driver</p>

            <div className="w-full grid grid-cols-2 max-lg:grid-cols-1 text-center">
                <div className="flex justify-center itmes-center flex-col">
                    <div className="relative border-2 rounded-md p-2 border-darkBlue h-fit w-fit mt-2 hover:shadow-bottom">
                        <p className=" text-gray-500 absolute text-xs bg-white top-[-10px] left-1/10 px-1">Mobile</p>{profileData.mobile}
                    </div>
                </div>
                
                <div className="flex max-lg:justify-center itmes-center">
                    <div className="relative border-2 rounded-md p-2 border-darkBlue w-fit mt-2 hover:shadow-bottom max-sm:w-10/12 max-sm:overflow-scroll">
                        <p className=" text-gray-500 absolute text-xs bg-white top-[-10px] left-1/10 px-1 max-sm:hidden">Email</p>{profileData.email}
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default PublicProfile