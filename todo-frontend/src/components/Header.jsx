
import './Header.css';
import { useNavigate} from 'react-router-dom'
import { useState, useEffect } from 'react';
import { use } from 'react';
function Header() {
    const navigate = useNavigate();
    const token = (localStorage.getItem("token") === null) ? false : true;
    useEffect(() => {
        console.log("Token in Header:", token);
    }, [token])
    return (
        <div className="Header">
            <h2>To-do List App</h2>
            <div className="btn-group">
                {!token && (
                    <>
                        <button className='btn-header' onClick={(e)=>{e.preventDefault(); navigate("/login"); }}>เข้าสู่ระบบ</button>
                        <button className='btn-header' onClick={(e)=>{e.preventDefault(); navigate("/register"); }}>สมัครสมาชิก</button>
                    </>
                )}

                {token && (
                    <>
                    <button className='btn-header' onClick={(e)=>{e.preventDefault(); navigate("/login"); localStorage.removeItem("token") }}>ออกจากระบบ</button>
                    </>
                )}
            </div>
            
        </div>
    );
}  

export default Header;