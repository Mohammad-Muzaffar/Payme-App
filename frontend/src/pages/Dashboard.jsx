import { useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { useRecoilState } from "recoil";
import { currentBalance } from "../store/atoms/atoms";
import axios from "axios";
import { useUser } from "../hooks/useUser";
import { Navigate } from "react-router-dom";

export const Dashboard = () => {
    const [balance, setBalance] = useRecoilState(currentBalance);
    const fetchBalance = async () => {
        const response = await axios.get("http://localhost:3000/api/v1/account/balance",{
            headers:{
                Authorization : "Bearer " + localStorage.getItem("token")
            }
        });
       
        setBalance(response.data.balance);
    }
    
    useEffect(()=>{
        fetchBalance();
    },[]);

    const user = useUser();
    if(user.loading){
        return "loading...";
    }
    if(!user.userDetails){
        return <Navigate to={"/signin"}/>
    }

    return(
        <div>
            <Appbar/>
            <div className="m-8">
                <Balance value={balance}/>
                <Users/>
            </div>
        </div>
    );
}