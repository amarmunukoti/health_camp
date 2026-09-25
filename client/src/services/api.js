const API_BASE_URL = '/api';

const getHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Helper for API calls
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'An error occurred during API request');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};


export const registerUserApi = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const loginUserApi = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

// Public Camp APIs
export const fetchAllCamps = async () => {
  const response = await fetch(`${API_BASE_URL}/camps`);
  return handleResponse(response);
};

export const fetchUpcomingCamps = async () => {
  const response = await fetch(`${API_BASE_URL}/camps/upcoming`);
  return handleResponse(response);
};

export const fetchCampById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/camps/${id}`);
  return handleResponse(response);
};

export const registerCitizenForCamp = async (campId, citizenData) => {
  const response = await fetch(`${API_BASE_URL}/camps/${campId}/register`, {
    method: 'POST',
    headers: getHeaders(localStorage.getItem('userToken')),
    body: JSON.stringify(citizenData),
  });
  return handleResponse(response);
};

// Admin APIs
export const loginAdminApi = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const registerAdminApi = async (adminData) => {
  const response = await fetch(`${API_BASE_URL}/admin/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(adminData),
  });
  return handleResponse(response);
};

export const fetchAdminCamps = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/camps`, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

export const createCampApi = async (token, campData) => {
  const response = await fetch(`${API_BASE_URL}/admin/camps`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(campData),
  });
  return handleResponse(response);
};

export const updateCampApi = async (token, id, campData) => {
  const response = await fetch(`${API_BASE_URL}/admin/camps/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(campData),
  });
  return handleResponse(response);
};

export const deleteCampApi = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/admin/camps/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

export const cancelCampApi = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/admin/camps/${id}/cancel`, {
    method: 'PUT',
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

export const fetchAdminRegistrations = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/registrations`, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
};
