import Category from "../models/Category.js";

// Find category by ID
export const findCategoryById = (id) => {
  return Category.findById(id);
};

// Find category by name
export const findCategoryByName = (name) => {
  return Category.findOne({ name });
};

// Find category by slug
export const findCategoryBySlug = (slug) => {
  return Category.findOne({ slug });
};

// Get all categories
export const findAllCategories = async ({
  page = 1,
  limit = 10,
  search = "",
}) => {
  const skip = (page - 1) * limit;
  const trimmedSearch = search?.trim();

  const matchStage = {};

  if (trimmedSearch) {
    matchStage.$or = [
      {
        name: {
          $regex: trimmedSearch,
          $options: "i",
        },
      },
      {
        slug: {
          $regex: trimmedSearch,
          $options: "i",
        },
      },
    ];
  }

  const result = await Category.aggregate([
    {
      $match: matchStage,
    },

    {
      $lookup: {
        from: "products",
        let: {
          categoryId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$category", "$$categoryId"],
              },
            },
          },
          {
            $count: "count",
          },
        ],
        as: "productStats",
      },
    },

    {
      $addFields: {
        productsCount: {
          $ifNull: [
            {
              $arrayElemAt: ["$productStats.count", 0],
            },
            0,
          ],
        },
      },
    },

    {
      $project: {
        productStats: 0,
      },
    },

    {
      $facet: {
        categories: [
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ],

        totalCount: [
          {
            $count: "count",
          },
        ],
      },
    },
  ]);

  const categories = result[0].categories;
  const total = result[0].totalCount[0]?.count || 0;

  return {
    categories,
    pagination: {
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      limit,
    },
  };
};

// Create category
export const createCategory = (data) => {
  return Category.create(data);
};

// Save updated document
export const saveCategory = (category) => {
  return category.save();
};
