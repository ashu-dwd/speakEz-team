import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Book,
  User,
  Mail,
  LogOut,
  Moon,
  Sun,
  Settings,
  Star,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("courses");
  const [selectedCharacter, setSelectedCharacter] = useState(2); // Professor Ada selected by default
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleSignOut = () => {
    navigate("/login");
  };
  const handleLoadCourses = () => {
    navigate("/Morecourse");
  };

  // Mock user data
  const userData = {
    username: "AlexJohnson",
    email: "alex.johnson@example.com",
  };

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
  const aiCharacters = [
    {
      id: 1,
      name: "Morgan Analyst",
      type: "Businessman",
      description: "Financial expert AI assistant with corporate knowledge",
      image: "/api/placeholder/300/300",
      rating: 4.8,
      avatar: "👨‍💼",
    },
    {
      id: 2,
      name: "Professor Ada",
      type: "Teacher",
      description: "Patient educator focused on academic subjects",
      image: "/api/placeholder/300/300",
      rating: 4.9,
      avatar: "👩‍🏫",
    },
    {
      id: 3,
      name: "Chef Oliver",
      type: "Creative",
      description: "Culinary expert with thousands of recipes",
      image: "/api/placeholder/300/300",
      rating: 4.7,
      avatar: "👨‍🍳",
    },
    {
      id: 4,
      name: "Dr. Watson",
      type: "Medical",
      description: "Healthcare assistant with medical knowledge",
      image: "/api/placeholder/300/300",
      rating: 4.6,
      avatar: "👨‍⚕️",
    },
    {
      id: 5,
      name: "Coach Alex",
      type: "Fitness",
      description: "Personal trainer with customized workout plans",
      image: "/api/placeholder/300/300",
      rating: 4.5,
      avatar: "🏋️‍♀️",
    },
    {
      id: 6,
      name: "Emma Writer",
      type: "Creative",
      description: "Storyteller and content creation assistant",
      image: "/api/placeholder/300/300",
      rating: 4.8,
      avatar: "✍️",
    },
    {
      id: 7,
      name: "Tech Support Tim",
      type: "Technical",
      description: "IT troubleshooter and technology guide",
      image: "/api/placeholder/300/300",
      rating: 4.3,
      avatar: "👨‍💻",
    },
    {
      id: 8,
      name: "Legal Lucy",
      type: "Businessman",
      description: "Legal assistant with contract knowledge",
      image: "/api/placeholder/300/300",
      rating: 4.7,
      avatar: "⚖️",
    },
  ];

  // Filter characters based on search
  const filteredCharacters = aiCharacters.filter(
    (char) =>
      char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get the selected character
  const currentCharacter = aiCharacters.find(
    (char) => char.id === selectedCharacter
  );

  // Sample messages for each character
  const getCharacterMessages = (charId) => {
    const messages = {
      1: "Let's analyze your financial portfolio. I notice some potential for optimizing your investments.",
      2: "Welcome back to our learning session! Would you like to continue with React hooks?",
      3: "I found some delicious recipes based on the ingredients you have. Shall we cook something special?",
      4: "Remember to maintain a healthy lifestyle. What health topics can I help you with today?",
      5: "Great job with your fitness progress! Ready for today's workout plan?",
      6: "I've drafted the story outline you requested. Let's review the character development.",
      7: "Your system diagnostics look good. Any technical issues I can help troubleshoot?",
      8: "I've reviewed the contract clauses you sent. Let me summarize the key legal points.",
    };
    return messages[charId] || "How can I assist you today?";
  };

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`w-64 p-4 flex flex-col ${
          darkMode ? "bg-gray-800" : "bg-white"
        } border-r`}
      >
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">Learning Portal</h2>

          <div className="flex flex-col items-center mb-6">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-2 ${
                darkMode ? "bg-blue-600" : "bg-blue-500"
              } text-white`}
            >
              {userData.username.charAt(0)}
            </div>
            <h3 className="font-medium">{userData.username}</h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {userData.email}
            </p>
          </div>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActivePage("courses")}
                className={`flex items-center w-full p-2 rounded-lg ${
                  activePage === "courses"
                    ? darkMode
                      ? "bg-gray-700"
                      : "bg-gray-200"
                    : "hover:bg-gray-200 hover:bg-opacity-20"
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
                    ? darkMode
                      ? "bg-gray-700"
                      : "bg-gray-200"
                    : "hover:bg-gray-200 hover:bg-opacity-20"
                }`}
              >
                <MessageSquare size={20} className="mr-3" />
                <span>AI Characters</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("profile")}
                className={`flex items-center w-full p-2 rounded-lg ${
                  activePage === "profile"
                    ? darkMode
                      ? "bg-gray-700"
                      : "bg-gray-200"
                    : "hover:bg-gray-200 hover:bg-opacity-20"
                }`}
              >
                <User size={20} className="mr-3" />
                <span>Profile</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-200 border-opacity-30">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center w-full p-2 mb-2 rounded-lg ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            {darkMode ? (
              <Sun size={20} className="mr-3" />
            ) : (
              <Moon size={20} className="mr-3" />
            )}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button
            onClick={handleSignOut}
            className={`flex items-center w-full p-2 rounded-lg ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
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
                <div
                  className={`w-16 h-16 border-4 border-t-blue-500 rounded-full animate-spin mb-4 ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                ></div>
                <p className="text-lg">Loading...</p>
              </div>
            ) : courses && courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className={`p-6 rounded-lg ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } shadow-md`}
                  >
                    <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                    <div className="mb-4">
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`p-8 rounded-lg text-center ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow-md`}
              >
                <h3 className="text-lg mb-2">No courses found</h3>
                <p
                  className={`mb-4 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
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
          <div className="p-6 h-full flex flex-col">
            <h1 className="text-2xl font-bold mb-6">AI Characters</h1>

            {selectedCharacter ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div
                      className={`w-16 h-16 flex items-center justify-center text-2xl rounded-full mr-4 ${
                        darkMode ? "bg-indigo-600" : "bg-indigo-500"
                      } text-white`}
                    >
                      {currentCharacter.avatar}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h2 className="text-xl font-bold">
                          {currentCharacter.name}
                        </h2>
                        <div className="flex items-center ml-2">
                          <Star
                            size={16}
                            className="text-yellow-400 fill-yellow-400"
                          />
                          <span className="ml-1">
                            {currentCharacter.rating}
                          </span>
                        </div>
                      </div>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {currentCharacter.type}
                      </p>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      >
                        {currentCharacter.description}
                      </p>
                    </div>
                  </div>
                  <button
  onClick={() => setSelectedCharacter(null)}
  className={`h-8 px-2 text-xs font-medium rounded ${
    darkMode
      ? "bg-gray-700 hover:bg-gray-600 text-white"
      : "bg-green-600 hover:bg-green-700 text-white"
  }`}
  style={{ minWidth:'auto', maxWidth: 'fit-content', width: 'auto' }}
> Change
</button>

                </div>

                <div
                  className={`flex-1 ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } rounded-lg p-4 mb-4 overflow-auto`}
                >
                  <div className="flex items-start mb-4">
                    <div
                      className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center ${
                        darkMode ? "bg-indigo-600" : "bg-indigo-500"
                      } text-white text-lg`}
                    >
                      {currentCharacter.avatar}
                    </div>
                    <div
                      className={`p-3 rounded-lg max-w-3xl ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <p>{getCharacterMessages(currentCharacter.id)}</p>
                    </div>
                  </div>

                  <div className="flex items-start mb-4 flex-row-reverse">
                    <div
                      className={`w-10 h-10 rounded-full ml-3 flex items-center justify-center ${
                        darkMode ? "bg-blue-600" : "bg-blue-500"
                      } text-white`}
                    >
                      {userData.username.charAt(0)}
                    </div>
                    <div
                      className={`p-3 rounded-lg max-w-3xl ${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <p>
                        Hi {currentCharacter.name}! Can you help me with
                        something?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder={`Message ${currentCharacter.name}...`}
                    className={`flex-grow p-3 rounded-l-lg ${
                      darkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-300"
                    } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  <button className="bg-green-600 text-white px-3 py-1 rounded-r-lg hover:bg-green-700 text-sm shrink-0 w-auto">
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Search characters by name, type, or description..."
                    className={`w-full p-3 pl-10 rounded-lg ${
                      darkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search
                    size={18}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredCharacters.map((character) => (
                    <div
                      key={character.id}
                      className={`${
                        darkMode ? "bg-gray-800" : "bg-white"
                      } rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105`}
                      onClick={() => setSelectedCharacter(character.id)}
                    >
                      <div className="relative aspect-square">
                        <img
                          src={character.image}
                          alt={character.name}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className={`absolute top-2 right-2 flex items-center py-1 px-2 rounded-full ${
                            darkMode ? "bg-gray-800" : "bg-white"
                          } shadow-md`}
                        >
                          <Star
                            size={14}
                            className="text-yellow-400 fill-yellow-400"
                          />
                          <span className="ml-1 text-sm">
                            {character.rating}
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 flex items-center p-2 bg-gradient-to-t from-black to-transparent">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mr-2 ${
                              darkMode ? "bg-indigo-600" : "bg-indigo-500"
                            } text-white`}
                          >
                            {character.avatar}
                          </div>
                          <div className="text-white">
                            <h3 className="font-bold text-sm">
                              {character.name}
                            </h3>
                            <p className="text-xs opacity-80">
                              {character.type}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <p
                          className={`text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {character.description}
                        </p>
                        <button
                          className={`w-2/3 mx-auto block mt-2 py-1.5 rounded-lg ${
                            darkMode
                              ? "bg-indigo-600 hover:bg-indigo-700"
                              : "bg-indigo-500 hover:bg-indigo-600"
                          } text-white text-sm`}
                        >
                          Chat Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activePage === "profile" && (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
            <div
              className={`p-6 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-md`}
            >
              <div className="flex items-center mb-6">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mr-4 ${
                    darkMode ? "bg-blue-600" : "bg-blue-500"
                  } text-white`}
                >
                  {userData.username.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{userData.username}</h2>
                  <p
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {userData.email}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Account Information</h3>
                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Username
                        </p>
                        <p>{userData.username}</p>
                      </div>
                      <div>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Email
                        </p>
                        <p>{userData.email}</p>
                      </div>
                      <div>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Member Since
                        </p>
                        <p>January 15, 2025</p>
                      </div>
                      <div>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Subscription
                        </p>
                        <p>Premium Plan</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Learning Statistics</h3>
                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">
                          {courses ? courses.length : 0}
                        </p>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Courses Enrolled
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">20</p>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Hours Spent
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">12</p>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
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
      </div>
    </div>
  );
}

export default Dashboard;
