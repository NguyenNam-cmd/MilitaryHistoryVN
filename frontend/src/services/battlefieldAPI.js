// frontend/src/services/battlefieldAPI.js
// API service for battlefield/battle maps operations

const API_BASE = "http://localhost:5000/api/admin/battlefield";

/**
 * Get all battlefields with images
 */
export const getAllBattlefields = async () => {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${API_BASE}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

/**
 * Get single battlefield by ID
 */
export const getBattlefieldById = async (id) => {
  try {
    const token = localStorage.getItem("adminToken");

    const response = await fetch(`${API_BASE}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to fetch battlefield");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching battlefield:", error);
    throw error;
  }
};

/**
 * Create new battlefield with multiple images
 * @param {Object} data - {title, youtubeUrl, description, images: File[]}
 * @param {string} authToken - JWT token for authentication
 */
export const createBattlefield = async (data, authToken) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("youtubeUrl", data.youtubeUrl);
    if (data.description) {
      formData.append("description", data.description);
    }

    // Add multiple images
    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        // Don't set Content-Type - browser will set it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create battlefield");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating battlefield:", error);
    throw error;
  }
};

/**
 * Update battlefield metadata (title, youtube URL, description)
 */
export const updateBattlefield = async (id, data, authToken) => {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title: data.title,
        youtubeUrl: data.youtubeUrl,
        description: data.description || "",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update battlefield");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating battlefield:", error);
    throw error;
  }
};

/**
 * Add more images to existing battlefield
 */
export const addBattlefieldImages = async (
  battlefieldId,
  images,
  authToken,
) => {
  try {
    const formData = new FormData();

    // Add multiple images
    if (Array.isArray(images)) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await fetch(`${API_BASE}/${battlefieldId}/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        // Don't set Content-Type - browser will set it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to add images");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding images:", error);
    throw error;
  }
};

/**
 * Delete single image from battlefield
 */
export const deleteBattlefieldImage = async (
  battlefieldId,
  imageId,
  authToken,
) => {
  try {
    const response = await fetch(
      `${API_BASE}/${battlefieldId}/images/${imageId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete image");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

/**
 * Delete entire battlefield and all its images
 */
export const deleteBattlefield = async (id, authToken) => {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete battlefield");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting battlefield:", error);
    throw error;
  }
};

/**
 * Transform battlefield data for BattleMapsDisplay component
 * Converts database battlefield format to component format
 */
export const transformBattlefieldToMaps = (battlefields) => {
  return battlefields.map((bf) => ({
    id: bf.id,
    title: bf.title,
    caption: bf.description || "No description",
    // Use first image as thumbnail, full image for main display
    thumbnail: bf.images?.[0]?.image_url || "/placeholder-thumbnail.jpg",
    full: bf.images?.[0]?.image_url || "/placeholder-full.jpg",
    // Store additional data
    youtubeUrl: bf.youtube_url,
    images: bf.images || [],
  }));
};
