import { X, Edit2, Trash2 } from "lucide-react";

const Mapping = ({
  mappingProduct,
  mappedProducts,
  setMappingProduct,
  handleMappingAdd,
  setIsMapping,
   handleParaEdit,
  handleParaDelete,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white w-11/12 max-w-3xl rounded-lg shadow-lg p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Mapping Details</h2>
          <p className="text-gray-600 space-x-1">
            <span className="text-black">SizeName</span>:
            {mappingProduct?.SizeName || "None"}
          </p>
          <p className="text-gray-600 space-x-1">
            <span className="text-black">Product</span>:
            {mappingProduct?.type || "None"}
          </p>

          <button
            onClick={() => setIsMapping(false)}
            className="text-gray-600 hover:text-red-500"
          >
            <X size={26} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Parameter
            </label>
            <select
              value={mappingProduct?.additionalParam || ""}
              onChange={(e) =>
                setMappingProduct({
                  ...mappingProduct,
                  additionalParam: e.target.value,
                })
              }
              className="block w-full border rounded-lg shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              required
            >
              <option value="">Select Additional Parameter</option>
              <option value="Param1">Parameter 1</option>
              <option value="Param2">Parameter 2</option>
              <option value="Param3">Parameter 3</option>
            </select>
          </div>
        </div>

        {/* Add to Table Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleMappingAdd}
            className="bg-primary text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Add to Table
          </button>
        </div>

        {/* Mapped Products Table */}
        {mappedProducts?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Mapped Size Types
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      S.No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Parameter
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mappedProducts.map((mappedProduct, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3 text-gray-800 border-b text-sm">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-gray-800 border-b text-sm">
                        {mappedProduct.parameter}
                      </td>
                      <td className="px-4 py-3 text-gray-800 border-b text-sm">
                        <div className="flex items-center space-x-4">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleParaEdit(index)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit2 size={18} />
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => handleParaDelete(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mapping;
