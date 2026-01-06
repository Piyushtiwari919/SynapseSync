import { Users, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyRequestsState = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12 px-4 animate-in fade-in duration-700">
      
      {/* Visual Container: Layered Glow Effect */}
      <div className="relative mb-8 group">
        {/* Background Glow (Outer) */}
        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl transform group-hover:scale-110 transition-transform duration-700"></div>
        
        {/* Middle Ring */}
        <div className="relative bg-linear-to-b from-gray-800 to-gray-900 border border-gray-700/50 p-6 rounded-full shadow-2xl">
          {/* Inner Circle with Icon */}
          <div className="bg-gray-800 p-4 rounded-full border border-gray-700 relative overflow-hidden">
             {/* Subtle shine effect inside the circle */}
            <div className="absolute inset-0 bg-linear-to-tr from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <Users size={40} className="text-cyan-400 relative z-10" />
            
            {/* Decorative decorative element: Sparkle */}
            <Sparkles 
              size={16} 
              className="absolute top-3 right-3 text-yellow-300 animate-pulse" 
              style={{ animationDuration: '3s' }}
            />
          </div>
        </div>

        {/* Floating Decorative Elements representing 'waiting' signals */}
        <div className="absolute -right-2 top-0 w-3 h-3 bg-cyan-500 rounded-full animate-ping opacity-75"></div>
      </div>

      {/* Typography Section */}
      <div className="max-w-md text-center space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-100 to-gray-400">
          No pending requests
        </h2>
        
        <p className="text-gray-400 text-base leading-relaxed">
          Your inbox is all caught up! This is the perfect time to explore the community and find people who share your vibe.
        </p>
      </div>

      {/* Action Section */}
      <div className="mt-8">
        <Link to="/explore">
          <button className="group relative inline-flex items-center gap-3 bg-cyan-600/10 hover:bg-cyan-600 text-cyan-400 hover:text-white px-8 py-3.5 rounded-full font-medium transition-all duration-300 border border-cyan-600/50 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <Search size={18} className="group-hover:scale-110 transition-transform" />
            <span>Discover People</span>
            
            {/* Subtle arrow that appears on hover */}
            <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0">
              &rarr;
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EmptyRequestsState;