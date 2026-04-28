import { useState,useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom'
import { use } from "react";

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
                if (error.response && error.response.status === 401) {
                    console.error("Invalid Token")
                    Swal.fire({
                    title: 'กรุณาเข้าสู่ระบบ',
                    text: 'คุณต้องเข้าสู่ระบบเพื่อเข้าถึงแดชบอร์ด',
                    icon: 'warning',
                    confirmButtonText: 'ตกลง'
                })
                navigate("/login");                }
                console.error("Error adding task:", error);
            }
        }
        fetchData();
        console.log("Add task function called");
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
                if (error.response && error.response.status === 401) {
                    console.error("Invalid Token")
                     Swal.fire({
                        title: 'กรุณาเข้าสู่ระบบ',
                        text: 'คุณต้องเข้าสู่ระบบเพื่อเข้าถึงแดชบอร์ด',
                        icon: 'warning',
                        confirmButtonText: 'ตกลง'
                    })
                    navigate("/login");   
                }
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
                if (error.response && error.response.status === 401) {
                    console.error("Invalid Token")
                     Swal.fire({
                        title: 'กรุณาเข้าสู่ระบบ',
                        text: 'คุณต้องเข้าสู่ระบบเพื่อเข้าถึงแดชบอร์ด',
                        icon: 'warning',
                        confirmButtonText: 'ตกลง'
                    })
                    navigate("/login");
                }
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
            <div>
                <form>
                    <input type="text" onChange={(e)=>setTopic(e.target.value)} placeholder="Topic" />
                    <input type="text" onChange={(e)=>setDes(e.target.value)} placeholder="Description" />
                    <button type="submit" onClick={(e)=>{addtask(e)}}>Add Task</button>
                </form>
            </div>
            <ul>
                {tasks.map((task,index) => (
                    <li key={task.id}>
                        <h3 style={{textDecoration: task.status === 'complete' ? 'line-through' : 'none'}}>{index + 1},{task.topic}</h3>
                        <p>{task.des}</p>
                        <p>Status: {task.status}</p>
                        <button onClick={(e)=>{updatetask(e, task.id,task.status)}}>{task.status==='progress'? 'In Progress' : 'Complete'}</button>
                        <button onClick={(e)=>{deletetask(e,task.id)}}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Dashboard;