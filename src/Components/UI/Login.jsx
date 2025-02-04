import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, resetPassword } from "../../apis/authApi";  // Assuming you import these from your api.js
import logo from "../../Assets/logo01.png";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
    const [formData, setFormData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const {isLogin,user,setUser,setLogin} = useAuth()
    const [showPassword, setShowPassword] = useState(false);

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (forgotPasswordStep === 1) {
                setForgotPasswordStep(2);
            } else if (forgotPasswordStep === 2) {
                setForgotPasswordStep(3);
            } else if (forgotPasswordStep === 3) {
                const resetPasswordData = {
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword,
                };
                const res = await resetPassword(resetPasswordData);
                toast.success(res.message)
                navigate("/dashboard");
                // Optionally show a success message
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await login({ email, password });
            if(res?.data?.isFirstLogin){
                setForgotPasswordStep(3)
            }else{
                navigate("/dashboard");
            }
            setUser(res.data)
            setLogin(true)
            toast.success(res.message)
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            toast.error(err.response?.data?.message || "Login failed")
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    useEffect(()=>{
        if(isLogin){
            navigate('/dashboard')
        }
    },[[isLogin,navigate] ])
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <img src={logo} alt="Logo" className="mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-center mb-4">
                    {forgotPasswordStep === 1 ? "Login" : "Forgot Password"}
                </h2>

                {/* {error && <p className="text-red-500 text-center mb-4">{error}</p>} */}

                {forgotPasswordStep === 1 ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="form-group">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="form-group relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative w-full">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-600 hover:text-gray-800"
                                >
                                    {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setForgotPasswordStep(2)}
                            className="w-full text-primary text-end flex justify-end text-sm mt-2 underline"
                        >
                            Forgot Password?
                        </button>
                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                        {/* <p className="mt-4 text-center text-sm text-gray-600">
                            Don't have an account? <a href="/signup" className="text-primary hover:underline">Sign up</a>
                        </p> */}
                    </form>
                ) : (
                    <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                        {forgotPasswordStep === 2 && (
                            <div className="form-group">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Enter your email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}
                        {forgotPasswordStep === 3 && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-2 rounded-md"
                            disabled={loading}
                        >
                            {loading ? "Resetting..." : forgotPasswordStep === 2 ? "Next" : "Reset Password"}
                        </button>
                    </form>
                )}
                {forgotPasswordStep > 1 && (
                    <button
                        type="button"
                        onClick={() => setForgotPasswordStep(1)}
                        className="w-full text-primary text-sm mt-2 underline"
                    >
                        Back to Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default Login;
