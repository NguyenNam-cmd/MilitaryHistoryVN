const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../config/db");
const auth = require("../middleware/auth");

// 📁 Setup multer for multiple images
const uploadDir = path.join(
  __dirname,
  "..",
  "public",
  "uploads",
  "battlefields",
);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per image
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh: jpg, jpeg, png, gif, webp"));
    }
  },
});

// ✅ Helper: Extract YouTube video ID
const getYouTubeVideoId = (url) => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// ✅ Helper: Validate YouTube URL
const isValidYouTubeUrl = (url) => {
  return /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\//.test(
    url,
  );
};

// 🔥 POST /api/admin/battlefield - Create new battlefield with multiple images
router.post("/", auth, upload.array("images", 10), async (req, res) => {
  try {
    const { title, youtubeUrl, description } = req.body;

    // ✅ Validate inputs
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Tiêu đề không được bỏ trống" });
    }

    if (!youtubeUrl || !isValidYouTubeUrl(youtubeUrl)) {
      return res.status(400).json({ error: "URL YouTube không hợp lệ" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Vui lòng tải lên ít nhất 1 ảnh" });
    }

    // Extract video ID
    const videoId = getYouTubeVideoId(youtubeUrl);

    // Get database connection
    const connection = await pool.getConnection();

    try {
      // Insert battlefields record
      const [result] = await connection.query(
        `INSERT INTO battlefields 
         (title, youtube_url, video_id, description, created_by, created_at) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [title.trim(), youtubeUrl, videoId, description || null, req.user.id],
      );

      const battlefieldId = result.insertId;

      // Insert battle map images
      const imageInserts = req.files.map((file) => {
        const imageUrl = `/uploads/battlefields/${file.filename}`;
        return connection.query(
          `INSERT INTO battlefield_images 
           (battlefield_id, image_url, filename, upload_order)
           VALUES (?, ?, ?, ?)`,
          [battlefieldId, imageUrl, file.filename, req.files.indexOf(file) + 1],
        );
      });

      // Execute all image inserts
      await Promise.all(imageInserts);

      connection.release();

      // Return created battlefield with images
      const [battlefields] = await pool.query(
        `SELECT b.*, COUNT(bi.id) as image_count
         FROM battlefields b
         LEFT JOIN battlefield_images bi ON b.id = bi.battlefield_id
         WHERE b.id = ?
         GROUP BY b.id`,
        [battlefieldId],
      );

      const [images] = await pool.query(
        `SELECT id, image_url, upload_order FROM battlefield_images 
         WHERE battlefield_id = ? ORDER BY upload_order`,
        [battlefieldId],
      );

      res.status(201).json({
        message: "Tạo chiến dịch thành công",
        data: {
          ...battlefields[0],
          images,
        },
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error("Error creating battlefield:", error);
    res.status(500).json({ error: "Lỗi tạo chiến dịch: " + error.message });
  }
});

// 📖 GET /api/admin/battlefield - Get all battlefields
router.get("/", async (req, res) => {
  try {
    const [battlefields] = await pool.query(
      `SELECT b.*, COUNT(bi.id) as image_count
       FROM battlefields b
       LEFT JOIN battlefield_images bi ON b.id = bi.battlefield_id
       GROUP BY b.id
       ORDER BY b.created_at DESC`,
    );

    // Get images for each battlefield
    for (let bf of battlefields) {
      const [images] = await pool.query(
        `SELECT id, image_url, upload_order FROM battlefield_images 
         WHERE battlefield_id = ? ORDER BY upload_order`,
        [bf.id],
      );
      bf.images = images;
    }

    res.json({
      total: battlefields.length,
      data: battlefields,
    });
  } catch (error) {
    console.error("Error fetching battlefields:", error);
    res.status(500).json({ error: "Lỗi lấy dữ liệu: " + error.message });
  }
});

// 👁️ GET /api/admin/battlefield/:id - Get single battlefield with images
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [battlefields] = await pool.query(
      `SELECT * FROM battlefields WHERE id = ?`,
      [id],
    );

    if (battlefields.length === 0) {
      return res.status(404).json({ error: "Chiến dịch không tồn tại" });
    }

    const [images] = await pool.query(
      `SELECT id, image_url, upload_order FROM battlefield_images 
       WHERE battlefield_id = ? ORDER BY upload_order`,
      [id],
    );

    res.json({
      ...battlefields[0],
      images,
    });
  } catch (error) {
    console.error("Error fetching battlefield:", error);
    res.status(500).json({ error: "Lỗi lấy dữ liệu: " + error.message });
  }
});

// ✏️ PUT /api/admin/battlefield/:id - Update battlefield (title, youtube, description)
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, youtubeUrl, description } = req.body;

    // ✅ Validate
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Tiêu đề không được bỏ trống" });
    }

    if (!youtubeUrl || !isValidYouTubeUrl(youtubeUrl)) {
      return res.status(400).json({ error: "URL YouTube không hợp lệ" });
    }

    const videoId = getYouTubeVideoId(youtubeUrl);

    // Check if battlefield exists
    const [check] = await pool.query(
      `SELECT id FROM battlefields WHERE id = ?`,
      [id],
    );

    if (check.length === 0) {
      return res.status(404).json({ error: "Chiến dịch không tồn tại" });
    }

    // Update battlefield
    await pool.query(
      `UPDATE battlefields 
       SET title = ?, youtube_url = ?, video_id = ?, description = ?, updated_at = NOW()
       WHERE id = ?`,
      [title.trim(), youtubeUrl, videoId, description || null, id],
    );

    // Return updated battlefield
    const [updated] = await pool.query(
      `SELECT * FROM battlefields WHERE id = ?`,
      [id],
    );

    const [images] = await pool.query(
      `SELECT id, image_url, upload_order FROM battlefield_images 
       WHERE battlefield_id = ? ORDER BY upload_order`,
      [id],
    );

    res.json({
      message: "Cập nhật thành công",
      data: {
        ...updated[0],
        images,
      },
    });
  } catch (error) {
    console.error("Error updating battlefield:", error);
    res.status(500).json({ error: "Lỗi cập nhật: " + error.message });
  }
});

// 🖼️ POST /api/admin/battlefield/:id/images - Add more images to battlefield
router.post(
  "/:id/images",
  auth,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ error: "Vui lòng tải lên ít nhất 1 ảnh" });
      }

      // Check if battlefield exists
      const [check] = await pool.query(
        `SELECT id FROM battlefields WHERE id = ?`,
        [id],
      );

      if (check.length === 0) {
        return res.status(404).json({ error: "Chiến dịch không tồn tại" });
      }

      // Get max order number
      const [maxOrder] = await pool.query(
        `SELECT MAX(upload_order) as max_order FROM battlefield_images WHERE battlefield_id = ?`,
        [id],
      );

      let nextOrder = (maxOrder[0].max_order || 0) + 1;

      // Insert new images
      const imageInserts = req.files.map((file) => {
        const imageUrl = `/uploads/battlefields/${file.filename}`;
        const queryPromise = pool.query(
          `INSERT INTO battlefield_images 
         (battlefield_id, image_url, filename, upload_order)
         VALUES (?, ?, ?, ?)`,
          [id, imageUrl, file.filename, nextOrder],
        );
        nextOrder++;
        return queryPromise;
      });

      await Promise.all(imageInserts);

      // Get all images
      const [images] = await pool.query(
        `SELECT id, image_url, upload_order FROM battlefield_images 
       WHERE battlefield_id = ? ORDER BY upload_order`,
        [id],
      );

      res.status(201).json({
        message: "Thêm ảnh thành công",
        data: images,
      });
    } catch (error) {
      console.error("Error adding images:", error);
      res.status(500).json({ error: "Lỗi thêm ảnh: " + error.message });
    }
  },
);

// 🗑️ DELETE /api/admin/battlefield/:id/images/:imageId - Delete single image
router.delete("/:id/images/:imageId", auth, async (req, res) => {
  try {
    const { id, imageId } = req.params;

    // Get image to delete file
    const [image] = await pool.query(
      `SELECT filename FROM battlefield_images WHERE id = ? AND battlefield_id = ?`,
      [imageId, id],
    );

    if (image.length === 0) {
      return res.status(404).json({ error: "Ảnh không tồn tại" });
    }

    // Delete from filesystem
    const filePath = path.join(uploadDir, image[0].filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await pool.query(
      `DELETE FROM battlefield_images WHERE id = ? AND battlefield_id = ?`,
      [imageId, id],
    );

    // Reorder remaining images
    await pool.query(
      `SET @row:=0; UPDATE battlefield_images SET upload_order = (@row:=@row+1) 
       WHERE battlefield_id = ? ORDER BY upload_order`,
      [id],
    );

    // Get remaining images
    const [images] = await pool.query(
      `SELECT id, image_url, upload_order FROM battlefield_images 
       WHERE battlefield_id = ? ORDER BY upload_order`,
      [id],
    );

    res.json({
      message: "Xóa ảnh thành công",
      data: images,
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Lỗi xóa ảnh: " + error.message });
  }
});

// 🗑️ DELETE /api/admin/battlefield/:id - Delete entire battlefield
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get all images to delete files
    const [images] = await pool.query(
      `SELECT filename FROM battlefield_images WHERE battlefield_id = ?`,
      [id],
    );

    // Delete from filesystem
    images.forEach((img) => {
      const filePath = path.join(uploadDir, img.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Delete images from database
    await pool.query(
      `DELETE FROM battlefield_images WHERE battlefield_id = ?`,
      [id],
    );

    // Delete battlefield
    const [result] = await pool.query(`DELETE FROM battlefields WHERE id = ?`, [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Chiến dịch không tồn tại" });
    }

    res.json({
      message: "Xóa chiến dịch thành công",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting battlefield:", error);
    res.status(500).json({ error: "Lỗi xóa: " + error.message });
  }
});

module.exports = router;
