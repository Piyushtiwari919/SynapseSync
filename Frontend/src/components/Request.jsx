import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequestsRecieved } from "../../store/requestSlice.js";
import ErrorState from "./ErrorState";
import EmptyRequestsState from "./EmptyRequestState.jsx";
import axios from "axios";

const Request = () => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const connectionRequestsReceived = useSelector((store) => store.requests);

  const getRequests = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/request/received`,
        { withCredentials: true }
      );

      dispatch(addRequestsRecieved(res.data?.connectionRequestsReceived));
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  if (error) {
    <ErrorState onRetry={getRequests} isConnection={false} />;
  }

  if (isLoading) {
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 text-sm font-medium animate-pulse">
        Finding people...
      </p>
    </div>;
  }
  return !connectionRequestsReceived ||
    connectionRequestsReceived.length == 0 ? (
    <EmptyRequestsState />
  ) : (
    "(Profile Cards)"
  );
};

export default Request;
