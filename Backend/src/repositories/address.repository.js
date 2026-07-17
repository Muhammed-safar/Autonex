import Address from "../models/Address.js";

export const createAddressRepo = (data) => {
  return Address.create(data);
};

export const getUserAddressesRepo = (userId) => {
  return Address.find({
    user: userId,
    isDeleted: false,
  }).sort({ isDefault: -1, createdAt: -1 });
};

export const getAddressByIdRepo = (id) => {
  return Address.findOne({
    _id: id,
    isDeleted: false,
  });
};

export const getAddressByIdAndUserRepo = (
  addressId,
  userId
) => {
  return Address.findOne({
    _id: addressId,
    user: userId,
    isDeleted: false,
  });
};

export const updateAddressRepo = (id, data) => {
  return Address.findByIdAndUpdate(id, data, {
    new: true,
  });
};

export const deleteAddressRepo = (id) => {
  return Address.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
      deletedAt: new Date(),
    },
    {
      new: true,
    }
  );
};

export const resetDefaultAddressRepo = (userId) => {
  return Address.updateMany(
    {
      user: userId,
      isDeleted: false,
    },
    {
      isDefault: false,
    }
  );
};