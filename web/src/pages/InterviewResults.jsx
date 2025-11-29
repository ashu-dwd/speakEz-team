import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
} from "chart.js";
import { Radar, Bar, Doughnut } from "react-chartjs-2";
import {
  FaDownload,
  FaShare,
  FaStar,
  FaTrophy,
  FaChartLine,
  FaUsers,
  FaLightbulb,
  FaCheckCircle,
  FaArrowRight,
  FaHome,
} from "react-icons/fa";

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement
);

/**
 * Interview Results Page - Comprehensive assessment display with graphs
 */
const InterviewResults = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user
  useEffect(() => {
    const getCurrentUser = () => {
      try {
        const localAuth = localStorage.getItem("auth");
        const sessionAuth = sessionStorage.getItem("auth");
        const authContent = localAuth || sessionAuth;
        if (!authContent) {
          navigate("/login");
          return null;
        }
        const { user } = JSON.parse(authContent);
        return user || null;
      } catch (err) {
        navigate("/login");
        return null;
      }
    };

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    loadAssessment();
  }, [sessionId, navigate]);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/interviews/${sessionId}/assessment`);

      if (response.data.success) {
        setAssessment(response.data.data);
      } else {
        setError("Assessment not found");
      }
    } catch (err) {
      console.error("Error loading assessment:", err);
      setError("Failed to load assessment");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-error";
  };

  const getScoreBgColor = (score) => {
    if (score >= 85) return "bg-success/10 border-success/20";
    if (score >= 70) return "bg-warning/10 border-warning/20";
    return "bg-error/10 border-error/20";
  };

  const getInsightColor = (level) => {
    switch (level) {
      case "excellent":
        return "text-success";
      case "good":
        return "text-warning";
      case "average":
        return "text-info";
      default:
        return "text-error";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-error border-error/20 bg-error/5";
      case "medium":
        return "text-warning border-warning/20 bg-warning/5";
      default:
        return "text-info border-info/20 bg-info/5";
    }
  };

  const handleExportPDF = async () => {
    try {
      // For now, show a placeholder message
      // In a real implementation, you'd use jsPDF or html2pdf
      alert(
        "PDF export feature coming soon! This will generate a professional PDF report of your assessment."
      );
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to export PDF. Please try again.");
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: "My Interview Assessment - SpeakEz",
        text: `I just completed an AI interview assessment and scored ${assessment.overallScore}/100! Check out my results.`,
        url: window.location.href,
      };

      if (navigator.share) {
        // Use Web Share API if available
        await navigator.share(shareData);
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert(
          "Link copied to clipboard! Share your assessment results with others."
        );
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback: copy link to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert(
          "Link copied to clipboard! Share your assessment results with others."
        );
      } catch (clipboardError) {
        alert(
          "Sharing not supported. Copy this link manually: " +
            window.location.href
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center space-y-4">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="text-lg">Generating your assessment...</p>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl text-error">⚠️</span>
          </div>
          <h2 className="text-xl font-bold">Assessment Not Available</h2>
          <p className="text-base-content/70">
            {error || "Assessment not found"}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-primary"
          >
            <FaHome className="mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-base-content">
                Interview Assessment
              </h1>
              <p className="text-base-content/70 mt-1">
                {assessment.preferences.jobType} •{" "}
                {assessment.preferences.experienceLevel}
              </p>
            </div>
            <div className="flex space-x-3">
              <button onClick={handleShare} className="btn btn-ghost btn-sm">
                <FaShare className="mr-2" />
                Share
              </button>
              <button
                onClick={handleExportPDF}
                className="btn btn-primary btn-sm"
              >
                <FaDownload className="mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Overall Score Card */}
        <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="card-title text-2xl">Overall Performance</h2>
                <p className="text-base-content/70">
                  Assessment generated on{" "}
                  {new Date(assessment.generatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`text-6xl font-bold ${getScoreColor(
                    assessment.overallScore
                  )}`}
                >
                  {assessment.overallScore}
                </div>
                <div className="text-sm text-base-content/70">out of 100</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Performance Level</span>
                <span>
                  {assessment.overallScore >= 85
                    ? "Excellent"
                    : assessment.overallScore >= 70
                    ? "Good"
                    : "Needs Improvement"}
                </span>
              </div>
              <progress
                className="progress progress-primary w-full h-3"
                value={assessment.overallScore}
                max="100"
              ></progress>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radar Chart - Skills Overview */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title flex items-center">
                <FaChartLine className="mr-2" />
                Skills Overview
              </h3>
              <div className="h-80">
                <Radar
                  data={{
                    labels: Object.keys(assessment.categoryScores).map((key) =>
                      key.replace(/([A-Z])/g, " $1").trim()
                    ),
                    datasets: [
                      {
                        label: "Your Scores",
                        data: Object.values(assessment.categoryScores),
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        borderColor: "rgba(59, 130, 246, 1)",
                        borderWidth: 2,
                        pointBackgroundColor: "rgba(59, 130, 246, 1)",
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(59, 130, 246, 1)",
                      },
                      {
                        label: "Average Candidate",
                        data: [70, 65, 68, 72, 67, 71], // Sample benchmark data
                        backgroundColor: "rgba(156, 163, 175, 0.2)",
                        borderColor: "rgba(156, 163, 175, 1)",
                        borderWidth: 2,
                        pointBackgroundColor: "rgba(156, 163, 175, 1)",
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(156, 163, 175, 1)",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          stepSize: 20,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bar Chart - Category Scores */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title flex items-center">
                <FaTrophy className="mr-2" />
                Category Performance
              </h3>
              <div className="h-80">
                <Bar
                  data={{
                    labels: Object.keys(assessment.categoryScores).map((key) =>
                      key.replace(/([A-Z])/g, " $1").trim()
                    ),
                    datasets: [
                      {
                        label: "Score",
                        data: Object.values(assessment.categoryScores),
                        backgroundColor: Object.values(
                          assessment.categoryScores
                        ).map((score) =>
                          score >= 85
                            ? "rgba(34, 197, 94, 0.8)"
                            : score >= 70
                            ? "rgba(251, 191, 36, 0.8)"
                            : "rgba(239, 68, 68, 0.8)"
                        ),
                        borderColor: Object.values(
                          assessment.categoryScores
                        ).map((score) =>
                          score >= 85
                            ? "rgba(34, 197, 94, 1)"
                            : score >= 70
                            ? "rgba(251, 191, 36, 1)"
                            : "rgba(239, 68, 68, 1)"
                        ),
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          stepSize: 20,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Doughnut Chart - Overall Score Breakdown */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title flex items-center justify-center">
              <FaUsers className="mr-2" />
              Performance Distribution
            </h3>
            <div className="flex justify-center">
              <div className="w-64 h-64">
                <Doughnut
                  data={{
                    labels: ["Your Score", "Remaining Potential"],
                    datasets: [
                      {
                        data: [
                          assessment.overallScore,
                          100 - assessment.overallScore,
                        ],
                        backgroundColor: [
                          assessment.overallScore >= 85
                            ? "rgba(34, 197, 94, 0.8)"
                            : assessment.overallScore >= 70
                            ? "rgba(251, 191, 36, 0.8)"
                            : "rgba(239, 68, 68, 0.8)",
                          "rgba(156, 163, 175, 0.3)",
                        ],
                        borderColor: [
                          assessment.overallScore >= 85
                            ? "rgba(34, 197, 94, 1)"
                            : assessment.overallScore >= 70
                            ? "rgba(251, 191, 36, 1)"
                            : "rgba(239, 68, 68, 1)",
                          "rgba(156, 163, 175, 0.5)",
                        ],
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            return `${context.label}: ${context.parsed}%`;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="text-center mt-4">
              <div className="text-2xl font-bold">
                {assessment.overallScore}/100
              </div>
              <div className="text-sm text-base-content/70">
                Overall Performance Score
              </div>
            </div>
          </div>
        </div>

        {/* Category Scores Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(assessment.categoryScores).map(
            ([category, score]) => (
              <div
                key={category}
                className={`card ${getScoreBgColor(score)} shadow-lg`}
              >
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="card-title text-lg capitalize">
                        {category.replace(/([A-Z])/g, " $1").trim()}
                      </h3>
                      <div
                        className={`text-3xl font-bold ${getScoreColor(score)}`}
                      >
                        {score}
                      </div>
                    </div>
                    <div className="text-4xl opacity-20">
                      {category === "communication" && "💬"}
                      {category === "technicalSkills" && "⚙️"}
                      {category === "problemSolving" && "🧩"}
                      {category === "behavioral" && "🤝"}
                      {category === "confidence" && "💪"}
                      {category === "clarity" && "🔍"}
                    </div>
                  </div>
                  <progress
                    className="progress progress-primary w-full mt-2"
                    value={score}
                    max="100"
                  ></progress>
                </div>
              </div>
            )
          )}
        </div>

        {/* Benchmarks */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title flex items-center">
              <FaUsers className="mr-2" />
              Performance Benchmarks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {assessment.benchmarks.overallPercentile}%
                </div>
                <div className="text-sm text-base-content/70">
                  Overall Percentile
                </div>
                <div className="text-xs text-base-content/50">
                  vs other candidates
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">
                  {assessment.benchmarks.communicationPercentile}%
                </div>
                <div className="text-sm text-base-content/70">
                  Communication
                </div>
                <div className="text-xs text-base-content/50">
                  percentile rank
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">
                  {assessment.benchmarks.technicalPercentile}%
                </div>
                <div className="text-sm text-base-content/70">
                  Technical Skills
                </div>
                <div className="text-xs text-base-content/50">
                  percentile rank
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strengths & Weaknesses */}
          <div className="space-y-6">
            <div className="card bg-success/5 border-success/20 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-success flex items-center">
                  <FaTrophy className="mr-2" />
                  Key Strengths
                </h3>
                <ul className="space-y-2">
                  {assessment.detailedAnalysis.strengths.map(
                    (strength, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheckCircle className="text-success mt-1 mr-3 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            <div className="card bg-warning/5 border-warning/20 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-warning flex items-center">
                  <FaLightbulb className="mr-2" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {assessment.detailedAnalysis.weaknesses.map(
                    (weakness, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-warning rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>{weakness}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Interview Insights */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title flex items-center">
                <FaChartLine className="mr-2" />
                Interview Insights
              </h3>
              <div className="space-y-4">
                {Object.entries(assessment.interviewInsights).map(
                  ([insight, level]) => (
                    <div
                      key={insight}
                      className="flex justify-between items-center"
                    >
                      <span className="capitalize">
                        {insight.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span
                        className={`badge ${getInsightColor(
                          level
                        )} badge-outline capitalize`}
                      >
                        {level.replace("_", " ")}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title flex items-center">
              <FaArrowRight className="mr-2" />
              Recommended Next Steps
            </h3>
            <div className="space-y-4">
              {assessment.nextSteps.map((step, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getPriorityColor(
                    step.priority
                  )}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{step.action}</h4>
                    <span className="badge badge-sm capitalize">
                      {step.priority} priority
                    </span>
                  </div>
                  <p className="text-sm text-base-content/70 mb-2">
                    <strong>Timeframe:</strong> {step.timeframe}
                  </p>
                  <div className="text-sm">
                    <strong>Resources:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {step.resources.map((resource, idx) => (
                        <span
                          key={idx}
                          className="badge badge-xs badge-outline"
                        >
                          {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-primary btn-lg"
          >
            <FaHome className="mr-2" />
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate("/interviews/setup")}
            className="btn btn-outline btn-lg"
          >
            <FaStar className="mr-2" />
            Practice Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewResults;
