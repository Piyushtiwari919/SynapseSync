import axios from "axios";
import { useState } from "react";
import { addUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    age: "",
    gender: "",
    about: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [toast, setToast] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const dispatch = useDispatch();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0]; // Access the first selected file
    console.log(e.target.files);
    // Validating that a file was actually selected
    if (file) {
      setAvatar(file); // Store the actual file object for the backend
      setPreview(URL.createObjectURL(file)); // Create a temporary URL for the frontend preview
    }
  };

  const handleUserRegister = async (e) => {
    try {
      e.preventDefault();
      if (
        !userData.firstName ||
        !userData.emailId ||
        !userData.age ||
        !userData.password ||
        !userData.gender
      ) {
        setError("All fields are Required");
        setToast(true);
        setTimeout(() => {
          setToast(false);
        }, 3000);
        return; // <--- Stops the function here. The backend request will NOT happen.
      }
      const formData = new FormData();
      console.log(userData);
      formData.append("firstName", userData.firstName);
      formData.append("lastName", userData.lastName);
      formData.append("emailId", userData.emailId);
      formData.append("password", userData.password);
      formData.append("age", userData.age);
      formData.append("gender", userData.gender);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      //   console.log("--- FORM DATA CONTENTS ---");
      //   for (let [key, value] of formData.entries()) {
      //     console.log(`${key}:`, value);
      //   }
      //   console.log("--------------------------");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for files
          },
          withCredentials: true,
        }
      );

      //   return response;
      dispatch(addUser(response.data));
      setError("");
      navigate("/feed");
    } catch (error) {
      const finalErrorMsg = error?.response?.data.slice(6);
      setError(finalErrorMsg || "Something Went Wrong");
      setToast(true);
      setTimeout(() => {
        setToast(false);
      }, 3000);
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col my-4 items-center justify-center">
      <h2 className="text-3xl font-bold">Create Account</h2>
      {toast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-info bg-warning-content text-white">
            <span>{error}</span>
          </div>
        </div>
      )}
      <form
        encType="multipart/form-data"
        className=" bg-cyan-600 text-white p-8 w-1/2 max-sm:w-full my-2 rounded-md font-bold"
      >
        <div className="flex flex-col my-2">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            className="border-2 p-1 rounded-md mt-1 border-b-emerald-100 font-medium"
            value={userData.firstName}
            name="firstName"
            onChange={handleInput}
            id="firstName"
          />
        </div>
        <div className="flex flex-col my-2">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            className="border-2 p-1 rounded-md mt-1 border-b-emerald-100 font-medium"
            value={userData.lastName}
            name="lastName"
            onChange={handleInput}
            id="lastName"
          />
        </div>
        <div className="flex flex-col my-2">
          <label htmlFor="emailId">Email</label>
          <input
            type="text"
            className="border-2 p-1 rounded-md mt-1 border-b-emerald-100 font-medium"
            name="emailId"
            value={userData.emailId}
            onChange={handleInput}
            id="emailId"
          />
        </div>
        <div className="flex flex-col my-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            className="border-2 p-1 rounded-md mt-1 border-b-emerald-100 font-medium"
            value={userData.password}
            onChange={handleInput}
            id="password"
          />
        </div>
        <div className="flex items-center space-x-4 my-4">
          {/* 1. The Avatar Preview (Visual Feedback) */}
          <div className="shrink-0">
            <img
              className="h-14 w-14 object-cover rounded-full border border-gray-200"
              // Use the preview state if available, otherwise a default placeholder
              src={preview || "https://placehold.co/150?text=User"}
              alt="Avatar preview"
            />
          </div>

          {/* 2. The Minimal Input Label */}
          <label className="block cursor-pointer" htmlFor="avatar">
            <input
              type="file"
              name="avatar"
              id="avatar"
              onChange={handleImage}
              accept="image/*"
              className="block w-full text-sm text-slate-100
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-xs file:font-semibold

                file:bg-gray-700 file:text-gray-100
                hover:file:bg-gray-200
                hover:file:text-gray-700
                cursor-pointer
                "
            />
          </label>
        </div>
        <div className="flex flex-col my-2">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            name="age"
            className="border-2 p-1 rounded-md mt-1 border-b-emerald-100 font-medium"
            value={userData.age}
            onChange={handleInput}
            id="age"
          />
        </div>
        <div className="mb-4">
          {/* Replaces 'form-group' - adds margin bottom */}
          <label
            htmlFor="gender"
            className="block text-gray-700 text-sm font-bold mb-2" // Styles the label text
          >
            Gender
          </label>
          <div className="relative">
            <select
              name="gender"
              id="gender"
              value={userData.gender}
              onChange={handleInput}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            {/* Optional: Custom arrow icon for the dropdown (Tailwind quirk) */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-col my-2">
          <label htmlFor="about">About</label>
          <textarea
            type="text"
            id="about"
            name="about"
            className="border-2 p-1 rounded-md mt-1 border-b-emerald-100 font-medium"
            value={userData.about}
            onChange={handleInput}
          />
        </div>
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            onClick={handleUserRegister}
            className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition-colors cursor-pointer"
          >
            Register
          </button>
        </div>
        <div className="mb-2 mt-4 font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="hover:border-b-gray-700 hover:border-b-2 mx-1"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
