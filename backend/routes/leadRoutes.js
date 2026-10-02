const express = require("express");
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
} = require("../controllers/leadController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createLead);
router.get("/", authMiddleware, getLeads);
router.get("/:id", authMiddleware, getLeadById);
router.put("/:id", authMiddleware, updateLead);
router.patch("/:id/status", authMiddleware, updateLeadStatus);
router.delete("/:id", authMiddleware, deleteLead);

module.exports = router;
