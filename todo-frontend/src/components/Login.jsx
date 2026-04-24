import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [emailvalid, setEmailValid] = useState(false);

    function emailvalidation(e) {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
            setEmail(e);
            setEmailValid(true);
        } else {
            setEmailValid(false);
        }
    }

    function passwordvalidation(e) {
        setPassword(e);
    }

    function submit(e) {
        e.preventDefault();
        if (emailvalid) {
            setLoading(true);
            const login = async () => {
                try {
                    const res = await axios.post("http://localhost:5000/login", {
                        email,
                        password
                    })
                    console.log("Login successful:", res.data);
                    localStorage.setItem("token", res.data.token);
                    Swal.fire({
                        title: 'สำเร็จ',
                        text: 'คุณได้เข้าสู่ระบบเรียบร้อยแล้ว',
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    })
                    navigate("/dashboard");

                } catch (error) {
                    console.error("Login error:", error.response.data.error);
                    Swal.fire({
                        title: 'เกิดข้อผิดพลาด',
                        text: error.response.data.error,
                        icon: 'error',
                        confirmButtonText: 'ตกลง'
                    })
                }
            }
            login();
        }
    }

    return (
        <div className="Login-section">
            <h2>เข้าสู่ระบบ</h2>
            <form action="">
                <label>อีเมล</label>
                <input type="email" onChange={(e) => { emailvalidation(e.target.value) }} placeholder="example@gmail.com" />
                <label>รหัสผ่าน</label>
                <input type="password" onChange={(e) => { passwordvalidation(e.target.value) }} placeholder="password" />
                <button type="submit" onClick={(e) => submit(e)}>Login</button>
            </form>
        </div>
    )
}

export default Login;