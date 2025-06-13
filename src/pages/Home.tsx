
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book, Heart, Sparkles } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-peach-50 to-purple-50">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Book className="text-pink-500 w-8 h-8" />
          <h1 className="text-2xl font-bold text-pink-600 font-serif">ReadRoom</h1>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost" className="text-pink-600 hover:bg-pink-100">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-4 mb-6">
            <Sparkles className="text-purple-400 w-8 h-8 animate-pulse" />
            <Book className="text-pink-500 w-10 h-10" />
            <Heart className="text-rose-400 w-8 h-8 animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 font-serif">
            Find Your Next
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              {" "}Perfect Read
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Chat with our friendly book bot to discover amazing stories based on your mood, 
            favorite genres, or beloved authors. Your cozy corner for book recommendations awaits! 📚✨
          </p>
          
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Discovering Books 💕
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-lg border border-pink-100">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Mood-Based</h3>
            <p className="text-gray-600">
              Feeling happy, sad, or adventurous? Get book recommendations that match your current vibe perfectly.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-lg border border-purple-100">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Genre Explorer</h3>
            <p className="text-gray-600">
              From fantasy to romance, mystery to sci-fi - discover new worlds in your favorite genres.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-lg border border-rose-100">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Author Favorites</h3>
            <p className="text-gray-600">
              Love a particular author? Find similar writers and discover your next literary obsession.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur border-t border-pink-100 py-8 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600 text-lg">
            Made with ❤️ for book lovers. Chat, discover, and fall in love with stories.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
