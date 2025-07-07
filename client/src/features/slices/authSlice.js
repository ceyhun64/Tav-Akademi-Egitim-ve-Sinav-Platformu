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
  adminLoginThunk, // Admin girişi için thunk
} from "../thunks/authThunk"; // Hem login hem de register thunk'larını import ediyoruz

const initialState = {
  users: [],
  ad: "",
  token: "",
  isAuthenticated: false,
  error: "",
  loading: false,
  alert: { message: "", type: "" }, // Alert state'ini ekliyoruz
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
      // action.payload: { message: string, type: string }
      state.alert = {
        message: action.payload.message,
        type: action.payload.type,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Login işlemleri
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        console.log("Login payload:", action.payload);
        state.loading = false;
        state.ad = action.payload.ad; // Kullanıcı adı
        state.token = action.payload.token; // Token
        state.isAuthenticated = true; // Kullanıcı giriş yaptı
        state.is2FAEnabled = action.payload.is2FAEnabled; // 2FA durumu
        state.alert = {
          message: "Giriş yapıldı anasayfaya yönlendiriliyorsunuz",
          type: "success",
        }; // Giriş yapılıyor mesajı
        localStorage.setItem("token", action.payload.token); // Token'ı localStorage'a kaydediyoruz
        localStorage.setItem("ad", action.payload.ad); // Kullanıcı adını da localStorage'a kaydediyoruz
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu!";
        state.alert = {
          message:
          action.payload.error ,
          type: "danger",
        }; // Hata mesajı
      })
      // admin login işlemleri
      .addCase(adminLoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        console.log("Login payload:", action.payload);
        state.loading = false;
        state.ad = action.payload.ad; // Kullanıcı adı
        state.token = action.payload.token; // Token
        state.isAuthenticated = true; // Kullanıcı giriş yaptı
        state.is2FAEnabled = action.payload.is2FAEnabled; // 2FA durumu
        state.alert = {
          message: "Giriş yapıldı anasayfaya yönlendiriliyorsunuz",
          type: "success",
        }; // Giriş yapılıyor mesajı
        localStorage.setItem("token", action.payload.token); // Token'ı localStorage'a kaydediyoruz
        localStorage.setItem("ad", action.payload.ad); // Kullanıcı adını da localStorage'a kaydediyoruz
      })
      .addCase(adminLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu!";
        state.alert = {
          message:
          action.payload.message ,
          type: "danger",
        }; // Hata mesajı
      })
      // Register işlemleri
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.ad = action.payload.user?.ad || "";
        state.token = action.payload.token || null;
        state.isAuthenticated = false; // Gerekirse true yap
        state.alert = {
          message: "Kayıt yapıldı giriş sayfasına yönlendiriliyorsunuz",
          type: "success",
        };
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Bir hata oluştu!";
        state.alert = { message: state.error, type: "danger" };
      })

      // Şifre değiştirme maili işlemleri
      .addCase(passwordEmailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(passwordEmailThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.ad = action.payload.ad; // Kullanıcı adı
        state.token = action.payload.token; // Token
        state.isAuthenticated = false; // Kullanıcı giriş yaptı
        state.alert = {
          message: "Sıfırlama maili gönderildi e-postanızı kontrol ediniz",
          type: "success",
        }; // Giriş yapılıyor mesajı
      })
      .addCase(passwordEmailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu!";
        state.alert = { message: state.error, type: "danger" }; // Hata mesajı
      })

      // Şifre güncelleme işlemleri
      .addCase(updatePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.ad = action.payload.ad; // Kullanıcı adı
        state.token = action.payload.token; // Token
        state.isAuthenticated = false; // Kullanıcı giriş yaptı
        state.alert = {
          message: "Güncelleme tamamlandı giriş yapabilirsiniz",
          type: "success",
        }; // Giriş yapılıyor mesajı
      })
      .addCase(updatePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu!";
        state.alert = { message: state.error, type: "danger" }; // Hata mesajı
      })
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.ad = null;
        state.token = null;
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
      .addCase(bulkRegisterThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkRegisterThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.alert = {
          message: "Bulk kaydedildi",
          type: "success",
        };
      })
      .addCase(bulkRegisterThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu!";
        state.alert = { message: state.error, type: "danger" };
      })
      .addCase(uploadUserImagesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadUserImagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.alert = {
          message: "Bulk kaydedildi",
          type: "success",
        };
      })
      .addCase(uploadUserImagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu!";
        state.alert = { message: state.error, type: "danger" };
      })
      .addCase(setup2FAThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setup2FAThunk.fulfilled, (state, action) => {
        state.qrCode = action.payload.qrCodeDataURL;
        state.secret = action.payload.secret;
      })
      .addCase(setup2FAThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu!";
        state.alert = { message: state.error, type: "danger" };
      })
      .addCase(verify2FAThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verify2FAThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.ad = action.payload.ad;
        state.token = action.payload.token;
        state.isAuthenticated = false;
        state.alert = {
          message: "2FA doğrulandı giriş yapabilirsiniz",
          type: "success",
        };
      })
      .addCase(verify2FAThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu!";
        state.alert = { message: state.error, type: "danger" };
      });
  },
});

export const { logout, clearAlert, setAlert } = authSlice.actions;
export default authSlice.reducer;
