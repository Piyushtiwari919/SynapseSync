import ConnectedUserCard from "./ConnectedUserCard.jsx";
import EmptyState from "./EmptyConnectionState";

const UserNetwork = ({ connections }) => {
  if (connections.length === 0) {
    return (
      <div>
        <EmptyState />
      </div>
    );
  }
  return (
    <div>
      <div className="flex gap-10 items-center flex-wrap justify-center">
        {connections.map((connection) => {
          return <ConnectedUserCard user={connection} key={connection._id}/>;
        })}
      </div>
    </div>
  );
};

export default UserNetwork;
