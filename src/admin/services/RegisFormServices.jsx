import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RegisFormServices = {
  getAll: async (isPaginated = false, pageSize = 10, pageNumber = 1) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/RegisForm/GetAll`, {
        params: { isPaginated, pageSize, pageNumber },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Không thể tải danh sách form đăng ký!";
      throw new Error(errorMessage);
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/RegisForm/GetById/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Không thể tải thông tin form đăng ký!";
      throw new Error(errorMessage);
    }
  },

  create: async (regisFormData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/RegisForm/Create`, regisFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi tạo form đăng ký!";
      throw new Error(errorMessage);
    }
  },

  update: async (regisFormData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/RegisForm/Update/${regisFormData.id}`, regisFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi cập nhật form đăng ký!";
      throw new Error(errorMessage);
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/RegisForm/Delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi xóa form đăng ký!";
      throw new Error(errorMessage);
    }
  },

  getByStudents: async (studentIds) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/RegisForm/GetByStudents`, studentIds, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Không thể tải danh sách form đăng ký!";
      throw new Error(errorMessage);
    }
  },

  confirmRegis: async (id, typeConfirm) => {
    try {
        await axios.post(`${API_BASE_URL}/RegisForm/ConfirmRegis/${id}?typeConfirm=${typeConfirm}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        const errorMessage = error?.response?.data?.message || "Lỗi khi duyệt đơn đăng ký!";
        throw new Error(errorMessage);
    }
  },
};

export default RegisFormServices;
