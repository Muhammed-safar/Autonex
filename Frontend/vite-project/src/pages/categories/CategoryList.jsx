import { useCategories } from "../../hooks/categories/useCategories.js";

const CategoryList = () => {
  const { data, isLoading, error } = useCategories();

  if (isLoading) return <h2>Loading...</h2>;

  if (error) return <h2>Error</h2>;

  return (
    <div>
      {data.data.map((category) => (
        <h3 key={category._id}>{category.name}</h3>
      ))}
    </div>
  );
};

export default CategoryList;