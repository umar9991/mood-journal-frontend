// api/index.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

console.log("🔗 API Base URL:", API_BASE_URL); // Ye dekhne ke liye

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      error: `HTTP ${response.status}` 
    }));
    throw new Error(error.message || error.error || `HTTP ${response.status}`);
  }
  return await response.json();
};

export const checkBackend = async () => {
  try {
    console.log("🔍 Checking backend at:", `${API_BASE_URL}/health`);
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors' // Explicitly set CORS mode
    });
    
    const data = await handleResponse(response);
    console.log("✅ Backend health check:", data);
    return data;
    
  } catch (error) {
    console.error("❌ Backend check failed:", error);
    return { error: error.message, status: "disconnected" };
  }
};

export const addMood = async (moodData) => {
  console.log("📤 Sending to backend:", moodData);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/moods`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      mode: 'cors',
      body: JSON.stringify(moodData),
    });

    const data = await handleResponse(response);
    console.log("✅ Backend response:", data);
    return data;
    
  } catch (error) {
    console.error("❌ Error adding mood:", error);
    return { error: error.message };
  }
};

export const getMoods = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/moods`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors'
    });
    
    const data = await handleResponse(response);
    console.log("📥 Fetched moods:", data);
    return data;
    
  } catch (error) {
    console.error("❌ Error fetching moods:", error);
    return [];
  }
};

export const updateMood = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/moods/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      mode: 'cors',
      body: JSON.stringify(data),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("❌ Error updating mood:", error);
    return { error: error.message };
  }
};

export const deleteMood = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/moods/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json"
      },
      mode: 'cors'
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("❌ Error deleting mood:", error);
    return { error: error.message };
  }
};