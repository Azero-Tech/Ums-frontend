import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  View,
} from "lucide-react";
import { FaArrowLeft } from "react-icons/fa6";
import {
  addStudentToOrder,
  getStudentsToOrder,
  updateStudentInOrder,
  removeStudentFromOrder,
} from "../../apis/studentApi"; // Assuming update function is in API
import { getAllSizes } from "../../apis/sizeApi";
import { useNavigate, useParams } from "react-router-dom";
import { debounce } from "lodash";
import { MdAdd, MdClose, MdUpload } from "react-icons/md";
import { useAuth } from "../context/AuthProvider";
import { getIndustriesByType } from "../../apis/industryApi";
import { getAllTypes } from "../../apis/industryTypeApi";
import ProductView from "../UI/ProductView";
import { IoMdEye } from "react-icons/io";
import toast from "react-hot-toast";
import { bulkUploadStudents } from "../../apis/orderApi";

const Student = () => {
  const { orderId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Flag for edit mode
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [newStudent, setNewStudent] = useState({
    name: "",
    class: "",
    gender : "",
    house: "",
    phone: "",
    // products: [],
  });
  const [productAdd, setProductAdd] = useState(false);
  const [productView, setProductView] = useState(false);
  const [uploadedFileName,setUploadedFileName] = useState(null)
  const navigate = useNavigate();
 
  const { user,setIsLoading } = useAuth();
  
 
  useEffect(() => {
    fetchStudents(orderId);
  }, [orderId,productAdd,productView]);

  const fetchStudents = (orderId) => {
    setIsLoading(true)
    getStudentsToOrder(orderId)
      .then((res) => {
        setStudents(res.data);
        setFilteredProducts(res.data);
        setIsLoading(false)
      })
      .catch((err) => console.log(err));
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  const handleEdit = (student) => {
    setIsEditMode(true); // Set edit mode
    setNewStudent({
      _id: student._id,
      name: student.name,
      class: student.class,
      gender : student.gender,
      house: student.house,
      phone: student.phone,
      // products: student.products.map((pro)=>pro._id),
    });
    setModalOpen(true);
  };

  const handleAdd = () => {
    setIsEditMode(false); // Set add mode
    setNewStudent({
      name: "",
      class: "",
      gender : "",
      house: "",
      phone: "",
      // products: [],
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    setIsLoading(true)
    if (isEditMode) {
      // Update existing student
      updateStudentInOrder(orderId, newStudent._id, newStudent)
        .then((res) => {
          fetchStudents(orderId);
          setModalOpen(false);
          setNewStudent({ name: "", class: "", house: "", phone: "" ,gender:""});
          setIsLoading(false)
          toast.success(res.message)
        })
        .catch((err) => {console.log(err)
          toast.error(err.response?.data?.message)
        });
    } else {
      // Add new student
      addStudentToOrder(orderId, newStudent)
        .then((res) => {
          fetchStudents(orderId);
          setModalOpen(false);
          setNewStudent({ name: "", class: "", house: "", phone: "",gender:"" });
          setIsLoading(false)
          toast.success(res.message)
        })
        .catch((err) => {console.log(err)
          toast.error(err.response?.data?.message)
        });
    }
  };

  const handleDelete = (studentId) => {
    // Assuming delete function exists in API
    removeStudentFromOrder(orderId, studentId)
      .then((res) => {
        fetchStudents(orderId);
        toast.success(res.message)
      })
      .catch((err) => {console.log(err)
        toast.error(err.response?.data?.message)
      });
  };

  const removeProduct = (productId) => {
    setNewStudent({
      ...newStudent,
      products: newStudent.products.filter((product) => product !== productId),
    });
  };

  const preventDuplicateProduct = (productId) => {
    if (!newStudent.products.includes(productId)) {
      setNewStudent({
        ...newStudent,
        products: [...newStudent.products, productId],
      });
    }
  };

  const handleProductAdd = (studentId) => {};

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    const formData = new FormData()
    if (file) {
        setUploadedFileName(file.name);
        formData.append('excelFile', file);
        setIsLoading(true)
        bulkUploadStudents(orderId,formData).then(res=>{
          setIsLoading(false)
          toast.success(res.message)
          fetchStudents(orderId)
        }).catch(err=>{
          toast.error(err.response?.data?.message)
        })
    }
};
  return (
    <motion.div
      className="mt-12 bg-white rounded-md shadow-md mx-auto section p-5 relative z-10"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.2 }}
    >
      <div className="flex justify-between text-black items-center mb-6">
        <h2 className="text-xl p-2 font-semibold text-black flex gap-2">
          <FaArrowLeft
            className="m-1 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          Student List
        </h2>
        <div className="relative flex items-center">
          <Search
            className="absolute left-3 text-gray-400 sm:left-2.5 top-2.5"
            size={20}
          />
          <input
            type="text"
            placeholder="Search student"
            className="border rounded-lg pl-10 pr-4 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
        {
          user?.role === 'super-admin' &&
          <div className=" flex flex-row-reverse items-center justify-center gap-2 ml-auto mr-2">
                    <div className="relative">
                        <input
                            type="file"
                            id="bulkUpload"
                            accept=".csv, .xls, .xlsx"
                            onChange={handleBulkUpload}
                            className="hidden"
                        />
                        <label htmlFor="bulkUpload" className="text-black border border-gray-300 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-gray-200">
                            <MdUpload size={18} />
                            Bulk Upload
                        </label>
                    </div>
                    {uploadedFileName && (
                        <span className="text-sm text-gray-600">{uploadedFileName.slice(0,10)}...</span>
                    )}
                </div>
        }
        {user?.role === "super-admin" && (
          <button
            onClick={handleAdd}
            className="bg-primary font-medium text-white text-md px-4 py-2 rounded-md"
          >
            Add Student
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto divide-y divide-gray-600">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">
                S.No
              </th>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">
                Class
              </th>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">
                Gender
              </th>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">
                House
              </th>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">
                Phone
              </th>
              {
                user.role !== "super-admin" && <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">
                Payment
              </th>
              }
              {/* <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">Product</th> */}
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">
              Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((student, index) => (
                <tr
                  key={student._id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 text-gray-700 border-b capitalize break-words text-xs sm:text-sm">
                    {student.name}
                  </td>
                  <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">
                    {student.class}
                  </td>
                  <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">
                    {student.gender}
                  </td>
                  <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">
                    {student.house}
                  </td>
                  <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">
                    {student.phone}
                  </td>
                  {
                    user.role !== 'super-admin' && 
                    <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">
                    {student.paymentDetails ? <span> &#8377; {student.paymentDetails.totalPrice}({student.paymentDetails.method})</span>:'not yet'}
                  </td>
                  }
                  {/* <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">{student.products[0]?.name}</td> */}
                  <td className="px-4 py-2 text-gray-700 border-b">
                    {user?.role === "super-admin" ? (
                      <>
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setProductAdd(true);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <MdAdd size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setProductView(true);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <IoMdEye size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-4 text-gray-500 text-xs sm:text-sm"
                >
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-3xl relative">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {isEditMode ? "Edit Student" : "Add Student"}
            </h2>
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <X size={20} />
            </button>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class
                  </label>
                  <input
                    type="text"
                    value={newStudent.class}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, class: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select value={newStudent.gender} onChange={(e)=>setNewStudent({...newStudent,gender : e.target.value})} className=" w-full border p-2">
                    <option value="" disabled>--select--</option>
                    {
                      ['male','female','other'].map((gender,index)=>(
                        <option value={gender} key={index}>{gender}</option>
                        ))
                    }
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    House
                  </label>
                  <input
                    type="text"
                    value={newStudent.house}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, house: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={newStudent.phone}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, phone: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700"
                  />
                </div>

                {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Products
                    </label>
                    <select
                      onChange={(e) => preventDuplicateProduct(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700"
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2">
                      {newStudent.products.map((productId) => {
                        const product = products.find(
                          (p) => p._id === productId
                        );
                        return (
                          <div key={productId} className="flex justify-between">
                            <span>{product?.name}</span>
                            <button
                              type="button"
                              onClick={() => removeProduct(productId)}
                              className="text-red-600"
                            >
                              <MdClose />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div> */}

                <div className="col-span-full mt-4">
                  <button
                    type="submit"
                    className="w-full py-2 bg-primary text-white rounded-md text-sm font-medium"
                  >
                    {isEditMode ? "Save Changes" : "Add Student"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {productAdd && 
      <ProductView setProductAdd={setProductAdd} orderId={orderId} studentId={selectedStudent?._id} studentName={selectedStudent.name} fetchProduct={selectedStudent?.products} addForm/>
    }
    {productView && <ProductView setProductView={setProductView} orderId={orderId} studentId={selectedStudent?._id} fetchProduct={selectedStudent?.products} viewForm/>}
    </motion.div>
  );
};

export default Student;
