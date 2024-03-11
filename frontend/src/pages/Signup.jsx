import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import {InputBox} from "../components/InputBox";
import {Button} from "../components/Button";
import {BottomWarning} from "../components/BottomWarning";
import { useRecoilState } from "recoil";
import { email, firstname, lastname, pass} from "../store/atoms/atoms";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";


export const Signup = () => {
    const [username,setUsername] = useRecoilState(email);
    const [firstName,setFirstName] = useRecoilState(firstname);
    const [lastName, setLastName] = useRecoilState(lastname);
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
                   
                        <Heading label={"Sign up"} />
                        <SubHeading label={"Enter your infromation to create an account"} />
                        <InputBox placeholder="John" label={"First Name"} onChange = {e => {setFirstName(e.target.value)}} />
                        <InputBox placeholder="Doe" label={"Last Name"} onChange = {e => {setLastName(e.target.value)}} />
                        <InputBox placeholder="johndoe@gmail.com" label={"Email"} onChange = {e => {setUsername(e.target.value)}} />
                        <InputBox placeholder="123456" label={"Password"} onChange = {e => {setPassword(e.target.value)}}/>
                        <div className="pt-4">
                            <Button onClick ={async ()=>{
                                const response = await axios.post("http://localhost:3000/api/v1/user/signup",{
                                    username,
                                    firstName,
                                    lastName,
                                    password
                                });
                                localStorage.setItem("token",response.data.token);
                                backToDashboard();
                            }} label={"Sign up"} />
                        </div>
                        <BottomWarning label={"Already have an account?"} buttonText={" Sign in"} to={"/signin"} />
                    
                </div>
            </div>
        </div>
    );
}  