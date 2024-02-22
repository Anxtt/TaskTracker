import { useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom'

import { useAuth } from './useAuth';

export default function useRedirect(type) {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        if (type === "signed" && auth === true) {
            return location.state !== null
                ? navigate(location.state?.from?.pathname)
                : navigate("/Tasks");
        }
        else if (type === null && auth === false) {
            return navigate("/Login", { state: { from: location } });
        }
    }, [auth, location, navigate, type])
}