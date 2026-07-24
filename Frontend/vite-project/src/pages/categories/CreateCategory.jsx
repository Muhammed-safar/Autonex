import { useCreateCategory } from "../../hooks/categories/useCreateCategory.js";

const CreateCategory = () => {
  const createMutation = useCreateCategory();

  const submitHandler = () => {
    const formData = new FormData();

    formData.append("name", "Electronics");
    formData.append("icon", file);

    createMutation.mutate(formData);
  };

  return (
    <button onClick={submitHandler}>
      Create Category
    </button>
  );
};

export default CreateCategory;