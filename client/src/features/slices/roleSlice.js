import { createSlice } from "@reduxjs/toolkit";
import {
  createRoleLevelThunk,
  createRoleThunk,
  deleteRoleLevelThunk,
  deleteRoleThunk,
  getPermissionsThunk,
  getRoleLevelPermsThunk,
  getRoleLevelsThunk,
  getRolesThunk,
  updateRoleLevelThunk,
  updateRoleThunk,
  updateRoleLevelPermThunk,
  createRoleLevelPermThunk,
  assignRoleToUserThunk,
} from "../thunks/roleThunk";

const initialState = {
  roles: [],
  roleLevels: [],
  permissions: [],
  roleLevelPerms: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    };

    const handleRejected = (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.error.message || "İşlem sırasında hata oluştu.";
    };

    builder
      // GET Roles
      .addCase(getRolesThunk.pending, handlePending)
      .addCase(getRolesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roles = action.payload;
        state.isSuccess = true;
      })
      .addCase(getRolesThunk.rejected, handleRejected)

      // CREATE Role
      .addCase(createRoleThunk.pending, handlePending)
      .addCase(createRoleThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roles.push(action.payload);
        state.isSuccess = true;
      })
      .addCase(createRoleThunk.rejected, handleRejected)

      // UPDATE Role
      .addCase(updateRoleThunk.pending, handlePending)
      .addCase(updateRoleThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload;
        state.roles = state.roles.map((r) =>
          r.id === updated.id ? updated : r
        );
        state.isSuccess = true;
      })
      .addCase(updateRoleThunk.rejected, handleRejected)

      // DELETE Role
      .addCase(deleteRoleThunk.pending, handlePending)
      .addCase(deleteRoleThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roles = state.roles.filter((r) => r.id !== action.payload.id);
        state.isSuccess = true;
      })
      .addCase(deleteRoleThunk.rejected, handleRejected)

      // GET RoleLevels
      .addCase(getRoleLevelsThunk.pending, handlePending)
      .addCase(getRoleLevelsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roleLevels = action.payload;
        state.isSuccess = true;
      })
      .addCase(getRoleLevelsThunk.rejected, handleRejected)

      // CREATE RoleLevel
      .addCase(createRoleLevelThunk.pending, handlePending)
      .addCase(createRoleLevelThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roleLevels.push(action.payload);
        state.isSuccess = true;
      })
      .addCase(createRoleLevelThunk.rejected, handleRejected)

      // UPDATE RoleLevel
      .addCase(updateRoleLevelThunk.pending, handlePending)
      .addCase(updateRoleLevelThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload;
        state.roleLevels = state.roleLevels.map((r) =>
          r.id === updated.id ? updated : r
        );
        state.isSuccess = true;
      })
      .addCase(updateRoleLevelThunk.rejected, handleRejected)

      // DELETE RoleLevel
      .addCase(deleteRoleLevelThunk.pending, handlePending)
      .addCase(deleteRoleLevelThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roleLevels = state.roleLevels.filter(
          (r) => r.id !== action.payload.id
        );
        state.isSuccess = true;
      })
      .addCase(deleteRoleLevelThunk.rejected, handleRejected)

      // GET Permissions
      .addCase(getPermissionsThunk.pending, handlePending)
      .addCase(getPermissionsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.permissions = action.payload;
        state.isSuccess = true;
      })
      .addCase(getPermissionsThunk.rejected, handleRejected)

      // GET RoleLevelPerms
      .addCase(getRoleLevelPermsThunk.pending, handlePending)
      .addCase(getRoleLevelPermsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roleLevelPerms = action.payload;
        state.isSuccess = true;
      })
      .addCase(getRoleLevelPermsThunk.rejected, handleRejected)

      // CREATE RoleLevelPerm
      .addCase(createRoleLevelPermThunk.pending, handlePending)
      .addCase(createRoleLevelPermThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roleLevelPerms = [...state.roleLevelPerms, ...action.payload];
        state.isSuccess = true;
      })
      .addCase(createRoleLevelPermThunk.rejected, handleRejected)

      // UPDATE RoleLevelPerm
      .addCase(updateRoleLevelPermThunk.pending, handlePending)
      .addCase(updateRoleLevelPermThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roleLevelPerms = action.payload;
        state.isSuccess = true;
      })
      .addCase(updateRoleLevelPermThunk.rejected, handleRejected)

      // ASSIGN Role
      .addCase(assignRoleToUserThunk.pending, handlePending)
      .addCase(assignRoleToUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.map((user) => {
          if (user.id === action.payload.userId) {
            user.roles = action.payload.roles;
          }
          return user;
        });
      })
      .addCase(assignRoleToUserThunk.rejected, handleRejected);
  },
});

export default roleSlice.reducer;
