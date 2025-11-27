import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MessageSquare,
  Book,
  User,
  LogOut,
  Settings,
  Search,
  Star,
  PlusCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Aicharacter from "../Aicharacter/Aicharacter";

function Dashboard() {
  const [activePage, setActivePage] = useState("courses");
  const [aiCharacters, setAiCharacters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    createdAt: new Date(),
  });
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear any auth tokens or user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // You may want to clear other relevant data like:
    // localStorage.removeItem("enrolledCourses");

    // Then navigate to login page
    navigate("/login");
    window.location.reload();
  };

  const handleCreateCharacter = () => {
    setActivePage("create-character");
  };

  const handleLoadCourses = () => {
    navigate("/Morecourse");
  };

  const handleCharacterClick = (charId) => {
    setSelectedCharacter(charId);
    navigate(`/chat/${charId}`);
  };

  // Function to get character messages
  const getCharacterMessages = (characterId) => {
    return "Hello! I'm here to help you learn. What would you like to know about today?";
  };

  ///fetch user data from the server
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/userData", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response.data);
        if (response.data.success) {
          setUserData(
            response.data.user
              ? response.data.user
              : { username: "", email: "", name: "", createdAt: new Date() }
          );
        } else {
          alert("Something went wrong, please try again later.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Effect to simulate fetching courses from external source
  useEffect(() => {
    const fetchEnrolledCourses = () => {
      setLoading(true);
      try {
        const enrolled =
          JSON.parse(localStorage.getItem("enrolledCourses")) || [];
        setCourses(enrolled);
      } catch (error) {
        console.error("Error loading enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  // AI Characters
  useEffect(() => {
    const fetchAiCharacters = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/aiChar", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        //console.log(response.data);
        // Extract the allCharacters array from the response
        if (response.data && response.data.allCharacters) {
          setAiCharacters(response.data.allCharacters);
        } else {
          // If response structure is different, use the data directly if it's an array
          setAiCharacters(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.error("Error fetching AI characters:", error);
      }
    };

    fetchAiCharacters();
  }, []);

  // Filter characters based on search - with a safety check
  const filteredCharacters =
    aiCharacters && aiCharacters.length > 0
      ? aiCharacters.filter(
          (char) =>
            char.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            char.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            char.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  // Current character based on selection
  const currentCharacter = selectedCharacter
    ? aiCharacters.find(
        (char) =>
          char.charId === selectedCharacter || char._id === selectedCharacter
      )
    : null;

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <div className="w-64 p-4 flex flex-col bg-white border-r">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">Learning Portal</h2>
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-2 bg-blue-500 text-white">
              {userData?.name?.charAt(0)?.toUpperCase() ||
                userData?.username?.charAt(0)?.toUpperCase() ||
                ""}
            </div>
            <h3 className="font-medium">
              {userData.name || userData.username}
            </h3>
            <p className="text-sm text-gray-500">{userData.email}</p>
          </div>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActivePage("courses")}
                className={`flex items-center w-full p-2 rounded-lg ${
                  activePage === "courses" ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
              >
                <Book size={20} className="mr-3" />
                <span>My Courses</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("ai-characters")}
                className={`flex items-center w-full p-2 rounded-lg ${
                  activePage === "ai-characters"
                    ? "bg-gray-200"
                    : "hover:bg-gray-200"
                }`}
              >
                <MessageSquare size={20} className="mr-3" />
                <span>AI Characters</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleCreateCharacter}
                className={`flex items-center w-full p-2 rounded-lg ${
                  activePage === "create-character"
                    ? "bg-gray-200"
                    : "hover:bg-gray-200"
                }`}
              >
                <PlusCircle size={20} className="mr-3" />
                <span>Create AI Character</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("profile")}
                className={`flex items-center w-full p-2 rounded-lg ${
                  activePage === "profile" ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
              >
                <User size={20} className="mr-3" />
                <span>Profile</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full p-2 rounded-lg hover:bg-gray-200"
          >
            <LogOut size={20} className="mr-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activePage === "courses" && (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">My Courses</h1>

            {loading ? (
              <div className="flex flex-col items-center justify-center p-12">
                <div className="w-16 h-16 border-4 border-t-blue-500 rounded-full animate-spin mb-4 border-gray-200"></div>
                <p className="text-lg">Loading...</p>
              </div>
            ) : courses && courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="p-6 rounded-lg bg-white shadow-md"
                  >
                    <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-lg text-center bg-white shadow-md">
                <h3 className="text-lg mb-2">No courses found</h3>
                <p className="mb-4 text-gray-500">
                  Your enrolled courses will appear here.
                </p>
                <button
                  onClick={handleLoadCourses}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg max-w-xs mx-auto"
                >
                  Browse Course Catalog
                </button>
              </div>
            )}
          </div>
        )}

        {activePage === "ai-characters" && (
          <div className="p-6 h-full">
            <h1 className="text-2xl font-bold mb-6">AI Characters</h1>

            {/* Search bar */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg"
                  placeholder="Search characters by name or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Loading state */}
            {aiCharacters.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12">
                <div className="w-16 h-16 border-4 border-t-blue-500 rounded-full animate-spin mb-4 border-gray-200"></div>
                <p className="text-lg">Loading characters...</p>
              </div>
            )}

            {/* AI Characters grid */}
            {aiCharacters.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCharacters.map((character) => (
                  <div
                    key={character.charId || character._id}
                    className="p-6 rounded-lg bg-white shadow-md"
                  >
                    <img
                      src={character.image || "/api/placeholder/300/300"}
                      alt={character.name}
                      className="w-full h-48 object-cover rounded-t-lg mb-4"
                    />
                    <h3 className="text-lg font-bold mb-2">{character.name}</h3>
                    <p className="mb-4 text-gray-500">
                      {character.description}
                    </p>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
                      onClick={() =>
                        handleCharacterClick(character.charId || character._id)
                      }
                    >
                      Talk to {character.name}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Show message if no characters found */}
            {aiCharacters.length > 0 && filteredCharacters.length === 0 && (
              <div className="p-8 rounded-lg text-center bg-white shadow-md">
                <h3 className="text-lg mb-2">No characters found</h3>
                <p className="mb-4 text-gray-500">
                  Try adjusting your search query.
                </p>
              </div>
            )}
          </div>
        )}

        {activePage === "profile" && (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
            <div className="p-6 rounded-lg bg-white shadow-md">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mr-4 bg-blue-500 text-white">
                  {userData.username?.charAt(0)?.toUpperCase() || ""}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{userData.username}</h2>
                  <p className="text-gray-500">{userData.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Account Information</h3>
                  <div className="p-4 rounded-lg bg-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Username</p>
                        <p>{userData.username}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p>{userData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p>{userData.createdAt?.toString() || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Learning Statistics</h3>
                  <div className="p-4 rounded-lg bg-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">
                          {courses ? courses.length : 0}
                        </p>
                        <p className="text-sm text-gray-500">
                          Courses Enrolled
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">20</p>
                        <p className="text-sm text-gray-500">Hours Spent</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-sm text-gray-500">
                          Certificates Earned
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activePage === "create-character" && (
          <div className="p-6">
            <Aicharacter />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
