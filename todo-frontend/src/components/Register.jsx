import { use } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [emailvalid, setEmailValid] = useState(false);
    const [passwordlength, setPasswordLength] = useState(false);
    const [poassworduppercase, setPasswordUppercase] = useState(false);
    const [passwordspecial, setPasswordSpecial] = useState(false);
    const [passwordmatch, setPasswordMatch] = useState(false);

    function emailvalidation(e){
        if( /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ){
            setEmail(e);
            setEmailValid(true);
        } else{
            setEmailValid(false);
        }
    }

    function passwordvalidation(e){

        if (e.length >= 8) {
            setPasswordLength(true);
        } else {
            setPasswordLength(false);
        }
        if (/[A-Z]/.test(e)) {
            setPasswordUppercase(true);
        } else {
            setPasswordUppercase(false);
        }
        if (/[!@#$%^&*(),.?":{}|<>]/.test(e)) {
            setPasswordSpecial(true);
        } else {
            setPasswordSpecial(false);
        }
        setPassword(e);
    }

    function submit(e){
        e.preventDefault();
        if (emailvalid && passwordlength && poassworduppercase && passwordspecial && passwordmatch) {
            setLoading(true);
            const register = async () => {
                try {
                    const res = await axios.post("http://localhost:5000/register",{
                        email: email,
                        password: password
                    });
                    Swal.fire({
                        title: 'สำเร็จ',
                        text: 'คุณได้สมัครสมาชิกเรียบร้อยแล้ว',
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    })
                    console.log("Registering user with email:", email);
                    
                } catch (error) {
                    console.log(error.response.data.error);
                    Swal.fire({
                        title: 'เกิดข้อผิดพลาด',
                        text: error.response.data.error,
                        icon: 'error',
                        confirmButtonText: 'ตกลง'
                    })
                }
                 setLoading(false);
            }
            register();
           
        }
    }

    const passwordMatchValidation = (e) => {
        if (e === password) {
            setPasswordMatch(true);
        } else {
            setPasswordMatch(false);
        }
    }

    return(
        <div className="Register-section">
            <h2>สมัครสมาชิก</h2>
            <form action="">
               <label>อีเมล</label>
                <input type="email" onChange={(e)=>{emailvalidation(e.target.value)}} placeholder="example@gmail.com"/>
                <label>รหัสผ่าน</label>
                <input type="password" onChange={(e)=>{passwordvalidation(e.target.value)}} placeholder="password"/>
                <label>ยืนยันรหัสผ่าน</label>
                <input type="password" onChange={(e)=>{passwordMatchValidation(e.target.value)}} placeholder="confirm password"/>
                <button type="submit" onClick={(e)=>{submit(e)}}>Register</button> 
            </form>
            
            
        </div>
    )
}

export default Register;