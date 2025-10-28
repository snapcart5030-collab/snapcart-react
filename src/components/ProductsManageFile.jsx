import { useState } from "react";
import ProductsFetch_File from "./ProductsFetch_File";
import { AxiosFetchData_File } from "./AxiosFetchData_File";


function ProductsManageFile(){
  const [products, setProducts] = useState([]);

  return (
    <div>
      <ProductsFetch_File products={products} />
      <AxiosFetchData_File  setProducts={setProducts} />
    </div>
  );
}

export default ProductsManageFile;
