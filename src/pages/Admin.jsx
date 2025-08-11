import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { initDb, saveDb } from "../utils/dbHelper";
import { uploadImage } from "../utils/fileUpload";

const Dashboard = () => {
  const [db, setDb] = useState(null);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [newProductName, setNewProductName] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 100;
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user_id");
    if (!user) navigate("/login");

    const loadDb = async () => {
      const loadedDb = await initDb();
      setDb(loadedDb);
    };

    loadDb();
  }, [navigate]);

  useEffect(() => {
    if (db) refreshProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, currentPage, searchTerm]);

  const refreshProducts = () => {
    if (!db) return;

    let query = "SELECT * FROM products";
    let params = [];

    if (searchTerm) {
      query += " WHERE name LIKE ?";
      params = [`%${searchTerm}%`];
    }

    const stmt = db.prepare(query);
    stmt.bind(params);

    const fetchedProducts = [];
    while (stmt.step()) {
      fetchedProducts.push(stmt.getAsObject());
    }
    stmt.free();

    setAllProducts(fetchedProducts);
    setTotalPages(Math.ceil(fetchedProducts.length / productsPerPage));
    const paginated = fetchedProducts.slice(
      (currentPage - 1) * productsPerPage,
      currentPage * productsPerPage
    );
    setProducts(paginated);
  };

  const handleAddOrUpdateProduct = async () => {
    if (!newProductName || !newProductDescription || !db) return;

    try {
      let imagePath = selectedProduct?.image_path || "";
      
      // Upload new image if selected
      if (imageFile) {
        const result = await uploadImage(imageFile);
        imagePath = result.url;
      }

      if (isEdit && selectedProduct) {
        db.run("UPDATE products SET name = ?, description = ?, image_path = ? WHERE id = ?", [
          newProductName,
          newProductDescription,
          imagePath,
          selectedProduct.id,
        ]);
        Swal.fire("Updated!", "Product updated successfully", "success");
      } else {
        db.run("INSERT INTO products (name, description, image_path) VALUES (?, ?, ?)", [
          newProductName,
          newProductDescription,
          imagePath,
        ]);
        Swal.fire("Added!", "New product added successfully", "success");
      }
    } catch (error) {
      console.error('Error saving product:', error);
      Swal.fire("Error", "Failed to save product. Please try again.", "error");
    }

    await saveDb();
    refreshProducts();
    closeModal();
  };

  const handleDeleteProduct = async (id) => {
    if (!db) return;

    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        db.run("DELETE FROM products WHERE id = ?", [id]);
        await saveDb();
        Swal.fire("Deleted!", "The product has been removed.", "success");
        refreshProducts();
      }
    });
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setNewProductName(product.name);
    setNewProductDescription(product.description);
    setImagePreview(product.image_path || "");
    setImageFile(null);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setNewProductName("");
    setNewProductDescription("");
    setImageFile(null);
    setImagePreview("");
    setSelectedProduct(null);
    setIsEdit(false);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  return (
    <div className="min-h-screen mt-[78px] bg-gray-100 p-6">
      <div className="max-w-full mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Products List</h2>
          <h2 className="text-lg font-semibold mb-2">
            Total Products: {allProducts.length}
          </h2>

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border rounded mb-3"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            + Add Product
          </button>

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Description</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border border-gray-300">
                  <td className="p-2">{product.name}</td>
                  <td className="p-2 max-w-xs truncate">{product.description}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleViewProduct(product)}
                      className="px-3 py-1 bg-blue-500 text-white rounded mx-1"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded mx-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded mx-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`px-4 py-2 mx-1 border rounded ${
                currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
              }`}
            >
              Previous
            </button>
            <span className="px-4 py-2 border rounded">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`px-4 py-2 mx-1 border rounded ${
                currentPage === totalPages
                  ? "bg-gray-300"
                  : "bg-blue-500 text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0000007a] bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[700px]">
            <h2 className="text-xl font-semibold mb-4">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h2>
            <input
              type="text"
              placeholder="Product Name"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-3"
            />
            <textarea
              placeholder="Description"
              value={newProductDescription}
              onChange={(e) => setNewProductDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-3 h-24"
              rows="4"
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="mt-1 flex items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Choose Image
                </button>
                {imagePreview && (
                  <div className="ml-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-16 w-16 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdateProduct}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {selectedProduct.image_path ? (
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={selectedProduct.image_path}
                      alt={selectedProduct.name}
                      className="w-full h-auto max-h-[60vh] object-contain"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg flex items-center justify-center h-64">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {selectedProduct.description || 'No description available'}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Created At:</span>
                        <span className="text-gray-800">
                          {selectedProduct.created_at ? new Date(selectedProduct.created_at).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">ID:</span>
                        <span className="text-gray-800">{selectedProduct.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleEditProduct(selectedProduct);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Edit Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
