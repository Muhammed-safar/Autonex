import Address from "../models/Address.js";
import {
  createAddressRepo,
  getUserAddressesRepo,
  getAddressByIdAndUserRepo,
  updateAddressRepo,
  deleteAddressRepo,
  resetDefaultAddressRepo,
} from "../repositories/address.repository.js";

export const createAddressService = async (userId, addressData) => {
  const count = await Address.countDocuments({ user: userId });

  if (count >= 10) {
    throw new Error("Maximum 10 addresses allowed");
  }

  if (count === 0) {
    addressData.isDefault = true;
  }

  if (addressData.isDefault) {
    await resetDefaultAddressRepo(userId);
  }

  return createAddressRepo({
    ...addressData,
    user: userId,
  });
};

export const getUserAddressesService = async (userId) => {
  return getUserAddressesRepo(userId);
};

export const getAddressByIdService = async (addressId, userId) => {
  const address = await getAddressByIdAndUserRepo(addressId, userId);

  if (!address) {
    throw new Error("Address not found");
  }

  return address;
};

export const setDefaultAddressService = async (addressId, userId) => {
  const address = await getAddressByIdAndUserRepo(addressId, userId);

  if (!address) {
    throw new Error("Address not found");
  }

  await resetDefaultAddressRepo(userId);

  return updateAddressRepo(addressId, { isDefault: true });
};

export const updateAddressService = async (addressId, userId, data) => {
  const address = await getAddressByIdAndUserRepo(addressId, userId);

  if (!address) {
    throw new Error("Address not found");
  }

  if (data.isDefault) {
    await resetDefaultAddressRepo(userId);
  }

  return updateAddressRepo(addressId, data);
};

export const deleteAddressService = async (addressId, userId) => {
  console.log("User ID:", userId);
  const address = await getAddressByIdAndUserRepo(addressId, userId);

  if (!address) {
    throw new Error("Address not found");
  }

  if (address.isDefault) {
    const nextAddress = await Address.findOne({
      user: userId,
      _id: { $ne: addressId },
    }).sort({ createdAt: 1 });

    if (nextAddress) {
      await updateAddressRepo(nextAddress._id, { isDefault: true });
    }
  }

  return deleteAddressRepo(addressId);
};
