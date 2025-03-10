import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CategoryService = {

  getAll: async (isPaginated = false, pageSize = 10, pageNumber = 1, searchTerm = "") => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Category/GetAll`, {
        params: {
          isPaginated,
          pageSize,
          pageNumber,
          searchTerm,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Category/GetById/${id}`, {
        headers: {
            "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (categoryDto) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Category/Create`, categoryDto, {
        headers: {
            "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (categoryDto) => {
    try {
      await axios.put(`${API_BASE_URL}/Category/Update/${categoryDto.id}`, categoryDto, {
        headers: {
            "Content-Type": "application/json",
        },
      });
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/Category/Delete/${id}`, {
        headers: {
            "Content-Type": "application/json",
        },
      });
    } catch (error) {
      throw error;
    }
  },
};

export default CategoryService;