import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const StatusRegisServices = {

  getAll: async (isPaginated = false, pageSize = 10, pageNumber = 1) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/StatusRegis/GetAll`, {
        params: { isPaginated, pageSize, pageNumber },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Không thể tải danh sách trạng thái đăng ký!";
      throw new Error(errorMessage);
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/StatusRegis/GetById/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Không thể tải thông tin trạng thái đăng ký!";
      throw new Error(errorMessage);
    }
  },

  create: async (statusRegisData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/StatusRegis/Create`, statusRegisData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi tạo trạng thái đăng ký!";
      throw new Error(errorMessage);
    }
  },

  update: async (statusRegisData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/StatusRegis/Update/${statusRegisData.id}`, statusRegisData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi cập nhật trạng thái đăng ký!";
      throw new Error(errorMessage);
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/StatusRegis/Delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi xóa trạng thái đăng ký!";
      throw new Error(errorMessage);
    }
  },
};

export default StatusRegisServices;
