const express = require("express");

const {
  createCompany,
  getCompanies,
  getCompanyById,
  getCompanyLeads,
} = require("../controllers/companyController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createCompany);
router.get("/", authMiddleware, getCompanies);
router.get("/:id", authMiddleware, getCompanyById);
router.get("/:id/leads", authMiddleware, getCompanyLeads);

module.exports = router;