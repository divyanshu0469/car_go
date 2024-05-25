import Home from "./components/Home";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import SignUp from "./components/SignUp";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext.tsx";
import Profile from "./components/Profile.tsx";
import Verify from "./components/Verify.tsx";
import Password from "./components/Password.tsx";
import Publish from "./components/Publish.tsx";
import MyRides from "./components/MyRides.tsx";
import ActiveRides from "./components/ActiveRides.tsx";
import PublicProfile from "./components/PublicProfile.tsx";
import Aadhar from "./components/Aadhar.tsx";
import License from "./components/License.tsx";

function App() {
  const { authUser } = useAuthContext();
  
  return (
    <div className=" font-mono">
        <NavBar/>
      <Routes>
        <Route path="/" element={authUser ? <Navigate to='/home'/> : <Navigate to='/login' />} />
        <Route path="/activeRides" element={authUser ? <ActiveRides /> : <Navigate to='/login' />} />
        <Route path="/home" element={authUser ? <Home /> : <Navigate to='/login' />} />
        <Route path="/my-rides" element={authUser ? <MyRides /> : <Navigate to='/login' />} />
        <Route path="/publish" element={authUser ? <Publish /> : <Navigate to='/login' />} />
        <Route path="/signup" element={authUser ? <Navigate to='/verify' /> : <SignUp />} />
        <Route path="/login" element={authUser ? <Navigate to='/' /> : <Login />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Login />} />
        <Route path="/verify" element={authUser ? <Home /> : <Verify />} />
        <Route path="/password" element={authUser ? <Password /> : <Login />} />
        <Route path="/aadharDetails" element={authUser ? <Aadhar /> : <Login />} />
        <Route path="/licenseDetails" element={authUser ? <License /> : <Login />} />
        <Route path="/profile/:userId" element={authUser ? <PublicProfile /> : <Login />} />

      </Routes>
    </div>
  );
}

export default App;