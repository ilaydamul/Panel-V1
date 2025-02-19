import React, { useState } from "react";

function CustomInput({ type, name, placeholder, id, icon, value, onChange }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="input-wrapper">
            <input
                type={type === "password" && showPassword ? "text" : type}
                name={name}
                placeholder={placeholder}
                id={id}
                value={value}
                onChange={onChange}
            />
            {type === "password" && (
                <span className="input-icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <i className="fa-regular fa-eye-slash"></i> : icon}
                </span>
            )}
        </div>
    );
}

export default CustomInput;
