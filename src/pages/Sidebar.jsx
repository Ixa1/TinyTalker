import { NavLink } from 'react-router-dom';
import { FaBook, FaTrophy, FaPuzzlePiece, FaUserGraduate, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="h-screen w-60 bg-[#fff4d8] flex flex-col items-center py-6 gap-4 shadow-lg">
      <div className="text-2xl font-bold text-orange-500 flex items-center gap-2 mb-8">
        <span>✨</span> Tiny Talker
      </div>

      <NavLink
        to="/learn"
        className={({ isActive }) =>
          `w-44 py-2 rounded-lg flex items-center gap-2 px-4 ${
            isActive ? 'bg-white border-l-4 border-blue-400 font-semibold text-blue-600' : 'bg-white'
          }`
        }
      >
        <FaBook className="text-blue-500" />
        Learn
      </NavLink>

      <NavLink
        to="/leaderboard"
        className={({ isActive }) =>
          `w-44 py-2 rounded-lg flex items-center gap-2 px-4 ${
            isActive ? 'bg-yellow-200 font-semibold text-yellow-800' : 'bg-white'
          }`
        }
      >
        <FaTrophy className="text-yellow-600" />
        Leaderboard
      </NavLink>

      <NavLink
        to="/quests"
        className={({ isActive }) =>
          `w-44 py-2 rounded-lg flex items-center gap-2 px-4 ${
            isActive ? 'bg-green-100 font-semibold text-green-700' : 'bg-white'
          }`
        }
      >
        <FaPuzzlePiece className="text-green-500" />
        Quests
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `w-44 py-2 rounded-lg flex items-center gap-2 px-4 ${
            isActive ? 'bg-yellow-300 font-semibold text-orange-700' : 'bg-white'
          }`
        }
      >
        <FaUserGraduate className="text-black" />
        Profile
      </NavLink>

      <NavLink
        to="/more"
        className={({ isActive }) =>
          `w-44 py-2 rounded-lg flex items-center gap-2 px-4 ${
            isActive ? 'bg-gray-200 font-semibold text-gray-700' : 'bg-white'
          }`
        }
      >
        <FaCog className="text-gray-600" />
        More
      </NavLink>
    </div>
  );
};

export default Sidebar;
