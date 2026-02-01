import {Tabs, TabsContent, TabsTrigger, TabsList} from '@/components/ui/tabs'; 
import Login from './Login'; 
import Signup from './Signup'; 

const Auth = () => {
    return <Tabs defaultValue="login">
        <TabsList>
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
    </Tabs>

}

export default Auth; 
