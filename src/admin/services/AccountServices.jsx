import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AccountServices = {

  getAll: async (isPaginated = true, pageSize = 10, pageNumber = 1, search = "") => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Account/GetAll`, {
        params: { search, isPaginated, pageSize, pageNumber },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Không thể tải danh sách tài khoản!";
      throw new Error(errorMessage);
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Account/GetById/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Không thể tải thông tin tài khoản!";
      throw new Error(errorMessage);
    }
  },

  create: async (accountData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Account/Create`, accountData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi tạo tài khoản!";
      throw new Error(errorMessage);
    }
  },

  update: async (accountData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/Account/Update/${accountData.id}`, accountData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi cập nhật tài khoản!";
      throw new Error(errorMessage);
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/Account/Delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi xóa tài khoản!";
      throw new Error(errorMessage);
    }
  },

  register: async (registerData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Account/Register`, registerData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi đăng ký tài khoản!";
      throw new Error(errorMessage);
    }
  },

  login: async (loginData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Account/Login`, loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi đăng nhập!";
      throw new Error(errorMessage);
    }
  },

  resetPassword: async (id) => {
    try {
        await axios.post(`${API_BASE_URL}/Account/ResetPassword/${id}`, {}, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        const errorMessage = error?.response?.data?.message || "Lỗi khi reset mật khẩu!";
        throw new Error(errorMessage);
    }
},

disableAccount: async (id) => {
    try {
        await axios.post(`${API_BASE_URL}/Account/DisableAccount/${id}`, {}, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        const errorMessage = error?.response?.data?.message || "Lỗi khi vô hiệu hóa tài khoản!";
        throw new Error(errorMessage);
    }
},
};

export default AccountServices;