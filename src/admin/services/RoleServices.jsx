import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RoleServices = {

  getAll: async (isPaginated = true, pageSize = 10, pageNumber = 1) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Role/GetAll`, {
        params: { isPaginated, pageSize, pageNumber },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Không thể tải danh sách vai trò!";
      throw new Error(errorMessage);
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Role/GetById/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Không thể tải thông tin vai trò!";
      throw new Error(errorMessage);
    }
  },

  create: async (roleData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Role/Create`, roleData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi tạo vai trò!";
      throw new Error(errorMessage);
    }
  },

  update: async (roleData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/Role/Update/${roleData.id}`, roleData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi cập nhật vai trò!";
      throw new Error(errorMessage);
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/Role/Delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi xóa vai trò!";
      throw new Error(errorMessage);
    }
  },
};

export default RoleServices;