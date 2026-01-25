import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addRequestsSend } from "../../store/requestSlice";
import UserRequestSkeleton from "./UserRequestSkeleton.jsx";
import ErrorState from "./ErrorState.jsx";
import EmptyRequestState from "./EmptyRequestState.jsx";
import UserRequestSendCard from "./UserRequestSendCard.jsx";

const RequestSend = () => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const connectionRequestsSend = useSelector(
    (store) => store.requests?.requestsSend,
  );

  const getRequestsSend = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/request/send`,
        { withCredentials: true },
      );

      setIsError(false);
      dispatch(addRequestsSend(res?.data?.connectionRequestsSend));
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRequestsSend();
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
    return <ErrorState onRetry={getRequestsSend} isConnection={false} />;
  }
  if (!connectionRequestsSend || connectionRequestsSend.length === 0) {
    return <EmptyRequestState />;
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {connectionRequestsSend.map((request) => (
        <UserRequestSendCard key={request._id} user={request} />
      ))}
    </div>
  );
};

export default RequestSend;
