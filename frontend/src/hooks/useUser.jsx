import axios from "axios";
import { useEffect, useState } from "react";

export const useUser = () => {
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);

    async function getDetails(){
        try{
            const response = await axios.get("http://localhost:3000/api/v1/user/me",{
                headers:{
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            setUserDetails(response.data);
        } catch(err){
            console.error(err);
        }
        setLoading(false);
    }
    useEffect(()=>{
        getDetails();
    },[]);
    return {
        loading,
        userDetails
    }
}