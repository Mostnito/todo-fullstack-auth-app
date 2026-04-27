import { useState,useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom'
import { use } from "react";

function Dashboard(){
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);

    function gettask(){
        const token = localStorage.getItem("token");
        const fecthData = async () => {
            try {
                const res = await axios.get("http://localhost:5000/todo", {
                    headers: {
                        Authorization:  `Bearer ${token}`
                    }
                });
                setTasks(res.data);
                console.log("Fetched tasks:", res.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        }
        fecthData();
       
    }

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(!token){
            Swal.fire({
                title: 'กรุณาเข้าสู่ระบบ',
                text: 'คุณต้องเข้าสู่ระบบเพื่อเข้าถึงแดชบอร์ด',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            })
            navigate("/login");
        } else {
            const fetchData = async () => {
                try{
                    const res = await axios.get("http://localhost:5000/check", {
                        headers: {
                            Authorization:  `Bearer ${token}`
                        }
                    });
                    gettask();
                } catch (error) {
                     Swal.fire({
                        title: 'กรุณาเข้าสู่ระบบ',
                        text: 'คุณต้องเข้าสู่ระบบเพื่อเข้าถึงแดชบอร์ด',
                        icon: 'warning',
                        confirmButtonText: 'ตกลง'
                    })
                    console.error("Invalid token:", error.response.data.error);
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            };
            fetchData();
        }
    },[])
    return(
        <div>
            <h1>Dashboard</h1>
            <p>This is the dashboard page. You can manage your tasks here.</p>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <h3>{task.id},{task.topic}</h3>
                        <p>{task.des}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Dashboard;