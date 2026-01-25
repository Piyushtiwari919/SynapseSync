import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addRequestsRecieved } from "../../store/requestSlice.js";
import UserRequestSkeleton from "./UserRequestSkeleton.jsx";
import ErrorState from "./ErrorState.jsx";
import EmptyRequestState from "./EmptyRequestState.jsx";
import UserRequestCard from "./UserRequestRecievedCard.jsx";

const RequestRecieved = () => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const connectionRequestsReceived = useSelector(
    (store) => store.requests?.requestsRecieved,
  );

  const getRequestsRecieved = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/request/received`,
        { withCredentials: true },
      );

      setIsError(false);
      dispatch(addRequestsRecieved(res.data?.connectionRequestsReceived));
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRequestsRecieved();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {[...Array(4)].map((_, i) => (
          <UserRequestSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={getRequestsRecieved} isConnection={false} />;
  }
  if (!connectionRequestsReceived || connectionRequestsReceived.length === 0) {
    return <EmptyRequestState />;
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {connectionRequestsReceived.map((request) => (
        <UserRequestCard key={request._id} user={request} />
      ))}
    </div>
  );
};

export default RequestRecieved;
