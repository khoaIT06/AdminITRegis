import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/ExamSession`;

const ExamSessionServices = {
  getAll: async (search = "", isPaginated = false, pageSize = 10, pageNumber = 1) => {
    try {
      const response = await axios.get(`${API_URL}/GetAll`, {
        params: {
          search,
          isPaginated,
          pageSize,
          pageNumber,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching exam sessions", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/GetById/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching exam session with ID: ${id}`, error);
      throw error;
    }
  },

  create: async (examSessionDto) => {
    try {
      const response = await axios.post(`${API_URL}/Create`, examSessionDto);
      return response.data;
    } catch (error) {
      console.error("Error creating exam session", error);
      throw error;
    }
  },

  update: async (id, examSessionDto) => {
    try {
      const response = await axios.put(`${API_URL}/Update/${id}`, examSessionDto);
      return response.data;
    } catch (error) {
      console.error(`Error updating exam session with ID: ${id}`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${API_URL}/Delete/${id}`);
    } catch (error) {
      console.error(`Error deleting exam session with ID: ${id}`, error);
      throw error;
    }
  },

  checkRegistration: async (examSessionID) => {
    try {
      const response = await axios.get(`${API_URL}/CheckRegistration`,
        {
          params: { examSessionID },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error checking registration for exam session ${examSessionID}`, error);
      throw error;
    }
  },
};

export default ExamSessionServices;