import LandingPage from "./pages/LandingPage";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BlogList from "./pages/blogs/BlogList";
import BlogPost from "./pages/blogs/BlogPost";

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
  // 404 fallback - keep last
  {
    path: "*",
    component: NotFound,
    layout: true,
  },
];

export default ROUTES;
