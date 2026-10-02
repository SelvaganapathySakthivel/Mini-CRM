const mongoose = require("mongoose");
const Company = require("../models/Company");
const Lead = require("../models/Lead");

const createCompany = async (req, res) => {
  try {
    const { name, email, phone, website, address } = req.body || {};

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Company name is required",
      });
    }

    const company = await Company.create({
      name: name.trim(),
      email: email && typeof email === "string" ? email.trim() : undefined,
      phone: phone && typeof phone === "string" ? phone.trim() : undefined,
      website: website && typeof website === "string" ? website.trim() : undefined,
      address: address && typeof address === "string" ? address.trim() : undefined,
    });

    res.status(201).json({
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create company",
      error: error.message,
    });
  }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.json({
      companies,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch companies",
      error: error.message,
    });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid company ID",
      });
    }

    const company = await Company.findById(id).lean().exec();

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.json({
      company,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch company",
      error: error.message,
    });
  }
};

const getCompanyLeads = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid company ID",
      });
    }

    // Parallelize queries for optimal performance
    const [company, leads] = await Promise.all([
      Company.findById(id).lean().exec(),
      Lead.find({
        company: id,
        isDeleted: false,
      })
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
    ]);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.json({
      company,
      leads,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch company leads",
      error: error.message,
    });
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  getCompanyLeads,
};