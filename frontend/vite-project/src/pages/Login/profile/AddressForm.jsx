import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const AddressForm = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    landmark: '',
    addressType: 'home',
    isDefault: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        addressLine1: initialData.addressLine1 || '',
        addressLine2: initialData.addressLine2 || '',
        city: initialData.city || '',
        state: initialData.state || '',
        postalCode: initialData.postalCode || '',
        country: initialData.country || '',
        landmark: initialData.landmark || '',
        addressType: initialData.addressType || 'home',
        isDefault: initialData.isDefault || false,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        landmark: '',
        addressType: 'home',
        isDefault: false,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-gray-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            {initialData ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#0067B2] focus:ring-2 focus:ring-[#0067B2]/20"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#0067B2] focus:ring-2 focus:ring-[#0067B2]/20"
                placeholder="john.doe@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#0067B2] focus:ring-2 focus:ring-[#0067B2]/20"
                placeholder="+1 555-0199"
              />
            </div>

            {/* Address Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Address Type
              </label>
              <select
                name="addressType"
                value={formData.addressType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#0067B2] focus:ring-2 focus:ring-[#0067B2]/20 bg-white"
              >
                <option value="home">Home</option>
                <option value="office">Office</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Address Line 1 *
            </label>
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#0067B2] focus:ring-2 focus:ring-[#0067B2]/20"
              placeholder="Street address or P.O. Box"
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#0067B2] focus:ring-2 focus:ring-[#0067B2]/20"
              placeholder="Apt, Suite, Unit, Building, Floor, etc."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Landmark */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Landmark (Optional)
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#0067B2] focus:ring-2 focus:ring-[#0067B2]/20"
                placeholder="Near Central Park"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#0067B2] focus:ring-2 focus:ring-[#0067B2]/20"
                placeholder="New York"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* State */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#0067B2] focus:ring-2 focus:ring-[#0067B2]/20"
                placeholder="NY"
              />
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#0067B2] focus:ring-2 focus:ring-[#0067B2]/20"
                placeholder="10001"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#0067B2] focus:ring-2 focus:ring-[#0067B2]/20"
                placeholder="United States"
              />
            </div>
          </div>

          {/* Default Checkbox */}
          <div className="pt-2 flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="w-4 h-4 text-[#0067B2] accent-[#0067B2] rounded border-gray-300 focus:ring-[#0067B2]"
            />
            <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 cursor-pointer">
              Set as default address
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-[#0067B2] hover:bg-[#00528e] text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-colors shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Update Address' : 'Save Address'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;