import { useState } from 'react';
import api from '../api/axios';

export default function Register() {
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
            const response = await api.post("/users/register", form);
            setMessage(response.data.message);
            setForm({...form, passwordHash: ""});
        } catch(error) {
            if (error.response) {
                setMessage(error.response.data.message);
            }
            else {
                console.log(error);
                setMessage("An error occurred. Please try again.");
            }
            console.log(error);
        }
    }

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-style">
                    <label>Email</label>
                    <input 
                        type = "text" 
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
                        type = "password"
                        name = "passwordHash"
                        placeholder = "********"
                        value = {form.passwordHash}
                        onChange = {handleChange}
                        required
                    />
                </div>
                <button type = "submit">Register</button>
            </form>
            <p>{message}</p>
        </div>
    )
}