import { useState} from 'react';
import api from '../api/axios';

export default function Login({ onLoginSuccess }) {
    const [form, setForm] = useState({
        email: "",
        passwordHash: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/users/login", form);
            
            //TODO temporary store userId in localStorage. Can change later to JWT or any secured method.
            localStorage.setItem("userId", response.data.userId);

            setMessage(response.data.message);
            setForm({
                ...form,
                passwordHash: ""
            });

            if(onLoginSuccess)
            {
                onLoginSuccess();
            }
        } catch(error) {
            console.error("Login error: ", error);
            setMessage(error.response?.data?.message || "An error occurred. Please try again.");
        }
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit = {handleSubmit}>
                <div className="input-style">
                    <label>Email</label>
                    <input 
                        type="text"
                        name = "email"
                        placeholder = "jakepatolilic@gmail.com"
                        value = {form.email}
                        onChange = {handleChange}
                        required
                    />
                </div>
                <div className="input-style">
                    <label>Password</label>
                    <input 
                        type="password"
                        name = "passwordHash"
                        placeholder = "*********"
                        value = {form.passwordHash}
                        onChange = {handleChange}
                        required
                    />
                </div>
                <button type = "submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    )
}