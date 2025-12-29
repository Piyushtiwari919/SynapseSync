import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addUser } from "../../store/userSlice.js";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleEmailChange = (e) => {
    setEmailId(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      setError("");
      navigate("/feed");
      console.log(res);
    } catch (error) {
      setError(error?.response?.data || "Something went Wrong");
      setToast(true);
      setTimeout(() => {
        setToast(false);
      }, 3000);
      console.log(error);;
    }
  };
  return (
    <div className="flex items-center justify-center mt-10 mb-4">
      <form className="bg-[#DBE4EE] flex flex-col justify-center p-8 rounded-md text-black">
        <h2 className="text-2xl font-bold mx-auto my-2">Login</h2>
        <label htmlFor="email-input">Email</label>
        <input
          type="text"
          className="border-2 border-amber-600 mb-2 rounded-md p-1"
          id="email-input"
          value={emailId}
          onChange={handleEmailChange}
          required
        />
        <label htmlFor="password-input">Password</label>
        <input
          type="password"
          className="border-2 border-amber-600 mb-2 rounded-md p-1"
          id="password-input"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        {error !== "" ? <p className="p-2 my-1 text-red-600">{error}</p> : ""}
        <button
          className="bg-[#F17300] rounded-md p-2 mt-2 cursor-pointer"
          onClick={handleLogin}
        >
          Login
        </button>
        <div className="my-2 mt-3 font-medium">
          New User?{" "}
          <Link
            to="/register"
            className="hover:border-b-gray-700 hover:border-b-2 mx-1"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
