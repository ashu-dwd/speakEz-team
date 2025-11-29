import LandingPage from "./pages/LandingPage";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BlogList from "./pages/blogs/BlogList";
import BlogPost from "./pages/blogs/BlogPost";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Call from "./pages/Call";
import InterviewSetup from "./pages/InterviewSetup";
import InterviewRoom from "./pages/InterviewRoom";
import InterviewResults from "./pages/InterviewResults";
import ChatRooms from "./pages/ChatRooms";
import ChatRoom from "./pages/ChatRoom";

/**
 * Route definitions for modular app routing.
 * Use `component`, NOT JSX, for compatibility with JS files.
 */
const ROUTES = [
  {
    path: "/",
    component: LandingPage,
    layout: true,
  },
  {
    path: "/privacy-policy",
    component: PrivacyPolicy,
    layout: true,
  },
  {
    path: "/terms",
    component: TermsOfService,
    layout: true,
  },
  {
    path: "/login",
    component: Login,
    layout: true,
  },
  {
    path: "/signup",
    component: Signup,
    layout: true,
  },
  {
    path: "/blogs",
    component: BlogList,
    layout: true,
  },
  {
    path: "/privacy",
    component: PrivacyPolicy,
    layout: true,
  },
  {
    path: "/blogs/:slug",
    component: BlogPost,
    layout: true,
  },
  {
    path: "/dashboard",
    component: Dashboard,
    layout: true,
  },
  {
    path: "/settings",
    component: Settings,
    layout: true,
  },
  {
    path: "/call",
    component: Call,
    layout: false, // No navbar/layout for call interface
  },
  {
    path: "/interview-setup",
    component: InterviewSetup,
    layout: true, // Include navbar for setup
  },
  {
    path: "/interview/:sessionId",
    component: InterviewRoom,
    layout: false, // No navbar/layout for interview interface
  },
  {
    path: "/interview-results/:sessionId",
    component: InterviewResults,
    layout: true, // Include navbar for results
  },
  {
    path: "/chat-rooms",
    component: ChatRooms,
    layout: true,
  },
  {
    path: "/chat-rooms/:roomId",
    component: ChatRoom,
    layout: false, // No navbar/layout for chat interface
  },
  // 404 fallback - keep last
  {
    path: "*",
    component: NotFound,
    layout: true,
  },
];

export default ROUTES;
