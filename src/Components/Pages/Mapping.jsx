import { X, Edit2, Trash2 } from "lucide-react";
import { getAllParameters } from "../../apis/parameterApi";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { addMapBySize,removeMapBySize } from '../../apis/sizeApi'

const Mapping = ({
  product,
  mappedProducts,
  setIsMapping,
  setMappedProducts,
}) => {
  const [parameters, setParameters] = useState([]);
  const [map, setMap] = useState({ parameter: "", size: "" });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    if (product) {
      setMappedProducts(product.mapping)
      getAllParameters()
        .then((res) => setParameters(res.data))
        .catch((err) => console.error(err));
    }
  }, [product]);

  useEffect(() => {
    const closeOnEscapeKey = (e) => {
      if (e.key === "Escape") {
        setIsMapping(false);
      }
    };

    document.addEventListener("keydown", closeOnEscapeKey);
    return () => document.removeEventListener("keydown", closeOnEscapeKey);
  }, [setIsMapping]);

  const handleMappingAdd = async () => {
    if (map.parameter && map.size) {
      try {
        const newMappedProduct = { parameter: map.parameter, size: map.size };
        const updatedMappings = await addMapBySize(product._id, newMappedProduct);

        setMappedProducts([...mappedProducts,map]);
        toast.success("Mapping added successfully!");
        setMap({ parameter: "", size: "" });
        setEditIndex(null);
      } catch (error) {
        console.error(error);
        toast.error("Failed to add mapping.");
      }
    } else {
      toast.error("Please select a parameter and enter a size.");
    }
  };

  const handleParaEdit = (index) => {
    setEditIndex(index);
    setMap(mappedProducts[index]);
  };

  const handleMappingUpdate = async () => {
    if (map.parameter && map.size) {
      try {
        const updatedMappings = await addMapBySize(product._id, map);
        setMappedProducts(updatedMappings);
        toast.success("Mapping updated successfully!");
        setMap({ parameter: "", size: "" });
        setEditIndex(null);
      } catch (error) {
        console.error(error);
        toast.error("Failed to update mapping.");
      }
    } else {
      toast.error("Please select a parameter and enter a size.");
    }
  };

  const handleParaDelete = async (index) => {
    const mappingId = mappedProducts[index]._id;

    try {
      const updatedMappings = await removeMapBySize(product._id, mappingId);
      setMappedProducts(mappedProducts.filter(map=>map._id!==mappingId));
      toast.info("Mapping deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete mapping.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white w-11/12 max-w-3xl rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Mapping Details</h2>
          <p className="text-gray-600 space-x-1">
            <span className="text-black">SizeName</span>: {product?.name || "None"}
          </p>
          <button
            onClick={() => setIsMapping(false)}
            className="text-gray-600 hover:text-red-500"
            aria-label="Close Mapping Modal"
          >
            <X size={26} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Parameter Dropdown */}
          <div>
            <label
              htmlFor="parameter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Parameter
            </label>
            <select
              id="parameter"
              value={map.parameter}
              onChange={(e) =>
                setMap({ ...map, parameter: e.target.value })
              }
              className="block w-full border rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            >
              <option value="">Select parameter</option>
              {parameters.map((para) => (
                <option key={para._id} value={para._id}>
                  {para.name}
                </option>
              ))}
            </select>
          </div>

          {/* Size Input */}
          <div>
            <label
              htmlFor="size"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Size
            </label>
            <input
              id="size"
              type="text"
              value={map.size}
              onChange={(e) =>
                setMap({ ...map, size: e.target.value })
              }
              placeholder="Enter size"
              className="block w-full border rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={editIndex !== null ? handleMappingUpdate : handleMappingAdd}
            className="bg-primary text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            {editIndex !== null ? "Update Mapping" : "Add to Map"}
          </button>
        </div>

        {mappedProducts.length > 0 ? (
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
                      Size
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
                        {parameters.find(para=>para._id===mappedProduct.parameter)?.name}
                      </td>
                      <td className="px-4 py-3 text-gray-800 border-b text-sm">
                        {mappedProduct.size}
                      </td>
                      <td className="px-4 py-3 text-gray-800 border-b text-sm">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleParaEdit(index)}
                            className="text-blue-500 hover:text-blue-700"
                            aria-label="Edit Parameter"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleParaDelete(index)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Delete Parameter"
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
        ) : (
          <p className="text-gray-600">No mapped parameters yet.</p>
        )}
      </div>
    </div>
  );
};

export default Mapping;
