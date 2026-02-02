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


const Signup = () => {
    const handleSignup =  async (e) => {
        e.preventDefault(); 
        const email = e.target[0]?.value; 
        const password = e.target[1]?.value; 

        /* password validation STARTS here */
        const specials = ['!', '#', '$', '%', '&', "'", '(', ')', '*', '+', '-', '.', '/', ':', ';', '=', '?', '@', '[', ']', '^', '_']
        const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

        console.log("user clicked sign up") 
        if (!email || !password) {
            toast.error("Please enter email and password")
            return 
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }
        
        const containsSpecial = specials.some(char => password.includes(char));
        if (!containsSpecial) {
            toast.error("Password must contain at least 1 special character")
        }

        if (password == password.toUpperCase() || 
            password == password.toLowerCase()) {

            toast.error("Password must contain at least 1 uppercase and 1 lowercase letter"); 
            return 
        }

        const containsNum = nums.some(n => password.includes(n)); 
        if (!containsNum) {
            toast.error("Password must contain at least 1 number");
            return
        }

        /* password validation ENDS here */


        // POST to the database
        const {data, error} = await client.auth.signUp({
            email, 
            password
        });

        console.log(data); 
        console.log(error); 

    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign up</CardTitle>
                <CardDescription>Enter email and password to sign up</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={(handleSignup)}>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input id="email"  type="email" placeholder='example@gmail.com'/>
                    </div>
                    <div className="grid gap-2">
                        <Label>Password</Label>
                        <Input id="password"  type="password" placeholder='Password'/>
                    </div>
                    <div className="grid gap-2">
                        <Label>Confirm Password</Label>
                        <Input id="confirmPassword"  type="password" placeholder='Password'/>
                    </div>
                    <Button type="submit" className="w-full">
                        Sign up
                    </Button>
                </div>
            </form>
        </CardContent>
        </Card>
        
    )
}

export default Signup; 