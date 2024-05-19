import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.tsx"
import axios from "axios";
import { useEffect, useState } from "react";
import { Dropdown } from "flowbite-react";

const NavBar = () => {

  const { authUser, setAuthUser } = useAuthContext();

  const [pic, setPic]= useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const getPic = async () => {
      if(authUser) {
        try {
          const response = await axios.post('http://localhost:5001/api/getProfile', authUser);
          if(response.status === 201) {
            setPic(response.data.profilePic);
            setName(response.data.name);
            setEmail(response.data.email);
          }
        } catch (err: unknown) {
          setError(err.response.data.error);
          setTimeout(() => {
            setError('');
          }, 3000)
        }
      }
    }
    getPic();
  }, [])
  
  const handleLogOut = async () => {
    localStorage.removeItem('user-info');
    setAuthUser(null);
  }
  return (
    <div className="h-1/3 flex items-center justify-between ">
        {/* <Link to='/home'><img src="../car_go_logo.svg" className="w-[150px] ml-6 my-6 max-sm:w-[100px] border-spacing-80 rounded-lg hover:opacity-80" draggable="false" alt="" /></Link> */}
        <Link to='/home'><img src="../car_go_logo_small.svg" className="w-[100px] ml-6 my-6 max-sm:w-[100px] border-spacing-80 rounded-lg hover:opacity-80" draggable="false" alt="" /></Link>
        {error && 
        <p className="text-red-500">{error}
        <button onClick={handleLogOut} className="p-2 rounded-md text-red-500 bg-white w-fit hover:text-black">Log Out</button>
        </p>}
        {authUser && 
        <Dropdown inline arrowIcon={false}  label={<img src={pic} className="w-16 h-16 mr-6 my-6 rounded-full hover:opacity-85 hover:outline hover:outline-4 hover:outline-white"/>}>
          <Dropdown.Header className="bg-white">
            <span className="block text-sm text-darkBlue text-center">{name}</span>
            <span className="block truncate mx-2 text-xs font-medium text-center text-lightBlue border-t-2 border-gray-400">{email}</span>
          </Dropdown.Header>
          <Dropdown.Item as={Link} to="/profile" className="bg-white pl-3 text-darkBlue hover:text-lightBlue">
            Profile
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/publish" className="bg-white pl-3 text-darkBlue hover:text-lightBlue">
            Publish a ride
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/my-rides" className="bg-white pl-3 text-darkBlue hover:text-lightBlue">
            My Rides
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/home" className="bg-white pl-3 text-darkBlue hover:text-lightBlue">
            Find a ride
          </Dropdown.Item>
          <Dropdown.Item onClick={handleLogOut} className="bg-white pl-3 text-darkBlue hover:text-lightBlue">
            Log Out
          </Dropdown.Item>
        </Dropdown>}
    </div>
  )
}

export default NavBar