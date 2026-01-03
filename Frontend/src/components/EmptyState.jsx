import { Users, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-cyan-50 p-6 rounded-full mb-6 animate-pulse">
        <Users size={48} className="text-cyan-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-200 mb-2">
        Your circle is waiting
      </h2>
      <p className="text-gray-300 max-w-md mb-8">
        It looks like you haven't connected with anyone yet. Discover people
        with similar interests and start building your network.
      </p>
      <Link to="/explore">
        <button className="flex items-center gap-2 bg-cyan-700 text-white px-6 py-3 rounded-full font-medium hover:bg-cyan-800 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
          <Search size={18} />
          Find People
        </button>
      </Link>
    </div>
  );
};

export default EmptyState;
