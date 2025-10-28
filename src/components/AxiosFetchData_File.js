import { useEffect } from "react";
import { AllCategoriesApi_URL } from "./Api_URL_Page";

export function AxiosFetchData_File({ setCategories }) {
  const categories_Api = AllCategoriesApi_URL();

  useEffect(() => {
    fetch(categories_Api)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data || []);
      })
      .catch((err) => console.error("Categories Fetch Error:", err));
  }, []);

  return null;
}
