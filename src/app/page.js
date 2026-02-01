'use client'; 

import useAuth from "@/hooks/useAuth"; 
import {useRouter} from "next/navigation"; 
import Auth from "./components/auth/Auth";

export default function Home() {
    const {user, loading} = useAuth(); 
    const router = useRouter(); 

    if (!loading && user) {
        // redirect to secure page
        router.push("/dashboard");
        return null; 
    }

    return (
        // redirect to either the Loading page or the Login page
        <div>

            {loading ? <h1>Loading...</h1> : <Auth/>}
        </div>
    )
}