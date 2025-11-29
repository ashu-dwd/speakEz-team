import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { FaArrowRight, FaMicrophone, FaVideo, FaBrain } from "react-icons/fa";

/**
 * Interview Setup Page - Configure preferences before starting interview
 */
const InterviewSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [formData, setFormData] = useState({
    jobType: "software_engineer",
    experienceLevel: "entry",
    difficulty: "intermediate",
    focusAreas: ["technical_skills", "behavioral"],
    duration: 30,
  });

  // Load user preferences on component mount
  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const response = await axios.get("/interviews/preferences");
      if (response.data.success) {
        const userPrefs = response.data.data.defaultPreferences;
        setPreferences(response.data.data);
        setFormData({
          jobType: userPrefs.jobType || "software_engineer",
          experienceLevel: userPrefs.experienceLevel || "entry",
          difficulty: userPrefs.difficulty || "intermediate",
          focusAreas: userPrefs.focusAreas || [
            "technical_skills",
            "behavioral",
          ],
          duration: userPrefs.duration || 30,
        });
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
      // Continue with default values
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFocusAreaChange = (area, checked) => {
    setFormData((prev) => ({
      ...prev,
      focusAreas: checked
        ? [...prev.focusAreas, area]
        : prev.focusAreas.filter((a) => a !== area),
    }));
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      await axios.put("/interviews/preferences", {
        defaultPreferences: formData,
      });
      // Continue to create session
      await createInterviewSession();
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const createInterviewSession = async () => {
    try {
      const response = await axios.post("/interviews", {
        preferences: formData,
      });

      if (response.data.success) {
        // Navigate to interview room with session ID
        navigate(`/interview/${response.data.data.sessionId}`);
      }
    } catch (error) {
      console.error("Error creating interview session:", error);
      alert("Failed to create interview session. Please try again.");
    }
  };

  const jobTypeOptions = [
    { value: "software_engineer", label: "Software Engineer" },
    { value: "data_scientist", label: "Data Scientist" },
    { value: "product_manager", label: "Product Manager" },
    { value: "designer", label: "Designer" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "other", label: "Other" },
  ];

  const experienceLevelOptions = [
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "mid", label: "Mid Level (3-5 years)" },
    { value: "senior", label: "Senior Level (6+ years)" },
    { value: "executive", label: "Executive Level" },
  ];

  const difficultyOptions = [
    { value: "beginner", label: "Beginner - Basic questions, gentle pace" },
    {
      value: "intermediate",
      label: "Intermediate - Standard interview questions",
    },
    { value: "advanced", label: "Advanced - Challenging, in-depth questions" },
  ];

  const focusAreaOptions = [
    { value: "technical_skills", label: "Technical Skills", icon: FaBrain },
    { value: "behavioral", label: "Behavioral Questions", icon: FaMicrophone },
    { value: "problem_solving", label: "Problem Solving", icon: FaBrain },
    { value: "communication", label: "Communication", icon: FaMicrophone },
    { value: "leadership", label: "Leadership", icon: FaBrain },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Setup Your Interview Practice
          </h1>
          <p className="text-lg text-base-content/70">
            Customize your practice session to match your target role and
            experience level
          </p>
        </div>

        {/* Setup Form */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Interview Preferences</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Job Type */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-semibold">
                      Target Job Role
                    </span>
                  </label>
                  <select
                    className="select select-bordered select-lg"
                    value={formData.jobType}
                    onChange={(e) =>
                      handleInputChange("jobType", e.target.value)
                    }
                  >
                    {jobTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience Level */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-semibold">
                      Experience Level
                    </span>
                  </label>
                  <select
                    className="select select-bordered select-lg"
                    value={formData.experienceLevel}
                    onChange={(e) =>
                      handleInputChange("experienceLevel", e.target.value)
                    }
                  >
                    {experienceLevelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-semibold">
                      Difficulty Level
                    </span>
                  </label>
                  <select
                    className="select select-bordered select-lg"
                    value={formData.difficulty}
                    onChange={(e) =>
                      handleInputChange("difficulty", e.target.value)
                    }
                  >
                    {difficultyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-semibold">
                      Session Duration
                    </span>
                  </label>
                  <select
                    className="select select-bordered select-lg"
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange("duration", parseInt(e.target.value))
                    }
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Focus Areas */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-semibold">
                      Focus Areas
                    </span>
                    <span className="label-text-alt text-base-content/60">
                      Select the types of questions you want to practice
                    </span>
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {focusAreaOptions.map((area) => {
                      const Icon = area.icon;
                      return (
                        <label
                          key={area.value}
                          className="flex items-center space-x-3 p-3 border border-base-300 rounded-lg cursor-pointer hover:bg-base-200 transition-colors"
                        >
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            checked={formData.focusAreas.includes(area.value)}
                            onChange={(e) =>
                              handleFocusAreaChange(
                                area.value,
                                e.target.checked
                              )
                            }
                          />
                          <Icon className="text-lg text-primary" />
                          <span className="font-medium">{area.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card-actions justify-between mt-8 pt-6 border-t border-base-300">
              <button
                onClick={() => navigate("/dashboard")}
                className="btn btn-ghost btn-lg"
                disabled={saving}
              >
                Back to Dashboard
              </button>

              <button
                onClick={savePreferences}
                className="btn btn-primary btn-lg"
                disabled={saving || formData.focusAreas.length === 0}
              >
                {saving ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Starting Interview...
                  </>
                ) : (
                  <>
                    Start Interview Practice
                    <FaArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 card bg-primary/10 border border-primary/20">
          <div className="card-body">
            <h3 className="card-title text-primary">What to Expect</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center space-x-3">
                <FaVideo className="text-2xl text-primary" />
                <div>
                  <h4 className="font-semibold">Video Interface</h4>
                  <p className="text-sm text-base-content/70">
                    Face your AI interviewer in a video call format
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaMicrophone className="text-2xl text-primary" />
                <div>
                  <h4 className="font-semibold">Voice Interaction</h4>
                  <p className="text-sm text-base-content/70">
                    Speak naturally, get real-time feedback
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaBrain className="text-2xl text-primary" />
                <div>
                  <h4 className="font-semibold">AI-Powered</h4>
                  <p className="text-sm text-base-content/70">
                    Adaptive questions based on your responses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
