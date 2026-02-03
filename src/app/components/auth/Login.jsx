import React from "react"; 
import {
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle
} from "@/components/ui/card"; 
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {toast} from "sonner"; 
import client from "@/api/client"


const Login = () => {
    const handleLogin = async (e) => {
        e.preventDefault(); 
        const email = e.target[0]?.value; 
        const password = e.target[1]?.value; 

        /* Check if info belongs to an existing user */
        const {data, error} = await client.auth.signInWithPassword({
            email, 
            password
        })

        if (error) {
            toast.error("An error occurred. Please check your credentials and try again.");
        } else {
            console.log("User successfully logged in!"); 
        } 
    }
    // the html object to return 
    return <Card>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter email and password to login</CardDescription>
        <CardContent>
            <form onSubmit={(handleLogin)}>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input id="email" type="email" placeholder="example@gmail.com"/>
                    </div>
                    <div className="grid gap-2">
                        <Label>Password</Label>
                        <Input id="password" type="password" placeholder="Password"/>
                    </div>
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </div>
            </form>
        </CardContent>
    </Card>
}; 

export default Login; 