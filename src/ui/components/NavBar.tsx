import { Music } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";

export const NavBar = () => {
  const location = useLocation();
  const [isGameMode, setIsGameMode] = useState(false);

  useEffect(() => {
    setIsGameMode(location.pathname === "/practice");
  }, [location.pathname]);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Music className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">
              Guitar Fretboard Trainer
            </h1>
          </div>
          <Link
            to={isGameMode ? "/" : "/practice"}
            onClick={() => setIsGameMode(!isGameMode)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isGameMode ? "Main Page" : "Practice Mode"}
          </Link>
        </div>
      </div>
    </header>
  );
};
