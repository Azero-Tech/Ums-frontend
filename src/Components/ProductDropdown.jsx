import { useEffect, useRef } from "react";
import $ from "jquery";
import "select2/dist/css/select2.min.css";
import "select2/dist/js/select2.min.js";


const ProductDropdown = ({
  products,
  selectedProduct,
  setSelectedProduct,
}) => {
  const selectRef = useRef(null);

  useEffect(() => {
    if (selectRef.current) {
      const $select = $(selectRef.current);
      $select.select2({
        placeholder: "Search or select a product...",
        allowClear: true,
        width: "100%",
      });

      // Handle change event
      $select.on("change", (e) => {
        setSelectedProduct(e.target.value);
      });

      // Cleanup on unmount
      return () => {
        $select.select2("destroy");
      };
    }
  }, [products]);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Product</label>

      <select ref={selectRef} className="border rounded-lg py-2 px-4 w-full">
        <option value="" selected disabled>-- Choose a Product --</option>
        <option value="custom">Custom Product</option>
        {products.map((product) => (
          <option key={product._id} value={product._id}>
            {product.name} (₹{product.price})
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductDropdown;
