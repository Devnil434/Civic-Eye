const supabase = require('../config/supabase');

// Get all departments
const getAllDepartments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// Get single department by ID
const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch department' });
  }
};

// Create new department
const createDepartment = async (req, res) => {
  try {
    const {
      name,
      description,
      contact_email,
      contact_phone,
      head_name
    } = req.body;

    const { data, error } = await supabase
      .from('departments')
      .insert([
        {
          name,
          description,
          contact_email,
          contact_phone,
          head_name,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create department' });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment
};