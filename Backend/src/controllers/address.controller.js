import {
  createAddressService,
  getUserAddressesService,
  updateAddressService,
  deleteAddressService,
} from "../Services/address.service.js";

export const createAddress = async (req, res, next) => {
  try {
    const address = await createAddressService(req.user.id, req.body);

    res.status(201).json({
      success: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await getUserAddressesService(req.user.id);

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

export const setDefaultAddress = async (req, res) => {
  const address = await setDefaultAddressService(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    data: address,
  });
};

export const getAddressById = async (req, res, next) => {
  try {
    const address = await getAddressByIdService(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const address = await updateAddressService(
      req.params.id,
      req.user.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    await deleteAddressService(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Address deleted",
    });
  } catch (error) {
    next(error);
  }
};