import { useState,useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom'
import { use } from "react";

import './Dashboard.css'

function Dashboard(){
    const [topic, setTopic] = useState("");
    const [des, setDes] = useState("");
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);

    function settopic(e){
        setTopic(e);
    }

    function setdes(e){
        setDes(e);
    }

    function swalError(){
        Swal.fire({
             title: 'กรุณาเข้าสู่ระบบ',
             text: 'คุณต้องเข้าสู่ระบบเพื่อเข้าถึงแดชบอร์ด',
             icon: 'warning',
            confirmButtonText: 'ตกลง'
         }).then((result) => {
             console.log("Navigating to login page",result);
             localStorage.removeItem("token");
             navigate("/login");
          });
    }

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

    function addtask(e){
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (topic.trim() === "" || des.trim() === "") {
            Swal.fire({
                            title: 'เกิดข้อผิดพลาด',
                            text: 'กรุณากรอกข้อมูลให้ถูกต้อง',
                            icon: 'error',
                            confirmButtonText: 'ตกลง'
                        })
            return;
        } else{
            const fetchData = async () => {
            try {
                const res = await axios.post("http://localhost:5000/todo/create", {
                    topic: topic,
                    des: des
                }, {
                    headers: {
                        Authorization:  `Bearer ${token}`
                    }
                });
                console.log("Task added:", res.data);
                gettask();
            } catch (error) {
                swalError();
            }
        }
        fetchData();
        console.log("Add task function called");

        }
        
    }

    function deletetask (e, id){
        e.preventDefault();
        const token = localStorage.getItem("token");
        const fetchData = async () =>{
            try {
                const res = await axios.delete(`http://localhost:5000/todo/delete/${id}`,{
                    headers: {
                        Authorization:  `Bearer ${token}`
                    }
                });
                console.log("Task deleted:", res.data);
                gettask();
            } catch (error) {
                swalError();
                console.error("Error deleting task:", error);
            }
        }
        fetchData();
    }

    function updatetask(e, id,status){
        e.preventDefault();
        const token = localStorage.getItem("token");
        const fetchData = async () => {
            try {
                const res = await axios.put(`http://localhost:5000/todo/update/${id}`, {
                    status: status
                },{
                    headers: {
                        Authorization:  `Bearer ${token}`
                    }  
                });
                console.log("Task updated:", res.data);
                gettask();
            } catch (error) {
                swalError();
                console.error("Error updating task:", error);
            }
        }
        fetchData();
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
                     swalError();
                    
                }
            };
            fetchData();
        }
    },[])
    return(
        <div className="dashboard-section">
            <div>
                <form className="add">
                    <label >ชื่อรายการ</label>
                    <input type="text" onChange={(e)=>setTopic(e.target.value)} placeholder="การบ้านคณิตศาสตร์" />
                    <label >คำอธิบาย</label>
                    <input type="text" onChange={(e)=>setDes(e.target.value)} placeholder="บวกเลข 20 ข้อ เขียนลงกระดาษ ส่ง 12/9/69" />
                    <button type="submit" onClick={(e)=>{addtask(e)}}>เพิ่มรายการ</button>
                </form>
            </div>
            <ul>
                {tasks.map((task,index) => (
                    <li key={task.id}>
                        <p style={{textDecoration: task.status === 'complete' ? 'line-through' : 'none'}}>{index + 1}. {task.topic}</p>      
                        <p>{task.des}</p>
                        <div className="btn-group">
                            <button className={task.status==='progress'? 'btn-progress' : 'btn-complete'} onClick={(e)=>{updatetask(e, task.id,task.status)}}>{task.status==='progress'? 'กำลังดำเนินการ' : 'สำเร็จ'}</button>
                        <button className="btn-delete" onClick={(e)=>{deletetask(e,task.id)}}>ลบรายการ</button>
                        </div>
                        
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Dashboard;