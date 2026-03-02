const API_BASE_URL = 'http://localhost:8000';

export const register = async (name, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  }
  throw new Error(data.detail);
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  }
  throw new Error(data.detail);
};

export const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

export const fetchWithAuth = async (path, options = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired');
  }
  
  return response;
};

export const ingestRepo = async (repoUrl) => {
  const response = await fetchWithAuth('/repos/ingest', {
    method: 'POST',
    body: JSON.stringify({ repo_url: repoUrl })
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to ingest repository');
  }
  return await response.json();
};

export const checkRepoStatus = async (repoId) => {
    const response = await fetchWithAuth(`/repos/status/${repoId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch status');
    }
    return await response.json();
}

export const getAllRepos = async () => {
    const response = await fetchWithAuth('/repos/');
    if (!response.ok) {
        throw new Error('Failed to fetch repositories');
    }
    return await response.json();
}

export const askQuestion = async (question, repoId, chatHistory = []) => {
  const response = await fetchWithAuth('/chat/query', {
    method: 'POST',
    body: JSON.stringify({
      question,
      repo_id: repoId,
      chat_history: chatHistory
    })
  });
  
  if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to ask question');
  }
  return await response.json();
};
