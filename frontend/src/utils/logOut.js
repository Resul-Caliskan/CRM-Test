import { useNavigate } from "react-router-dom";
export const LogOut = () => {
    const navigate=useNavigate();

    localStorage.clear();
    return navigate("/");
}