import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CustomInput from '../../components/UI/CustomInput';
import { AuthContext } from '../../context/AuthContext';
import axios from "axios";
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Login() {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    // Formik validation and initialization
    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .required('Kullanıcı adı gerekli!'),
            password: Yup.string()
                .required('Şifre gerekli!')
                .min(8, 'Şifre en az 8 karakter olmalı')
                .matches(/[a-zA-Z0-9]/, 'Şifre yalnızca harf ve rakamlardan oluşabilir')
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post('http://localhost:5000/login', {
                    username: values.username,
                    password: values.password
                });

                const token = response.data.token;
                authCtx.authenticate(token); // Token'i context'e kaydedebilirsin
                Swal.fire({
                    title: "Giriş Başarılı!",
                    text: "Ana sayfaya yönlendiriliyorsunuz...",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    navigate("/");
                });
            } catch (error) {
                Swal.fire({
                    title: "Hatalı Giriş!",
                    text: "Kullanıcı adı veya şifre yanlış.",
                    icon: "error",
                    confirmButtonText: "Tamam"
                });
            }
        }
    });

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
                <form className="custom-form" name="login_form" onSubmit={formik.handleSubmit}>
                    <CustomInput
                        type="text"
                        name="username"
                        placeholder="Kullanıcı Adı"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.username && formik.errors.username}
                    />
                    <CustomInput
                        type="password"
                        name="password"
                        placeholder="Şifre"
                        id="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        icon={<i className="fa-regular fa-eye"></i>}
                        error={formik.touched.password && formik.errors.password}
                    />
                    <button className="custom-btn" type="submit">Giriş Yap</button>
                </form>
            </div>
        </section>
    );
}

export default Login;
