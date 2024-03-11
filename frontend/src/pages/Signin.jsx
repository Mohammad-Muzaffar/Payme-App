import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import {InputBox} from "../components/InputBox";
import {Button} from "../components/Button";
import {BottomWarning} from "../components/BottomWarning";
import { email, pass} from "../store/atoms/atoms";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { useUser } from "../hooks/useUser";

export const Signin = () => {
    const [username,setUsername] = useRecoilState(email);
    const [password, setPassword] = useRecoilState(pass);
    const navigate = useNavigate();
    const backToDashboard = () => {
        navigate("/dashboard");
    };
    const user = useUser();
    if(user.loading){
        return "loading...";
    }
    if(user.userDetails){
        return <Navigate to={"/dashboard"}/>
    }
    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign in"} />
                    <SubHeading label={"Enter your credentials to access your account"} />
                    <InputBox placeholder="johndoe@gmail.com" label={"Email"} onChange = {e => {setUsername(e.target.value)}}/>
                    <InputBox placeholder="123456" label={"Password"} onChange = {e => {setPassword(e.target.value)}}/>
                    <div className="pt-4">
                    <Button onClick ={async ()=>{
                                const response = await axios.post("http://localhost:3000/api/v1/user/signin",{
                                    username,
                                    password
                                });
                                localStorage.setItem("token",response.data.token);
                                backToDashboard();
                            }} label={"Sign in"} />
                    </div>
                    <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
                </div>
            </div>
        </div>
    );
}
