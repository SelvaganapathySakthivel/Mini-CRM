const mongoose = require("mongoose");
const Task = require("../models/Task");
const User = require("../models/User");
const Lead = require("../models/Lead");

const ALLOWED_STATUSES = ["Pending", "In Progress", "Completed"];

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status, assignedTo, lead } = req.body || {};

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid task status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
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

    if (lead) {
      if (!mongoose.Types.ObjectId.isValid(lead)) {
        return res.status(400).json({
          message: "Invalid lead ID",
        });
      }
      const existingLead = await Lead.findOne({ _id: lead, isDeleted: false });
      if (!existingLead) {
        return res.status(400).json({
          message: "Lead does not exist or has been deleted",
        });
      }
    }

    let parsedDueDate = undefined;
    if (dueDate) {
      const date = new Date(dueDate);
      if (isNaN(date.getTime())) {
        return res.status(400).json({
          message: "Invalid due date format",
        });
      }
      parsedDueDate = date;
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description && typeof description === "string" ? description.trim() : undefined,
      dueDate: parsedDueDate,
      status: status || "Pending",
      assignedTo: assignedTo || null,
      lead: lead || null,
      createdBy: req.user?.userId || null,
    });

    const task = await Task.findById(newTask._id)
      .populate("assignedTo", "name email")
      .populate("lead", "name email phone status company")
      .populate("createdBy", "name email");

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const { status, assignedTo, lead, dueDate } = req.query;
    const query = {};

    if (status && status.trim() !== "") {
      const trimmedStatus = status.trim();
      if (!ALLOWED_STATUSES.includes(trimmedStatus)) {
        return res.status(400).json({
          message: `Invalid task status filter. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
        });
      }
      query.status = trimmedStatus;
    }

    if (assignedTo && assignedTo.trim() !== "") {
      if (!mongoose.Types.ObjectId.isValid(assignedTo.trim())) {
        return res.status(400).json({
          message: "Invalid assignedTo user ID in filter",
        });
      }
      query.assignedTo = assignedTo.trim();
    }

    if (lead && lead.trim() !== "") {
      if (!mongoose.Types.ObjectId.isValid(lead.trim())) {
        return res.status(400).json({
          message: "Invalid lead ID in filter",
        });
      }
      query.lead = lead.trim();
    }

    if (dueDate && dueDate.trim() !== "") {
      const date = new Date(dueDate.trim());
      if (isNaN(date.getTime())) {
        return res.status(400).json({
          message: "Invalid due date filter format",
        });
      }
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      query.dueDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("lead", "name email phone status company")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id)
      .populate("assignedTo", "name email")
      .populate("lead", "name email phone status company")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch task",
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, status, assignedTo, lead } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (title !== undefined) {
      if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "Task title cannot be empty",
        });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description && typeof description === "string" ? description.trim() : undefined;
    }

    if (dueDate !== undefined) {
      if (dueDate === null || dueDate === "") {
        task.dueDate = undefined;
      } else {
        const date = new Date(dueDate);
        if (isNaN(date.getTime())) {
          return res.status(400).json({
            message: "Invalid due date format",
          });
        }
        task.dueDate = date;
      }
    }

    if (status !== undefined) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({
          message: `Invalid task status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
        });
      }
      task.status = status;
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
        task.assignedTo = assignedTo;
      } else {
        task.assignedTo = null;
      }
    }

    if (lead !== undefined) {
      if (lead) {
        if (!mongoose.Types.ObjectId.isValid(lead)) {
          return res.status(400).json({
            message: "Invalid lead ID",
          });
        }
        const existingLead = await Lead.findOne({ _id: lead, isDeleted: false });
        if (!existingLead) {
          return res.status(400).json({
            message: "Lead does not exist or has been deleted",
          });
        }
        task.lead = lead;
      } else {
        task.lead = null;
      }
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("lead", "name email phone status company")
      .populate("createdBy", "name email");

    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Valid status is required. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Only the assigned user can update task status
    const currentUserId = req.user?.userId;
    if (!task.assignedTo || task.assignedTo.toString() !== currentUserId?.toString()) {
      return res.status(403).json({
        message: "Unauthorized: Only the assigned user can update task status",
      });
    }

    task.status = status;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("lead", "name email phone status company")
      .populate("createdBy", "name email");

    res.json({
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task status",
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await Task.findByIdAndDelete(id);

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
