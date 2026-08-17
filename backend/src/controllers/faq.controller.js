import FAQ from "../models/FAQ.js";

// -- ADMIN ROUTES --

// @desc    Create a new FAQ
// @route   POST /api/faqs
// @access  Private/Admin
export const createFAQ = async (req, res) => {
  try {
    const { question, answer, category, order, isActive } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required",
      });
    }

    const faq = await FAQ.create({
      question,
      answer,
      category,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      faq,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update an FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
export const updateFAQ = async (req, res) => {
  try {
    const { question, answer, category, order, isActive } = req.body;

    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (category) faq.category = category;
    if (order !== undefined) faq.order = order;
    if (isActive !== undefined) faq.isActive = isActive;

    await faq.save();

    res.status(200).json({
      success: true,
      faq,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete an FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
export const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    await faq.deleteOne();

    res.status(200).json({
      success: true,
      message: "FAQ removed",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update FAQ status
// @route   PATCH /api/faqs/:id/status
// @access  Private/Admin
export const updateFAQStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    faq.isActive = isActive;
    await faq.save();

    res.status(200).json({
      success: true,
      faq,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Reorder FAQs
// @route   PATCH /api/faqs/reorder
// @access  Private/Admin
export const reorderFAQs = async (req, res) => {
  try {
    const { orderedIds } = req.body; // Array of FAQ IDs in the new order

    if (!orderedIds || !Array.isArray(orderedIds)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ordering data",
      });
    }

    // Update order for each provided ID. Order starts from 0 to N
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { order: index },
      },
    }));

    if (bulkOps.length > 0) {
      await FAQ.bulkWrite(bulkOps);
    }

    res.status(200).json({
      success: true,
      message: "FAQs reordered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get all FAQs for Admin
// @route   GET /api/faqs/admin/all
// @access  Private/Admin
export const getAdminFAQs = async (req, res) => {
  try {
    const { search, category, isActive } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { question: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } },
      ];
    }
    if (category && category !== "All") {
      filter.category = category;
    }
    if (isActive !== undefined && isActive !== "All") {
      filter.isActive = isActive === "true";
    }

    const faqs = await FAQ.find(filter).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      faqs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get a single FAQ by ID (For Admin Editing)
// @route   GET /api/faqs/admin/:id
// @access  Private/Admin
export const getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      success: true,
      faq,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// -- PUBLIC ROUTES --

// @desc    Get all active FAQs
// @route   GET /api/faqs
// @access  Public
export const getPublicFAQs = async (req, res) => {
  try {
    const { search, category } = req.query;

    const filter = { isActive: true };
    if (search) {
      filter.$or = [
        { question: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } },
      ];
    }
    if (category && category !== "All") {
      filter.category = category;
    }

    const faqs = await FAQ.find(filter).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      faqs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};