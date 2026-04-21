import { useSelector } from "react-redux";

const Comment = () => {
  const user = useSelector((store) => store.user);

  return (
    <div>
      <div>
        <div>
            <img src={`${user?.profileImageUrl}`}/>
        </div>
        
      </div>
    </div>
  );
};

export default Comment;
