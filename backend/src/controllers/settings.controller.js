import StoreSettings from "../models/StoreSettings.js";

const allowedCurrencies = ["USD", "INR", "EUR"];

export const getSettings = async (req, res) => {
  try {
    let settings = await StoreSettings.findOne();

    if (!settings) {
      settings = await StoreSettings.create({
        defaultCurrency: "INR",
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { defaultCurrency } = req.body;

    if (!allowedCurrencies.includes(defaultCurrency)) {
      return res.status(400).json({
        success: false,
        message: "Invalid currency",
      });
    }

    const settings = await StoreSettings.findOneAndUpdate(
      {},
      { defaultCurrency },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};