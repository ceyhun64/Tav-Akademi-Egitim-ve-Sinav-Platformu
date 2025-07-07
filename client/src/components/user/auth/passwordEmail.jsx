import React, { useState } from 'react'// reactı dahil ediyoruz
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearAlert } from '../../../features/slices/authSlice';
import { passwordEmailThunk } from '../../../features/thunks/authThunk';

export default function PasswordEmail() {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const { alert, loading } = useSelector((state) => state.auth);
    const handlePasswordEmail = async (e) => {
        e.preventDefault();
        try {
            const action = await dispatch(passwordEmailThunk({ email })).unwrap();
            console.log("Şifre maili gönderme başarılı:", action);
            setTimeout(() => {
                dispatch(clearAlert()); // Alerti temizle
            }, 1000);
        } catch (error) {
            console.error("Mail gönderme hatası:", error);
            setTimeout(() => {
                dispatch(clearAlert()); // Alerti temizle
            }, 1000);
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                {alert.message && (//alertin mesajı varsa
                    <div className={`alert alert-${alert.type}`} role="alert">{/* alertin türüne göre yukarıda atadığımız alertin classını ayarlıyoruz */}
                        {alert.message}{/* alertin mesajını gösteriyoruz */}
                    </div>
                )}
                <div className="col-md-6">
                    <div className="card p-4 shadow-lg">
                        <h3 className="text-center mb-4">Şifre Yenileme</h3>
                        <form onSubmit={handlePasswordEmail}>{/* formun kullanıcı tarafından doldurulup gönderilmesi durumunda handlePasswordEmail fonksiyonunu çalıştırıyoruz */}
                            <div className="form-group mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}//email stateini inputun value'sine eşitliyoruz
                                    onChange={(e) => setEmail(e.target.value)}//kullanıcı değer girdiğinde setEmail fonksiyonunu çağırıyoruz email değerine girilen değeri atıyoruz
                                />
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-dark w-100">
                                    {loading ? (
                                        <div className="spinner-border text-light" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        "Şifre Yenileme Maili Gönder"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

}
