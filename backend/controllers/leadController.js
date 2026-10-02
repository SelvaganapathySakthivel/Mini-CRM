const mongoose = require("mongoose");
const Lead = require("../models/Lead");
const User = require("../models/User");
const Company = require("../models/Company");

const ALLOWED_STATUSES = ["New", "Contacted", "Lost"];

const isValidEmail = (email) => {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const createLead = async (req, res) => {
  try {
    const { name, email, phone, status, assignedTo, company } = req.body || {};

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Lead name is required",
      });
    }

    if (email && email.trim() !== "") {
      if (!isValidEmail(email)) {
        return res.status(400).json({
          message: "Invalid email format",
        });
      }
    }

    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid lead status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
      });
    }

    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({
          message: "Invalid assignedTo user ID",
        });
      }
      const existingUser = await User.findById(assignedTo);
      if (!existingUser) {
        return res.status(400).json({
          message: "Assigned user does not exist",
        });
      }
    }

    if (company) {
      if (!mongoose.Types.ObjectId.isValid(company)) {
        return res.status(400).json({
          message: "Invalid company ID",
        });
      }
      const existingCompany = await Company.findById(company);
      if (!existingCompany) {
        return res.status(400).json({
          message: "Company does not exist",
        });
      }
    }

    const newLead = await Lead.create({
      name: name.trim(),
      email: email && email.trim() !== "" ? email.trim().toLowerCase() : undefined,
      phone: phone && typeof phone === "string" ? phone.trim() : undefined,
      status: status || "New",
      assignedTo: assignedTo || null,
      company: company || null,
      isDeleted: false,
    });

    const lead = await Lead.findById(newLead._id)
      .populate("assignedTo", "name email")
      .populate("company", "name email phone website address");

    res.status(201).json({
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create lead",
      error: error.message,
    });
  }
};

const getLeads = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const search = req.query.search;
    const status = req.query.status;

    const query = {
      isDeleted: false,
    };

    if (status && status.trim() !== "") {
      const trimmedStatus = status.trim();
      if (!ALLOWED_STATUSES.includes(trimmedStatus)) {
        return res.status(400).json({
          message: `Invalid lead status filter. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
        });
      }
      query.status = trimmedStatus;
    }

    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    const totalLeads = await Lead.countDocuments(query);
    const totalPages = Math.ceil(totalLeads / limit) || 1;

    const leads = await Lead.find(query)
      .populate("assignedTo", "name email")
      .populate("company", "name email phone website address")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      leads,
      currentPage: page,
      totalPages,
      totalLeads,
      limit,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch leads",
      error: error.message,
    });
  }
};

const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid lead ID",
      });
    }

    const lead = await Lead.findOne({
      _id: id,
      isDeleted: false,
    })
      .populate("assignedTo", "name email")
      .populate("company", "name email phone website address");

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.json({
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch lead",
      error: error.message,
    });
  }
};

const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, status, assignedTo, company } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid lead ID",
      });
    }

    const lead = await Lead.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    if (name !== undefined) {
      if (!name || typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          message: "Lead name cannot be empty",
        });
      }
      lead.name = name.trim();
    }

    if (email !== undefined) {
      if (email && email.trim() !== "") {
        if (!isValidEmail(email)) {
          return res.status(400).json({
            message: "Invalid email format",
          });
        }
        lead.email = email.trim().toLowerCase();
      } else {
        lead.email = undefined;
      }
    }

    if (phone !== undefined) {
      lead.phone = phone && typeof phone === "string" ? phone.trim() : undefined;
    }

    if (status !== undefined) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({
          message: `Invalid lead status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
        });
      }
      lead.status = status;
    }

    if (assignedTo !== undefined) {
      if (assignedTo) {
        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
          return res.status(400).json({
            message: "Invalid assignedTo user ID",
          });
        }
        const existingUser = await User.findById(assignedTo);
        if (!existingUser) {
          return res.status(400).json({
            message: "Assigned user does not exist",
          });
        }
        lead.assignedTo = assignedTo;
      } else {
        lead.assignedTo = null;
      }
    }

    if (company !== undefined) {
      if (company) {
        if (!mongoose.Types.ObjectId.isValid(company)) {
          return res.status(400).json({
            message: "Invalid company ID",
          });
        }
        const existingCompany = await Company.findById(company);
        if (!existingCompany) {
          return res.status(400).json({
            message: "Company does not exist",
          });
        }
        lead.company = company;
      } else {
        lead.company = null;
      }
    }

    await lead.save();

    const updatedLead = await Lead.findById(lead._id)
      .populate("assignedTo", "name email")
      .populate("company", "name email phone website address");

    res.json({
      message: "Lead updated successfully",
      lead: updatedLead,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update lead",
      error: error.message,
    });
  }
};

const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid lead ID",
      });
    }

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Valid status is required. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
      });
    }

    const lead = await Lead.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    lead.status = status;
    await lead.save();

    const updatedLead = await Lead.findById(lead._id)
      .populate("assignedTo", "name email")
      .populate("company", "name email phone website address");

    res.json({
      message: "Lead status updated successfully",
      lead: updatedLead,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update lead status",
      error: error.message,
    });
  }
};

const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid lead ID",
      });
    }

    const lead = await Lead.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    lead.isDeleted = true;
    await lead.save();

    res.json({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete lead",
      error: error.message,
    });
  }
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
};
