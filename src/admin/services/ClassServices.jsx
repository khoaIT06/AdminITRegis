import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const ClassService = {
  getAll: async (isPaginated = false, pageSize = 10, pageNumber = 1) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Class/GetAll`, {
        params: { isPaginated, pageSize, pageNumber },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response ? error.response.data : error.message);
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Class/GetById/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response ? error.response.data : error.message);
    }
  },

  create: async (classDto) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Class/Create`, classDto);
      return response.data; // Return the created class
    } catch (error) {
      throw new Error(error.response ? error.response.data : error.message);
    }
  },

  update: async (classDto) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/Class/Update/${classDto.ID}`, classDto);
      return response.data; // Return the updated class
    } catch (error) {
      throw new Error(error.response ? error.response.data : error.message);
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/Class/Delete/${id}`);
    } catch (error) {
      throw new Error(error.response ? error.response.data : error.message);
    }
  },
};

export default ClassService;
