// src/pages/Admin/AdminBattlefield.jsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  getAllBattlefields,
  getBattlefieldById,
  createBattlefield,
  updateBattlefield,
  addBattlefieldImages,
  deleteBattlefield,
  deleteBattlefieldImage,
} from "../../services/battlefieldAPI";

export default function AdminBattlefield() {
  const [battlefields, setBattlefields] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    youtubeUrl: "",
    description: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const battlefieldsPerPage = 5;
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchBattlefields();
  }, []);

  const fetchBattlefields = async () => {
    setLoading(true);
    setCurrentPage(1);
    try {
      const res = await getAllBattlefields();
      setBattlefields(res.data || []);
    } catch (err) {
      setError("Không thể tải danh sách chiến dịch");
      console.error(err);
      toast.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const indexOfLast = currentPage * battlefieldsPerPage;
  const indexOfFirst = indexOfLast - battlefieldsPerPage;
  const currentBattlefields = battlefields.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(battlefields.length / battlefieldsPerPage);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    setSelectedImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setImagePreview((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreview(newPreviews);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    if (!formData.youtubeUrl.trim()) {
      toast.error("Vui lòng nhập URL YouTube");
      return;
    }

    if (!editingId && selectedImages.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 ảnh");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");

      if (editingId) {
        // Update existing battlefield
        await updateBattlefield(
          editingId,
          {
            title: formData.title,
            youtubeUrl: formData.youtubeUrl,
            description: formData.description,
          },
          token,
        );

        // Add new images if selected
        if (selectedImages.length > 0) {
          await addBattlefieldImages(editingId, selectedImages, token);
        }

        toast.success("Cập nhật chiến dịch thành công!");
      } else {
        // Create new battlefield
        await createBattlefield(
          {
            title: formData.title,
            youtubeUrl: formData.youtubeUrl,
            description: formData.description,
            images: selectedImages,
          },
          token,
        );

        toast.success("Tạo chiến dịch thành công!");
      }

      // Reset form
      setFormData({ title: "", youtubeUrl: "", description: "" });
      setSelectedImages([]);
      setImagePreview([]);
      setEditingId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Refresh list
      await fetchBattlefields();
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.message || "Lỗi khi lưu");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const battlefield = await getBattlefieldById(id);
      setFormData({
        title: battlefield.title,
        youtubeUrl: battlefield.youtube_url,
        description: battlefield.description || "",
      });
      const previews = battlefield.images.map((img) => img.image_url);
      setImagePreview(previews);
      setSelectedImages([]);

      setEditingId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error("Lỗi tải dữ liệu");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa chiến dịch này?")) {
      try {
        const token = localStorage.getItem("adminToken");
        await deleteBattlefield(id, token);
        toast.success("Xóa thành công!");
        await fetchBattlefields();
      } catch (err) {
        toast.error("Lỗi xóa");
      }
    }
  };

  const handleDeleteImage = async (battlefieldId, imageId) => {
    if (window.confirm("Bạn chắc chắn muốn xóa ảnh này?")) {
      try {
        const token = localStorage.getItem("adminToken");
        await deleteBattlefieldImage(battlefieldId, imageId, token);
        toast.success("Xóa ảnh thành công!");
        await fetchBattlefields();
      } catch (err) {
        toast.error("Lỗi xóa ảnh");
      }
    }
  };

  const handleCancel = () => {
    setFormData({ title: "", youtubeUrl: "", description: "" });
    setSelectedImages([]);
    setImagePreview([]);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editingId ? "Cập nhật chiến dịch" : "Tạo chiến dịch mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="ví dụ: Trận Điện Biên Phủ"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* YouTube URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL YouTube *
            </label>
            <input
              type="url"
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Định dạng: youtube.com/watch?v=... hoặc youtu.be/...
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả chi tiết về chiến dịch..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tải lên ảnh bản đồ {editingId ? "" : "*"}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                Chọn ảnh
              </button>
              <p className="text-gray-500 text-sm mt-2">
                hoặc kéo thả ảnh vào đây
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Hỗ trợ: JPG, PNG, GIF, WebP (tối đa 10MB mỗi ảnh, tối đa 10 ảnh)
              </p>
            </div>

            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Ảnh đã chọn ({selectedImages.length}):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreview.map((preview, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg overflow-hidden border border-gray-300"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              {submitting ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo mới"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Danh sách chiến dịch
        </h2>

        {currentBattlefields.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Chưa có chiến dịch nào
          </p>
        ) : (
          <div className="space-y-4">
            {currentBattlefields.map((battlefield) => (
              <div
                key={battlefield.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Thumbnail */}
                  {battlefield.images && battlefield.images.length > 0 && (
                    <img
                      src={battlefield.images[0].image_url}
                      alt={battlefield.title}
                      className="w-full md:w-32 md:h-32 object-cover rounded-lg"
                    />
                  )}

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {battlefield.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3">
                      {battlefield.description}
                    </p>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                      <span>🎬 Video: {battlefield.video_id ? "✓" : "✗"}</span>
                      <span>🖼️ Ảnh: {battlefield.images?.length || 0}</span>
                      <span>
                        📅{" "}
                        {new Date(battlefield.created_at).toLocaleDateString(
                          "vi-VN",
                        )}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(battlefield.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition"
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(battlefield.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 rounded text-sm"
            >
              ← Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 rounded text-sm"
            >
              Sau →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
