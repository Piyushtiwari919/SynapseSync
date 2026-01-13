import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { POSTS } from "../utils/constants.js";

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-[#09090b] bg-linear-to-b from-[#09090b] to-[#121215] text-white font-sans overflow-hidden pt-12 md:pt-0">
      
      <main className="max-w-7xl mx-auto px-6 h-full min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">
        <div className="flex-1 text-center md:text-left z-10 pt-10 md:pt-0">
          
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            Online and ready
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Your friends <br />
            are <span className="text-cyan-400">here.</span>
          </h1>
          
          <p className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-lg mx-auto md:mx-0">
            No algorithms deciding what you see. No ads cluttering your feed. 
            Just a simple place to share what you're up to.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <Link 
              to="/register" 
              className="h-14 px-8 rounded-full bg-white text-black text-lg font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
            >
              Join the community
              <ArrowRight size={20} />
            </Link>
            <Link 
              to="/login" 
              className="text-zinc-400 hover:text-white font-medium underline-offset-4 hover:underline transition-colors"
            >
              Log in to your account
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center md:justify-start gap-2 text-sm text-zinc-500">
             <div className="flex text-yellow-500">
               {[...Array(5)].map((_,i) => <Star key={i} size={14} fill="currentColor" />)}
             </div>
             <span>Loved by 5,000+ humans</span>
          </div>
        </div>
        <div className="flex-1 h-150 w-full relative overflow-hidden mask-gradient-y md:mask-gradient-none">
          <div className="absolute inset-0 z-10 bg-linear-to-b from-[#09090b] via-transparent to-[#09090b] pointer-events-none md:via-transparent"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full opacity-80">
            <div className="flex flex-col gap-4 animate-scroll-up">
              {[...POSTS, ...POSTS].map((post, idx) => (
                <div key={`col1-${idx}`} className={`p-4 rounded-2xl border backdrop-blur-sm ${post.color}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                      {post.user.charAt(0)}
                    </div>
                    <span className="font-bold text-sm">{post.user}</span>
                  </div>
                  <p className="text-sm leading-relaxed opacity-90">{post.content}</p>
                </div>
              ))}
            </div>
            <div className="hidden sm:flex flex-col gap-4 animate-scroll-down">
              {[...POSTS, ...POSTS].reverse().map((post, idx) => (
                <div key={`col2-${idx}`} className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-zinc-300">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold border border-zinc-700">
                      {post.user.charAt(0)}
                    </div>
                    <span className="font-bold text-sm text-white">{post.user}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{post.content}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default Home;