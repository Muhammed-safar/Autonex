import Address from "../models/Address.js";

export const createAddressRepo = (data) => {
  return Address.create(data);
};

export const getUserAddressesRepo = (userId) => {
  return Address.find({
    user: userId,
  }).sort({ isDefault: -1, createdAt: -1 });
};

export const getAddressByIdRepo = (id) => {
  return Address.findOne({
    _id: id,
  });
};

export const getAddressByIdAndUserRepo = (addressId, userId) => {
  return Address.findOne({
    _id: addressId,
    user: userId,
  });
};

export const updateAddressRepo = (id, data) => {
  return Address.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// Changed to hard delete
export const deleteAddressRepo = (id) => {
  return Address.findByIdAndDelete(id);
};

export const resetDefaultAddressRepo = (userId) => {
  return Address.updateMany(
    {
      user: userId,
    },
    {
      isDefault: false,
    },
  );
};
