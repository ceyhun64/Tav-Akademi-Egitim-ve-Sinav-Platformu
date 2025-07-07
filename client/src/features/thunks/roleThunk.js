import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createRole,
  createRoleLevel,
  createRoleLevelPerm,
  deleteRole,
  deleteRoleLevel,
  getPermissions,
  getRoleLevelPerms,
  getRoleLevels,
  getRoles,
  updateRole,
  updateRoleLevel,
  updateRoleLevelPerm,
  assignRoleToUser,
} from "../services/roleService";

export const getRolesThunk = createAsyncThunk(
  "role/getRoles",
  async (_, thunkAPI) => {
    try {
      const response = await getRoles();
      console.log("response:", response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const createRoleThunk = createAsyncThunk(
  "role/createRole",
  async (formData, thunkAPI) => {
    try {
      const response = await createRole(formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateRoleThunk = createAsyncThunk(
  "role/updateRole",
  async ({ id, formData }, thunkAPI) => {
    try {
      console.log("formData thunk:", formData);
      const response = await updateRole(id, formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deleteRoleThunk = createAsyncThunk(
  "role/deleteRole",
  async (id, thunkAPI) => {
    try {
      const response = await deleteRole(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getRoleLevelsThunk = createAsyncThunk(
  "role/getRoleLevels",
  async (_, thunkAPI) => {
    try {
      const response = await getRoleLevels();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const createRoleLevelThunk = createAsyncThunk(
  "role/createRoleLevel",
  async (formData, thunkAPI) => {
    try {
      const response = await createRoleLevel(formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateRoleLevelThunk = createAsyncThunk(
  "role/updateRoleLevel",
  async ({ id, name, level }, thunkAPI) => {
    try {
      console.log("formData thunk:", name);
      console.log("id thunk:", id);
      const response = await updateRoleLevel(id, name, level);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deleteRoleLevelThunk = createAsyncThunk(
  "role/deleteRoleLevel",
  async (id, thunkAPI) => {
    try {
      const response = await deleteRoleLevel(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getPermissionsThunk = createAsyncThunk(
  "role/getPermissions",
  async (_, thunkAPI) => {
    try {
      const response = await getPermissions();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getRoleLevelPermsThunk = createAsyncThunk(
  "role/getRoleLevelPerms",
  async (id, thunkAPI) => {
    try {
      const response = await getRoleLevelPerms(id);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const createRoleLevelPermThunk = createAsyncThunk(
  "role/createRoleLevelPerm",
  async (formData, thunkAPI) => {
    try {
      const response = await createRoleLevelPerm(formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateRoleLevelPermThunk = createAsyncThunk(
  "role/updateRoleLevelPerm",
  async (formData, thunkAPI) => {
    try {
      const response = await updateRoleLevelPerm(formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const assignRoleToUserThunk = createAsyncThunk(
  "user/assignRole",
  async (formData, thunkAPI) => {
    try {
      const res = await assignRoleToUser(formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Rol atanamadı");
    }
  }
);
