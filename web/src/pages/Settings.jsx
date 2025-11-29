import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCamera } from "react-icons/fa";
import axiosInstance from "../utils/axios";

function getCurrentUser() {
  try {
    const localAuth = localStorage.getItem("auth");
    const sessionAuth = sessionStorage.getItem("auth");
    const authContent = localAuth || sessionAuth;
    if (!authContent) return null;
    const { user } = JSON.parse(authContent);
    return user || null;
  } catch (err) {
    return null;
  }
}

const Settings = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    username: "",
    bio: "",
    phone: "",
  });

  // Email change state
  const [emailChangeState, setEmailChangeState] = useState({
    showOtp: false,
    newEmail: "",
    otp: "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        username: user.username || "",
        bio: user.bio || "",
        phone: user.phone || "",
      });
      if (user.profilePicture) {
        setAvatarPreview(`${import.meta.env.VITE_APP_API_URL}${user.profilePicture}`);
      }
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    
    // If email is changed, reset OTP state
    if (e.target.name === "email") {
      setEmailChangeState({ showOtp: false, newEmail: "", otp: "" });
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Check if email has changed
    if (profileData.email !== user.email) {
      // Request OTP for email change
      try {
        const res = await axiosInstance.post("/settings/email/request-change", {
          newEmail: profileData.email,
        });
        if (res.data && res.data.success) {
          setEmailChangeState({
            showOtp: true,
            newEmail: profileData.email,
            otp: "",
          });
          setMessage("OTP sent to your new email address!");
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to send OTP");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Update profile without email
    try {
      const res = await axiosInstance.put("/settings/profile", {
        name: profileData.name,
        username: profileData.username,
        bio: profileData.bio,
        phone: profileData.phone,
      });
      if (res.data && res.data.success) {
        setMessage("Profile updated successfully!");
        updateLocalUser(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await axiosInstance.post("/settings/email/verify-change", {
        newEmail: emailChangeState.newEmail,
        otp: emailChangeState.otp,
      });
      if (res.data && res.data.success) {
        setMessage("Email updated successfully!");
        updateLocalUser(res.data.user);
        setEmailChangeState({ showOtp: false, newEmail: "", otp: "" });
        setProfileData({ ...profileData, email: emailChangeState.newEmail });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEmailChange = () => {
    setProfileData({ ...profileData, email: user.email });
    setEmailChangeState({ showOtp: false, newEmail: "", otp: "" });
    setMessage("");
    setError("");
  };

  const handleAvatarSubmit = async () => {
    if (!avatarFile) return;

    setLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const res = await axiosInstance.post("/settings/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data && res.data.success) {
        setMessage("Avatar updated successfully!");
        setAvatarFile(null);
        // Update user in localStorage
        const updatedUser = { ...user, profilePicture: res.data.profilePicture };
        updateLocalUser(updatedUser);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.put("/settings/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.data && res.data.success) {
        setMessage("Password changed successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const updateLocalUser = (updatedUser) => {
    const localAuth = localStorage.getItem("auth");
    const sessionAuth = sessionStorage.getItem("auth");
    const authContent = localAuth || sessionAuth;
    if (authContent) {
      const auth = JSON.parse(authContent);
      auth.user = updatedUser;
      if (localAuth) {
        localStorage.setItem("auth", JSON.stringify(auth));
      } else {
        sessionStorage.setItem("auth", JSON.stringify(auth));
      }
      setUser(updatedUser);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Settings
        </h1>

        {/* Messages */}
        {message && (
          <div className="alert alert-success">
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {/* Avatar Section */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Profile Picture</h2>
            <div className="flex items-center gap-6">
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" />
                  ) : (
                    <div className="bg-primary text-primary-content flex items-center justify-center text-3xl">
                      {user.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor="avatar-input" className="btn btn-primary btn-sm gap-2">
                  <FaCamera /> Choose Image
                </label>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                {avatarFile && (
                  <button
                    onClick={handleAvatarSubmit}
                    disabled={loading}
                    className="btn btn-success btn-sm ml-2"
                  >
                    {loading ? "Uploading..." : "Upload"}
                  </button>
                )}
                <p className="text-sm text-base-content/60 mt-2">
                  Max file size: 5MB. Supported: JPG, PNG, GIF, WebP
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Profile Information</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="input input-bordered w-full pl-10"
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Username</span>
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                    <input
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      className="input input-bordered w-full pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="input input-bordered w-full pl-10"
                    disabled={emailChangeState.showOtp}
                  />
                </div>
                {emailChangeState.showOtp && (
                  <div className="mt-4 p-4 bg-base-200 rounded-lg space-y-3">
                    <p className="text-sm text-base-content/70">
                      An OTP has been sent to <strong>{emailChangeState.newEmail}</strong>
                    </p>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Enter OTP</span>
                      </label>
                      <input
                        type="text"
                        value={emailChangeState.otp}
                        onChange={(e) =>
                          setEmailChangeState({ ...emailChangeState, otp: e.target.value })
                        }
                        className="input input-bordered"
                        placeholder="Enter 4-digit OTP"
                        maxLength="4"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleVerifyEmailOtp}
                        disabled={loading || emailChangeState.otp.length !== 4}
                        className="btn btn-primary btn-sm"
                      >
                        {loading ? "Verifying..." : "Verify OTP"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEmailChange}
                        className="btn btn-ghost btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className="input input-bordered w-full pl-10"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  className="textarea textarea-bordered h-24"
                  maxLength="500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>
        </div>

        {/* Change Password */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Current Password</span>
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="input input-bordered w-full pl-10"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">New Password</span>
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="input input-bordered w-full pl-10"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm New Password</span>
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="input input-bordered w-full pl-10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Updating..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
