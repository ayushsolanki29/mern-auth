import { motion } from 'framer-motion';
import Input from '../components/Input';
import { AlertTriangle, Loader2, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, errorr, isLoading } = useAuthStore();
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        await login(email, password)
        try {
            navigate("/");
            toast.success("Successfully logged in!");
        } catch (error) {
            toast.error(errorr);
        }
    }
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
        >
            <div className='p-8'>
                <h2 className='text-2xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>Welcome Back </h2>
                <form onSubmit={handleLogin}>

                    <Input icon={Mail} type="email" placeholder="Email Adress" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input icon={Lock} type="password" placeholder="Strong Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className='flex items-center mb-2'>
                        <Link to={"/forgot-password"} className='text-sm text-green-400 hover:underline'>
                            Forgot Password?
                        </Link>
                    </div>
                    {errorr && (
                        <div className="flex items-center p-3 mb-4 text-md text-white bg-red-500 rounded-lg shadow-lg" role="alert">
                            <AlertTriangle className="w-5 h-5 mr-2" />
                            <span>{errorr}</span>
                        </div>
                    )}
                    <motion.button

                        className='mt-5 w-full py-3 px-4 bg-gradient-to-r disabled:opacity-50 disabled:from-green-600 disabled:to-emerald-700 disabled:cursor-not-allowed from-green-500 to-emerald-600 text-white 
                font-bold rounded-lg shadow-lg hover:from-green-600
                hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                 focus:ring-offset-gray-900 transition duration-200'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className='size-6 animate-spin mx-auto' /> : "Login"}
                    </motion.button>
                </form>
            </div>
            <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
                <p className='text-sm text-gray-400'>
                    Don't have an Account?{" "}
                    <Link to={"/signup"} className='text-green-400 hover:underline'>
                        Sign Up
                    </Link>
                </p>
            </div>
        </motion.div>
    )
}

export default LoginPage
