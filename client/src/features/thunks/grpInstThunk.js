import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createGroup,
  deleteGroup,
  getGroups,
  updateGroup,
  createInstitution,
  deleteInstitution,
  getInstitutions,
  updateInstitution,
} from "../services/grpInstService";
export const getGroupsThunk = createAsyncThunk(
  "grpinst/getGroups",
  async () => {
    try {
      const response = await getGroups();
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
export const createGroupThunk = createAsyncThunk(
  "grpinst/createGroup",
  async ({ name }) => {
    try {
      const response = await createGroup({ name });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
export const deleteGroupThunk = createAsyncThunk(
  "grpinst/deleteGroup",
  async (id) => {
    try {
      const response = await deleteGroup(id);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
export const updateGroupThunk = createAsyncThunk(
  "grpinst/updateGroup",
  async ({ id, name }) => {
    try {
      const response = await updateGroup({ id, name });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
export const getInstitutionsThunk = createAsyncThunk(
  "grpinst/getInstitutions",
  async () => {
    try {
      const response = await getInstitutions();
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
export const createInstitutionThunk = createAsyncThunk(
  "grpinst/createInstitution",
  async ({ name }) => {
    try {
      const response = await createInstitution({ name });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
export const deleteInstitutionThunk = createAsyncThunk(
  "grpinst/deleteInstitution",
  async (id) => {
    try {
      const response = await deleteInstitution(id);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
export const updateInstitutionThunk = createAsyncThunk(
  "grpinst/updateInstitution",
  async ({ id, name }) => {
    try {
      const response = await updateInstitution({ id, name });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
