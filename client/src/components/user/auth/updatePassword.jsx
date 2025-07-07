import React, { useState } from 'react';// reactı dahil ediyoruz
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,useParams } from 'react-router-dom';
import { clearAlert } from '../../../features/slices/authSlice';
import { updatePasswordThunk } from '../../../features/thunks/authThunk';

export default function UpdatePassword() {
    const [sifre, setPassword] = useState('');
    const [yenisifre, setNewPassword] = useState('');
    const [tekraryenisifre, setAgainNewPassword] = useState('');
    const { alert, loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams(); // URL'den token'ı alın

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        try {
            const action = await dispatch(updatePasswordThunk({token, sifre, yenisifre, tekraryenisifre })).unwrap();
            console.log("Şifre güncelleme başarılı:", action);
            setTimeout(() => {
                navigate('/login'); // Ana sayfaya yönlendir
                dispatch(clearAlert()); // Alerti temizle
            }, 1000);
        } catch (error) {
            console.error("Şifre güncelleme hatası:", error);
            setTimeout(() => {
                navigate('update-password'); // Ana sayfaya yönlendir
                dispatch(clearAlert()); // Alerti temizle
            }, 1000);
        }
    }


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4 shadow-lg">
                        <h3 className="text-center fw-bold mb-4">Şifreyi Sıfırla</h3>

                        {/* Alert Mesajı */}
                        {alert.message && (//alertin mesajı varsa
                            <div className={`alert alert-${alert.type}`} role="alert">{/* alertin türüne göre yukarıda atadığımız alertin classını ayarlıyoruz */}
                                {alert.message}{/* alertin mesajını yazdırıyoruz */}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleUpdatePassword}>{/* formun submit edilmesi için handleUpdatePassword fonksiyonunu çağırıyoruz */}
                            {/* Eski Şifre */}
                            <div className="form-group mb-3">
                                <label htmlFor="sifre" className="form-label">Eski Şifre</label>
                                <input
                                    id="sifre"
                                    type="password"
                                    className="form-control"
                                    placeholder="Eski Şifre"
                                    value={sifre}//password stateini alıyoruz
                                    onChange={(e) => setPassword(e.target.value)}//password stateini set ediyoruz
                                    required
                                />
                            </div>

                            {/* Yeni Şifre */}
                            <div className="form-group mb-3">
                                <label htmlFor="newPassword" className="form-label">Yeni Şifre</label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    className="form-control"
                                    placeholder="Yeni Şifre"
                                    value={yenisifre}//newPassword stateini alıyoruz
                                    onChange={(e) => setNewPassword(e.target.value)}//newPassword stateini set ediyoruz
                                    required
                                />
                            </div>

                            {/* Yeni Şifre Tekrar */}
                            <div className="form-group mb-3">
                                <label htmlFor="againNewPassword" className="form-label">Yeni Şifre (Tekrar)</label>
                                <input
                                    id="tekraryenisifre"
                                    type="password"
                                    className="form-control"
                                    placeholder="Yeni Şifre (Tekrar)"
                                    value={tekraryenisifre}//againNewPassword stateini alıyoruz
                                    onChange={(e) => setAgainNewPassword(e.target.value)}//againNewPassword stateini set ediyoruz
                                    required
                                />
                            </div>

                            {/* Submit Butonu */}
                            <button type="submit" className="btn btn-dark w-100 mb-3">
                                {loading ? (
                                    <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    "Şifreyi Güncelle"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
