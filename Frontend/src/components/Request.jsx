import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequestsRecieved } from "../../store/requestSlice.js";
import UserRequestCard from "./UserRequestCard.jsx";
import ErrorState from "./ErrorState";
import EmptyRequestsState from "./EmptyRequestState.jsx";
import axios from "axios";
import UserRequestSkeleton from "./UserRequestSkeleton.jsx";

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
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="h-8 w-48 bg-gray-800 rounded-full mb-8 mx-auto md:mx-0 animate-pulse"></div>
        <div className="flex flex-wrap justify-center gap-3 md:gap-6">
          {/* Create an array of 4 items to map over */}
          {[...Array(4)].map((_, i) => (
            <UserRequestSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }
  return !connectionRequestsReceived ||
    connectionRequestsReceived.length == 0 ? (
    <EmptyRequestsState />
  ) : (
    <>
      <div className="max-w-7xl mx-auto px-2 py-8">
        <div className="flex items-baseline justify-between mb-6 px-4 max-w-4xl mx-auto border-b border-gray-800 pb-4">
          <h1 className="text-2xl font-bold text-gray-100">Invitations</h1>
          <span className="text-sm text-gray-500">Recieved Requests</span>
        </div>
        <div className="flex flex-wrap justify-center gap-3 md:gap-6">
          {connectionRequestsReceived.map((request) => (
            <UserRequestCard key={request._id} user={request} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Request;
