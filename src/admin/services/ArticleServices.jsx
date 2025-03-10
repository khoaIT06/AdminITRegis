import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ArticleServices = {

  getAll: async (isPaginated = true, pageSize = 10, pageNumber = 1, search = "") => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Article/GetAll`, {
        params: { isPaginated, pageSize, pageNumber, search },
        headers: {
            'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Không thể tải bài viết!";
      throw new Error(errorMessage);
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Article/GetById/${id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Không thể tải dữ liệu bài viết!";
      throw new Error(errorMessage);
    }
  },


  create: async (articleData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Article/Create`, articleData, {
        headers: {
            'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi tạo bài viết!";
      throw new Error(errorMessage);
    }
  },

  update: async (articleData) => {
    try {
        const response = await axios.put(
            `${process.env.REACT_APP_API_BASE_URL}/Article/Update/${articleData.id}`,
            articleData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
          );
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi cập nhật bài viết!";
      throw new Error(errorMessage);
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/Article/Delete/${id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi xóa bài viết!";
      throw new Error(errorMessage);
    }
  },

  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(`${API_BASE_URL}/Article/UploadImage`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
      });
      return response.data.fileUrl;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi tải ảnh lên!";
      throw new Error(errorMessage);
    }
  },

  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(`${API_BASE_URL}/Article/UploadFile`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
      });
      return response.data.fileUrl;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi tải file lên!";
      throw new Error(errorMessage);
    }
  },
};

export default ArticleServices;