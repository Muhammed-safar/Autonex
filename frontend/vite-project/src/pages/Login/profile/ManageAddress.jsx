import React, { useState } from 'react';
import { Plus, Check, Pencil, Trash2, MapPin } from 'lucide-react';
import AddressForm from './AddressForm';

const ManageAddress = () => {
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 555-0199',
      addressLine1: '123 Auto Parts Ave',
      addressLine2: 'Suite 400',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      landmark: 'Near Empire State Building',
      addressType: 'home',
      isDefault: true,
    },
    {
      id: '2',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 555-0844',
      addressLine1: '789 Tech Boulevard',
      addressLine2: 'Floor 3',
      city: 'Brooklyn',
      state: 'NY',
      postalCode: '11201',
      country: 'United States',
      landmark: '',
      addressType: 'office',
      isDefault: false,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleAddNewClick = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleSaveAddress = (formData) => {
    if (editingAddress) {
      // Update
      setAddresses((prev) =>
        prev.map((addr) => {
          if (addr.id === editingAddress.id) {
            return { ...formData, id: addr.id };
          }
          // If edited item was set to default, unset others
          if (formData.isDefault) {
            return { ...addr, isDefault: false };
          }
          return addr;
        })
      );
    } else {
      // Add New
      const newAddress = {
        ...formData,
        id: Date.now().toString(),
      };

      setAddresses((prev) => {
        if (formData.isDefault) {
          return prev.map((a) => ({ ...a, isDefault: false })).concat(newAddress);
        }
        return [...prev, newAddress];
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 ">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage your delivery locations and preferences.
          </p>
        </div>
        <button
          onClick={handleAddNewClick}
          className="flex items-center space-x-1.5 border border-[#0067B2] text-[#0067B2] hover:bg-[#0067B2]/10 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New</span>
        </button>
      </div>

      {/* Addresses Grid */}
      <div className="max-h-[500px] overflow-y-auto pr-2 hide-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {addresses.map((address) => {
          const isDefault = address.isDefault;

          return (
            <div
              key={address.id}
              className={`rounded-2xl p-5 relative transition-all flex flex-col justify-between ${
                isDefault
                  ? 'border-2 border-[#0067B2] bg-[#0067B2]/5 shadow-xs'
                  : 'border border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Card Content */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900 text-sm">{address.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md font-medium uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
                      {address.addressType}
                    </span>
                  </div>

                  {isDefault && (
                    <span className="text-xs bg-[#0067B2] text-white px-2.5 py-0.5 rounded-full font-semibold flex items-center space-x-1">
                      <Check className="w-3 h-3 inline" />
                      <span>Default</span>
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <p className="font-medium text-gray-800">
                    {address.addressLine1}
                    {address.addressLine2 ? `, ${address.addressLine2}` : ''}
                  </p>
                  {address.landmark && (
                    <p className="text-gray-500 italic">Landmark: {address.landmark}</p>
                  )}
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                  <p className="pt-1 text-gray-500">Phone: {address.phone}</p>
                  <p className="text-gray-500">Email: {address.email}</p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="space-x-3 font-semibold">
                  <button
                    onClick={() => handleEditClick(address)}
                    className="text-[#0067B2] hover:underline inline-flex items-center space-x-1"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 hover:underline inline-flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                {!isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-xs font-semibold text-gray-600 hover:text-[#0067B2] underline"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>

      {/* Address Form Modal */}
      <AddressForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAddress}
        initialData={editingAddress}
      />
    </div>
  );
};

export default ManageAddress;