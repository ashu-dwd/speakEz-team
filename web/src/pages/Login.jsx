import { useState } from "react";
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [apiMessage, setApiMessage] = useState("");
  const navigate = useNavigate();

  /**
   * Stores authentication details in storage.
   * If 'rememberMe' is checked, uses localStorage for persistent login.
   * Otherwise, uses sessionStorage (cleared on tab close).
   * The token and optionally user info are stored as an 'auth' object.
   */
  const storeAuth = (authData, remember = false) => {
    try {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("auth", JSON.stringify(authData));
      // Remove from the other storage type in case user changed preference
      (remember ? sessionStorage : localStorage).removeItem("auth");
    } catch (err) {
      // fallback if storage is unavailable (private mode, quota exceeded, etc)
      console.error("Error storing auth session", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiMessage("");
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/user/login", {
        email: formData.email,
        password: formData.password,
      });
      if (res.data && res.data.success && res.data.token) {
        setApiMessage("Login successful!");
        // Store auth details for later use in the app
        storeAuth(
          {
            token: res.data.token,
            user: res.data.user || null,
            loginAt: Date.now(),
          },
          formData.rememberMe
        );
        // Redirect to dashboard page after login
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 500);
      } else {
        setErrors({
          api: (res.data && res.data.error) || "Invalid login credentials.",
        });
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setErrors({
          api: err.response.data.error,
        });
      } else {
        setErrors({ api: "Network error during login." });
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-4">
      <div className="section w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-base-content/70">
            Sign in to continue your journey
          </p>
        </div>

        {/* Login Card */}
        <div className="card bg-base-100 shadow-2xl backdrop-blur-sm border border-base-300/50">
          <div className="card-body">
            {/* Show API feedback/errors at top */}
            {apiMessage && (
              <div className="alert alert-success text-sm py-2 mb-2">
                {apiMessage}
              </div>
            )}
            {errors.api && (
              <div className="alert alert-error text-sm py-2 mb-2">
                {errors.api}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    className={`input input-bordered w-full pl-10 transition-all duration-200 focus:scale-[1.02] ${
                      errors.email ? "input-error" : "focus:input-primary"
                    }`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.email}
                    </span>
                  </label>
                )}
              </div>

              {/* Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className={`input input-bordered w-full pl-10 transition-all duration-200 focus:scale-[1.02] ${
                      errors.password ? "input-error" : "focus:input-primary"
                    }`}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.password}
                    </span>
                  </label>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="label cursor-pointer gap-2 p-0">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span className="label-text">Remember me</span>
                </label>
                <a href="#" className="link link-primary link-hover text-sm">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider">OR</div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button className="btn btn-outline w-full gap-2 hover:scale-[1.02] transition-transform duration-200">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              <button className="btn btn-outline w-full gap-2 hover:scale-[1.02] transition-transform duration-200">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Continue with GitHub
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-base-content/70">
                Don't have an account?{" "}
                <a href="#" className="link link-primary font-semibold">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
