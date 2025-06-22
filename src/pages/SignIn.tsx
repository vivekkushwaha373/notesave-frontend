import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../utils/api'
import { signInSchema } from '../utils/validation'
import type { SignInFormData } from '../utils/validation'
import { AuthContext} from '../contexts/AuthContext'
import GoogleSignIn from '../components/GoogleSignIn'

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const auth = useContext(AuthContext);

    if (!auth) {
        throw new Error("AuthContext not found. Did you forget to wrap your component in <AuthProvider>?");
    }

    const { login, user } = auth;
    const navigate = useNavigate()

    const form = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    useEffect(() => {
        if (user)
        {
            navigate('/dashboard')
        }
    },[user])

    const onSubmit = async (data: SignInFormData) => {
        setIsLoading(true)
        try {
            const response = await api.post('/auth/login', data, {withCredentials: true})
            if (response.data.success) {
                console.log('Sign in response:', response)
                login(response?.data?.data?.user)
                toast.success('Successfully signed in!')
                navigate('/dashboard')
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Sign in failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className=" w-full min-h-screen bg-gray-50 flex">
            {/* Left Panel */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                    {/* Logo */}
                    <div className="flex w-full items-center justify-center sm:justify-start gap-2 mb-8">
                        <img src="/logo.png" alt="HD" className="w-8 h-8" />
                        <span className="text-xl font-semibold text-gray-900">HD</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl sm:text-left font-bold text-gray-900 mb-2">Sign in</h2>
                        <p className="text-gray-500 text-left text-sm">
                            Please login to continue to your account.
                        </p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <fieldset className="border border-blue-500 rounded-lg px-4 pt-2 pb-4 ml-0">
                                <legend className="text-sm font-medium text-left text-blue-600 px-2">Email</legend>
                                <input
                                    {...form.register('email')}
                                    type="email"
                                    placeholder="jonas_kahnwald@gmail.com"
                                    className="w-full border-none outline-none focus:ring-0 text-sm text-gray-700"
                                />
                            </fieldset>

                            {form.formState.errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                          
                            <div className="relative w-full">
                                <input
                                    {...form.register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="OTP"
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute w-fit top-1 right-0.5 flex items-center px-3 !bg-white border-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 border-none" />
                                    ) : (
                                        <Eye className="w-5 h-5 border-none" />
                                    )}
                                </button>
                            </div>
                            {form.formState.errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>
                        <div className='text-left'>
                        <p className="text-sm ml-0 text-blue-600 hover:text-blue-700 font-medium">
                            Forgot Password?
                        </p>

                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Keep me logged in
                                </label>
                            </div>
                           
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full !bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-white text-gray-500">or</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <GoogleSignIn />
                        </div>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Need an account?{' '}
                        <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Panel - Image (Hidden on mobile) */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden rounded-[23px]">
                <img
                    src="/rightimage.png"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    )
}

export default SignIn