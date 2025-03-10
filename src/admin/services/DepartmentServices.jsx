import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const DepartmentServices = {

  getAll: async (isPaginated = false, pageSize = 10, pageNumber = 1) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Department/GetAll`, {
        params: { isPaginated, pageSize, pageNumber },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Không thể tải danh sách phòng ban!";
      throw new Error(errorMessage);
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Department/GetById/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Không thể tải thông tin phòng ban!";
      throw new Error(errorMessage);
    }
  },

  create: async (departmentData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Department/Create`, departmentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi tạo phòng ban!";
      throw new Error(errorMessage);
    }
  },

  update: async (departmentData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/Department/Update/${departmentData.id}`, departmentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi cập nhật phòng ban!";
      throw new Error(errorMessage);
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/Department/Delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi xóa phòng ban!";
      throw new Error(errorMessage);
    }
  },
};

export default DepartmentServices;