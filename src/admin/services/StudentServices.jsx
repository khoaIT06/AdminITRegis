import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const StudentServices = {

  getAll: async (statusRegisId = null ,examSessionId = null, search = "", isPaginated = true, pageSize = 10, pageNumber = 1) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Student/GetAll`, {
        params: {statusRegisId ,examSessionId, search, isPaginated, pageSize, pageNumber },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Không thể tải sinh viên!";
      throw new Error(errorMessage);
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Student/GetById/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Không thể tải thông tin sinh viên!";
      throw new Error(errorMessage);
    }
  },

  update: async (studentData) => {
    try {
        const response = await axios.put(
            `${process.env.REACT_APP_API_BASE_URL}/Student/Update/${studentData.id}`,
            studentData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
          );
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi cập nhật thông tin thí sinh!";
      throw new Error(errorMessage);
    }
  },

  generateExamRegistrationZip: async (students) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Student/GenerateExamRegistrationZip`, students, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Không thể xuất file!";
      throw new Error(errorMessage);
    }
  },

  getStudentsForExamList: async (examSessionID) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Student/ExportExamList/${examSessionID}`);
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Không thể xuất file!";
      throw new Error(errorMessage);
    }
  },

  exportStudentImages: async (studentIds) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Student/ExportStudentImages`, studentIds, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Không thể xuất file ảnh thí sinh!";
      throw new Error(errorMessage);
    }
  },

  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(`${API_BASE_URL}/Student/UploadAvatar`, formData, {
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

  delete: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/Student/Delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Lỗi khi xóa thông tin thí sinh!";
      throw new Error(errorMessage);
    }
  },
};

export default StudentServices;
