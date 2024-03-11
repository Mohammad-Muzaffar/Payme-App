import { useRecoilState } from "recoil";
import { firstname } from "../store/atoms/atoms";
import axios from "axios";
import { useEffect } from "react";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

export const Appbar = () => {
    const [firstName, setFirstName] = useRecoilState(firstname);
    const navigate = useNavigate();
    const backToSignin = () => {
        navigate("/signin");
    };
    const getUserDetails = async () => {
        const response = await axios.get("http://localhost:3000/api/v1/user/me",{
            headers:{
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        });
        setFirstName(response.data.firstName);
    }
    useEffect(()=>{
        getUserDetails();
    },[])
    return(
        <div className="shadow flex justify-between h-14">
            <div className="flex flex-col justify-center h-full ml-4 font-normal">
                PayMe App 
            </div>
            <div className="flex">
                <div className="flex flex-col mr-4 h-full justify-center">Hello</div>
                <div className="rounded-full mt-2 mr-2 flex justify-center bg-slate-200 h-10 w-10">
                    <div className="flex flex-col h-full justify-center text-xl">{firstName[0]}</div>
                </div>
                <div className="flex flex-col mr-2 mt-2 ml-2 h-10 pt-2 justify-center">
                    <Button label={"Log out"} onClick={()=>{
                        localStorage.removeItem("token");
                        backToSignin();
                    }}/>
                </div>
            </div>
        </div>
    );
}