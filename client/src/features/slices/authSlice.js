import { createSlice } from "@reduxjs/toolkit";
import {
  loginThunk,
  setup2FAThunk,
  verify2FAThunk,
  registerThunk,
  passwordEmailThunk,
  updatePasswordThunk,
  logoutThunk,
  bulkRegisterThunk,
  uploadUserImagesThunk,
  adminLoginThunk,
  verifyCodeThunk,
} from "../thunks/authThunk";

const initialState = {
  users: [],
  ad: "",
  token: "",
  isAuthenticated: false,
  error: "",
  loading: false,
  alert: { message: "", type: "" },
  qrCode: "",
  is2FAEnabled: false,
  secret: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAlert: (state) => {
      state.alert = { message: "", type: "" };
    },
    setAlert: (state, action) => {
      state.alert = {
        message: action.payload.message,
        type: action.payload.type,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Kullanıcı login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.is2FAEnabled = action.payload.is2FAEnabled;

      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu!";
        state.alert = {
          message: action.payload?.error || "Giriş başarısız",
          type: "danger",
        };
      })

      // Admin login
      .addCase(adminLoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.is2FAEnabled = action.payload.is2FAEnabled;
        state.alert = {
          message: "Admin girişi başarılı",
          type: "success",
        };
      })
      .addCase(adminLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu!";
        state.alert = {
          message: action.payload?.message || "Admin girişi başarısız",
          type: "danger",
        };
      })

      // Register
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.alert = {
          message: "Kayıt başarılı, giriş yapabilirsiniz",
          type: "success",
        };
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Kayıt hatası!";
        state.alert = { message: state.error, type: "danger" };
      })

      // Şifre sıfırlama mail
      .addCase(passwordEmailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(passwordEmailThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.alert = {
          message: "Sıfırlama e-postası gönderildi",
          type: "success",
        };
      })
      .addCase(passwordEmailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu!";
        state.alert = { message: state.error, type: "danger" };
      })

      // Şifre güncelleme
      .addCase(updatePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.alert = {
          message: "Şifre başarıyla güncellendi",
          type: "success",
        };
      })
      .addCase(updatePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu!";
        state.alert = { message: state.error, type: "danger" };
      })

      // Logout
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.ad = "";
        state.token = "";
        state.isAuthenticated = false;
        state.alert = {
          message: "Çıkış yapıldı",
          type: "success",
        };
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu!";
        state.alert = { message: state.error, type: "danger" };
      })

      // Toplu kayıt
      .addCase(bulkRegisterThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkRegisterThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.alert = {
          message: "Toplu kullanıcı kaydı başarılı",
          type: "success",
        };
      })
      .addCase(bulkRegisterThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu!";
        state.alert = { message: state.error, type: "danger" };
      })

      // Görsel yükleme
      .addCase(uploadUserImagesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadUserImagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.alert = {
          message: "Kullanıcı görselleri başarıyla yüklendi",
          type: "success",
        };
      })
      .addCase(uploadUserImagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu!";
        state.alert = { message: state.error, type: "danger" };
      })

      // 2FA kurulumu
      .addCase(setup2FAThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setup2FAThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.qrCode = action.payload.qrCodeDataURL;
        state.secret = action.payload.secret;
      })
      .addCase(setup2FAThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu!";
        state.alert = { message: state.error, type: "danger" };
      })

      // 2FA doğrulama
      .addCase(verify2FAThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verify2FAThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.ad = action.payload.ad;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.alert = {
          message: "2FA doğrulandı, giriş başarılı",
          type: "success",
        };
      })
      .addCase(verify2FAThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu!";
        state.alert = { message: state.error, type: "danger" };
      })

      // Kod doğrulama (verifyCodeThunk)
      .addCase(verifyCodeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyCodeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.alert = {
          message: "Kod doğrulandı",
          type: "success",
        };
      })
      .addCase(verifyCodeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Kod doğrulanamadı";
        state.alert = { message: state.error, type: "danger" };
      });
  },
});

export const { clearAlert, setAlert } = authSlice.actions;
export default authSlice.reducer;
