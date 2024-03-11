import { useEffect, useState } from "react"
import { Button } from "./Button";
import { useRecoilState } from "recoil";
import { usersData, filterData } from "../store/atoms/atoms";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = () => {
    const [users,setUsers] = useRecoilState(usersData);
    const [filter,setFilter] = useRecoilState(filterData);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/user/bulk?filter=" + filter, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
                setUsers(response.data.user);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Call the async function immediately inside useEffect
    }, [filter]);

    return (
        <div className="flex flex-col">
            <div className="font-semibold mt-6 text-lg">Users</div>
            <div className="my-2">
                <input onChange={(e)=>{setFilter(e.target.value)}} type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"/>
            </div>
            <div>
                {users.map(user => <User user = {user} key={user._id}/>)}
            </div>
        </div>
    );
}
const User = ({user}) => {
    const navigate = useNavigate();

    const handleSendMoney = () => {
        navigate("/send?id=" + user._id + "&name=" + user.firstName +" "+ user.lastName);
    };

    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full h-11 w-11 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstName[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <div>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center h-ful">
            <Button onClick={handleSendMoney} label={"Send Money"} />
        </div>
    </div>
}