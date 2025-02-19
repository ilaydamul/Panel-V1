import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CustomInput from '../../components/UI/CustomInput';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate(); 

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username === "gusegarage" && password === "GuseGarage1q2w3e?") {
            // navigate("/");
            Swal.fire({
                title: "Giriş Başarılı!",
                text: "Ana sayfaya yönlendiriliyorsunuz...",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                navigate("/");
            });
            // alert("Giriş Başarılı!");
        } else {
            Swal.fire({
                title: "Hatalı Giriş!",
                text: "Kullanıcı adı veya şifre yanlış.",
                icon: "error",
                confirmButtonText: "Tamam"
            });
        }
    };

    return (
        <section className="form-container">
            <div className="form-box">
                <div className="logo">
                    <img src="/images/guse-garage-logo-siyah.png" alt="Guse Garage Logo" />
                </div>
                <div className="form-info">
                    <h1>Giriş Yap</h1>
                    <div className="little-text">Guse Garage'a giriş yapın</div>
                </div>
                <form className="custom-form" name="login_form" onSubmit={handleSubmit}>
                    <CustomInput 
                        type="text" 
                        name="username" 
                        placeholder="Kullanıcı Adı" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <CustomInput 
                        type="password" 
                        name="password" 
                        placeholder="Şifre" 
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<i className="fa-regular fa-eye"></i>} 
                    />
                    <button className="custom-btn" type="submit">Giriş Yap</button>
                </form>
            </div>
        </section>
    );
}

export default Login;
