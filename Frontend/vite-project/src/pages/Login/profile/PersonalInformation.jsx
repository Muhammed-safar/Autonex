import React, { useState, useRef } from "react";
import { Pencil, Camera, Check, Trash2, AlertTriangle } from "lucide-react";

const PersonalInformation = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 000-0000",
    country: "United States",
  });

  // Temporary state for editing so changes can be canceled
  const [tempData, setTempData] = useState({ ...formData });

  // Avatar Image State
  const [avatarSrc, setAvatarSrc] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setTempData({ ...formData });
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFormData({ ...tempData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData({ ...formData });
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarSrc(imageUrl);
    }
  };

  const handleRemovePhoto = () => {
    setAvatarSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteAccount = () => {
    alert("Account deletion initiated.");
    setShowDeleteModal(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Personal Information
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage your personal account details.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleEditClick}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-xs"
          >
            <Pencil className="w-4 h-4 text-[#0067B2]" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative group shrink-0">
            {/* Main Avatar Container */}
            <div className="w-28 h-28 rounded-full border-4 border-white bg-[#0067B2]/10 text-[#0067B2] flex items-center justify-center font-bold text-2xl shadow-md overflow-hidden">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {(isEditing ? tempData.fullName : formData.fullName)
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              )}
            </div>

            {/* Overlay Icon Buttons - Shown ONLY in Edit Mode */}
            {isEditing && (
              <>
                {/* Upload Camera Button (Bottom Right) */}
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 p-2.5 bg-[#0067B2] text-white rounded-full shadow-md hover:bg-[#00528e] transition-transform duration-200 hover:scale-105 focus:outline-none"
                  title="Upload Photo"
                >
                  <Camera className="w-4 h-4" />
                </button>

                {/* Remove Trash Button (Bottom Left - visible when an image is present) */}
                {avatarSrc && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute bottom-0 left-0 p-2.5 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-transform duration-200 hover:scale-105 focus:outline-none"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <span className="text-xs text-gray-400 mt-2">
            Allowed JPG, PNG or GIF.
          </span>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={isEditing ? tempData.fullName : formData.fullName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm transition-all ${
                isEditing
                  ? "border-gray-300 bg-white focus:outline-none focus:border-[#0067B2] focus:ring-2 focus:ring-[#0067B2]/20"
                  : "border-gray-200 bg-gray-50/60 text-gray-700 cursor-not-allowed"
              }`}
              required
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={isEditing ? tempData.email : formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm transition-all ${
                isEditing
                  ? "border-gray-300 bg-white focus:outline-none focus:border-[#0067B2] focus:ring-2 focus:ring-[#0067B2]/20"
                  : "border-gray-200 bg-gray-50/60 text-gray-700 cursor-not-allowed"
              }`}
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={isEditing ? tempData.phone : formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm transition-all ${
                isEditing
                  ? "border-gray-300 bg-white focus:outline-none focus:border-[#0067B2] focus:ring-2 focus:ring-[#0067B2]/20"
                  : "border-gray-200 bg-gray-50/60 text-gray-700 cursor-not-allowed"
              }`}
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={isEditing ? tempData.country : formData.country}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm transition-all ${
                isEditing
                  ? "border-gray-300 bg-white focus:outline-none focus:border-[#0067B2] focus:ring-2 focus:ring-[#0067B2]/20"
                  : "border-gray-200 bg-gray-50/60 text-gray-700 cursor-not-allowed"
              }`}
            />
          </div>
        </div>

        {/* Action Controls (Visible during Edit Mode) */}
        {isEditing && (
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100 animate-in fade-in duration-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-[#0067B2] hover:bg-[#00528e] text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-colors shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </form>

      {/* Delete Account Danger Zone */}
      <div className="mt-10 pt-6 border-t border-red-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-50/50 border border-red-100">
          <div>
            <h4 className="text-sm font-bold text-red-900">Delete Account</h4>
            <p className="text-xs text-red-600 mt-0.5">
              Permanently delete your profile and all associated data.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shrink-0 shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Profile</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="p-2.5 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Are you absolutely sure?
              </h3>
            </div>

            <p className="text-sm text-gray-600">
              This action cannot be undone. This will permanently delete your
              account profile and remove your data from our servers.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors shadow-xs"
              >
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInformation;
