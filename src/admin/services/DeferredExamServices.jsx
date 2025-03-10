import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/DeferredExam`;

const DeferredExamServices = {
  getAll: async (isPaginated = false, pageSize = 10, pageNumber = 1) => {
    try {
      const response = await axios.get(`${API_URL}/GetAll`, {
        params: { isPaginated, pageSize, pageNumber },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching deferred exams", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/GetById/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching deferred exam with ID: ${id}`, error);
      throw error;
    }
  },

  create: async (deferredExamDto) => {
    try {
      const response = await axios.post(`${API_URL}/Create`, deferredExamDto);
      return response.data;
    } catch (error) {
      console.error("Error creating deferred exam", error);
      throw error;
    }
  },

  update: async (id, deferredExamDto) => {
    try {
      const response = await axios.put(`${API_URL}/Update/${id}`, deferredExamDto);
      return response.data;
    } catch (error) {
      console.error(`Error updating deferred exam with ID: ${id}`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${API_URL}/Delete/${id}`);
    } catch (error) {
      console.error(`Error deleting deferred exam with ID: ${id}`, error);
      throw error;
    }
  },
  getByRegisFormID: async (regisFormID) => {
    try {
      const response = await axios.get(`${API_URL}/GetByRegisFormID/${regisFormID}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching deferred exams with RegisFormID: ${regisFormID}`, error);
      throw error;
    }
  },
};

export default DeferredExamServices;