import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Users,
  Grid,
  List,
  ChevronDown,
  X,
  Menu,
  Star,
  StarOff,
  Info,
} from "lucide-react";

// Sample AI character data
const aiCharacters = [
  {
    id: 1,
    name: "Morgan Analyst",
    type: "Businessman",
    description: "Financial expert AI assistant with corporate knowledge",
    image: "/api/placeholder/300/300",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Professor Ada",
    type: "Teacher",
    description: "Patient educator focused on academic subjects",
    image: "/api/placeholder/300/300",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Chef Oliver",
    type: "Creative",
    description: "Culinary expert with thousands of recipes",
    image: "/api/placeholder/300/300",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Dr. Watson",
    type: "Medical",
    description: "Healthcare assistant with medical knowledge",
    image: "/api/placeholder/300/300",
    rating: 4.6,
  },
  {
    id: 5,
    name: "Coach Alex",
    type: "Fitness",
    description: "Personal trainer with customized workout plans",
    image: "/api/placeholder/300/300",
    rating: 4.5,
  },
  {
    id: 6,
    name: "Emma Writer",
    type: "Creative",
    description: "Storyteller and content creation assistant",
    image: "/api/placeholder/300/300",
    rating: 4.8,
  },
  {
    id: 7,
    name: "Tech Support Tim",
    type: "Technical",
    description: "IT troubleshooter and technology guide",
    image: "/api/placeholder/300/300",
    rating: 4.3,
  },
  {
    id: 8,
    name: "Legal Lucy",
    type: "Businessman",
    description: "Legal assistant with contract knowledge",
    image: "/api/placeholder/300/300",
    rating: 4.7,
  },
];

export default function AICharactersDashboard() {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortOption, setSortOption] = useState("name-asc");
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileFiltersOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get unique character types for filter dropdown
  const characterTypes = [
    "All",
    ...new Set(aiCharacters.map((char) => char.type)),
  ];

  // Toggle favorite status
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Handle character selection
  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character);
    setShowModal(true);
  };

  // Sort and filter characters
  const sortedAndFilteredCharacters = [...aiCharacters]
    .filter((character) => {
      const matchesSearch =
        character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        character.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        selectedType === "All" || character.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "rating-high":
          return b.rating - a.rating;
        case "rating-low":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  // Group characters by type
  const groupedCharacters = sortedAndFilteredCharacters.reduce(
    (groups, character) => {
      if (!groups[character.type]) {
        groups[character.type] = [];
      }
      groups[character.type].push(character);
      return groups;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setMobileFiltersOpen(false)}
          ></div>
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Filter Options */}
            <div className="px-4 mt-4">
              <h3 className="text-sm font-medium text-gray-500">
                Character Type
              </h3>
              <div className="mt-2 space-y-2">
                {characterTypes.map((type) => (
                  <div key={type} className="flex items-center">
                    <button
                      className={`px-3 py-2 text-sm font-medium rounded-md w-full text-left 
                      ${
                        selectedType === type
                          ? "bg-blue-100 text-blue-800"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setSelectedType(type);
                        setMobileFiltersOpen(false);
                      }}
                    >
                      {type}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 mt-6">
              <h3 className="text-sm font-medium text-gray-500">Sort By</h3>
              <div className="mt-2 space-y-2">
                {[
                  { value: "name-asc", label: "Name (A-Z)" },
                  { value: "name-desc", label: "Name (Z-A)" },
                  { value: "rating-high", label: "Highest Rating" },
                  { value: "rating-low", label: "Lowest Rating" },
                ].map((option) => (
                  <div key={option.value} className="flex items-center">
                    <button
                      className={`px-3 py-2 text-sm font-medium rounded-md w-full text-left 
                      ${
                        sortOption === option.value
                          ? "bg-blue-100 text-blue-800"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setSortOption(option.value);
                        setMobileFiltersOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 mt-6">
              <h3 className="text-sm font-medium text-gray-500">View</h3>
              <div className="mt-2 flex gap-2">
                <button
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2
                  ${
                    viewMode === "grid"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => {
                    setViewMode("grid");
                    setMobileFiltersOpen(false);
                  }}
                >
                  <Grid className="h-4 w-4" /> Grid
                </button>
                <button
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2
                  ${
                    viewMode === "list"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => {
                    setViewMode("list");
                    setMobileFiltersOpen(false);
                  }}
                >
                  <List className="h-4 w-4" /> List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Character Detail Modal */}
      {showModal && selectedCharacter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedCharacter.name}
              </h3>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowModal(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <img
                    src={selectedCharacter.image}
                    alt={selectedCharacter.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-yellow-500 font-medium">
                        {selectedCharacter.rating}
                      </span>
                      <div className="ml-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(selectedCharacter.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => toggleFavorite(selectedCharacter.id)}
                    >
                      {favorites.includes(selectedCharacter.id) ? (
                        <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {selectedCharacter.type}
                    </span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    About
                  </h4>
                  <p className="text-gray-600 mb-6">
                    {selectedCharacter.description}
                  </p>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Capabilities
                  </h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Advanced natural language processing</li>
                    <li>
                      Domain-specific knowledge in{" "}
                      {selectedCharacter.type.toLowerCase()} field
                    </li>
                    <li>Personalized responses based on user needs</li>
                    <li>Continuous learning from interactions</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => {
                    alert(`${selectedCharacter.name} selected!`);
                    setShowModal(false);
                  }}
                >
                  Select Character
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                AI Characters Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Browse and manage your AI characters by personality type
              </p>
            </div>
            {/* Mobile Filter Button */}
            <button
              className="mt-4 sm:mt-0 md:hidden px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm flex items-center gap-2 text-gray-700"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <Menu className="h-5 w-5" /> Filters & Sort
            </button>
          </div>
        </div>

        {/* Controls Row - Desktop */}
        <div className="hidden md:flex flex-wrap gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-grow min-w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search characters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="w-48">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Character Type
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {characterTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 top-6 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="w-48">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="rating-high">Highest Rating</option>
                <option value="rating-low">Lowest Rating</option>
              </select>
              <div className="absolute inset-y-0 right-0 top-6 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-end">
            <div className="flex h-10">
              <button
                className={`px-4 py-2 rounded-l-lg border border-gray-300 ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                className={`px-4 py-2 rounded-r-lg border border-gray-300 border-l-0 ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mb-4 md:hidden">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search characters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Active Filters */}
        {(selectedType !== "All" || searchTerm) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedType !== "All" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {selectedType}
                <button
                  className="ml-1 text-blue-600 hover:text-blue-800"
                  onClick={() => setSelectedType("All")}
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Search: {searchTerm}
                <button
                  className="ml-1 text-blue-600 hover:text-blue-800"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="space-y-8">
          {Object.keys(groupedCharacters).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow">
              <Users className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No characters found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            Object.entries(groupedCharacters).map(([type, characters]) => (
              <div
                key={type}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    {type}
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {characters.length}
                    </span>
                  </h2>
                </div>

                {viewMode === "grid" ? (
                  <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {characters.map((character) => (
                      <div
                        key={character.id}
                        className="group bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="relative">
                          <img
                            src={character.image}
                            alt={character.name}
                            className="w-full h-48 object-cover"
                          />
                          <button
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(character.id);
                            }}
                          >
                            {favorites.includes(character.id) ? (
                              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <Star className="h-5 w-5 text-gray-400 hover:text-yellow-400" />
                            )}
                          </button>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              {character.name}
                            </h3>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              <span className="ml-1 text-sm text-gray-600">
                                {character.rating}
                              </span>
                            </div>
                          </div>
                          <span className="inline-block mt-1 mb-2 px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {character.type}
                          </span>
                          <p className="text-gray-600 text-sm mb-3">
                            {character.description}
                          </p>
                          <button
                            onClick={() => handleSelectCharacter(character)}
                            className="mt-2 w-full px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition-colors duration-300"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {characters.map((character) => (
                      <li
                        key={character.id}
                        className="px-4 md:px-6 py-4 flex items-center hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSelectCharacter(character)}
                      >
                        <div className="relative mr-4">
                          <img
                            src={character.image}
                            alt={character.name}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                          <button
                            className="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(character.id);
                            }}
                          >
                            {favorites.includes(character.id) ? (
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <Star className="h-4 w-4 text-gray-400 hover:text-yellow-400" />
                            )}
                          </button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base md:text-lg font-medium text-gray-900 truncate">
                              {character.name}
                            </h3>
                            <div className="flex items-center ml-2">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              <span className="ml-1 text-sm text-gray-600">
                                {character.rating}
                              </span>
                            </div>
                          </div>
                          <span className="inline-block mt-1 mb-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {character.type}
                          </span>
                          <p className="text-sm text-gray-500 truncate">
                            {character.description}
                          </p>
                        </div>
                        <button
                          className="ml-4 hidden sm:block bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-md text-sm font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCharacter(character);
                          }}
                        >
                          View Details
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
