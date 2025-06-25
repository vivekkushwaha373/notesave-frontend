import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../utils/api'
import { signUpSchema, otpSchema } from '../utils/validation'
import type { SignUpFormData, OtpFormData } from '../utils/validation'
import { AuthContext} from '../contexts/AuthContext'
import GoogleSignIn from '../components/GoogleSignIn'


const SignUp = () => {
    const [step, setStep] = useState<'signup' | 'otp'>('signup')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [userEmail, setUserEmail] = useState('')
    
    const navigate = useNavigate()

    const signupForm = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            dateOfBirth: '',
        },
    })
     const auth = useContext(AuthContext);
    
        if (!auth) {
            throw new Error("AuthContext not found. Did you forget to wrap your component in <AuthProvider>?");
        }
    
    const { user } = auth;

     useEffect(() => {
            if (user)
            {
                navigate('/dashboard')
            }
    },[user])

    const otpForm = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: '',
        },
    })

    const onSignUpSubmit = async (data: SignUpFormData) => {
        setIsLoading(true)
        try {
            const response = await api.post('/auth/register', data, { withCredentials: true })
            if (response.data.success && response.data.otpRequired) {

                setUserEmail(data.email)
                setStep('otp')
                toast.success('OTP sent to your email!')
            }
            else if (response.data.success && !response.data.otpRequired)
            {
                setUserEmail(data.email);
                toast.success('Google User Registered!');
                navigate('/signin');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed')
        } finally {
            setIsLoading(false)
        }
    }

    const onOtpSubmit = async (data: OtpFormData) => {
        setIsLoading(true)
        try {
            const response = await api.post('/auth/verify-otp', {
                email: userEmail,
                otp: data.otp,
            },{ withCredentials: true })
            if (response.data.success) {
                console.log('OTP verification response:', response)
                toast.success('Account verified successfully!')
                navigate('/signin')
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'OTP verification failed')
        } finally {
            setIsLoading(false)
        }
    }

    const resendOtp = async () => {
        setIsLoading(true)
        try {
            await api.post('/auth/resend-otp', { email: userEmail },{withCredentials: true})
            toast.success('OTP resent to your email!')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 flex">
            {/* Left Panel */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                    {/* Logo */}
                    <div className="flex w-full items-center justify-center sm:justify-start gap-2 mb-8">
                        <img src="/logo.png" alt="HD" className="w-8 h-8" />
                        <span className="text-xl font-semibold text-gray-900">HD</span>
                    </div>

                    {step === 'signup' ? (
                        <>
                            <div className="mb-8">
                                <h2 className="text-3xl sm:text-left font-bold text-gray-900 mb-2">Sign up</h2>
                                <p className="text-gray-500 text-left text-sm">
                                    Sign up to HD to continue on HD
                                </p>
                            </div>

                            <form onSubmit={signupForm.handleSubmit(onSignUpSubmit)} className="space-y-5">
                                <div>
                                    <fieldset className="border border-blue-500 rounded-lg px-4 pt-2 pb-4 ml-0">
                                        <legend className="text-sm font-medium text-left text-blue-600 px-2">Your Name</legend>
                                        <input
                                            {...signupForm.register('name')}
                                            type="text"
                                            placeholder="Jinas Khanwald"
                                            className="w-full border-none outline-none focus:ring-0 text-sm text-gray-700"
                                        />
                                    </fieldset>
                                    {signupForm.formState.errors.name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {signupForm.formState.errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <fieldset className="border border-blue-500 rounded-lg px-4 pt-2 pb-4 ml-0">
                                        <legend className="text-sm font-medium text-left text-blue-600 px-2">Date of birth</legend>
                                        <input
                                            {...signupForm.register('dateOfBirth')}
                                            type="date"
                                            className="w-full border-none outline-none focus:ring-0 text-sm text-gray-700"
                                        />
                                    </fieldset>
                                    {signupForm.formState.errors.dateOfBirth && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {signupForm.formState.errors.dateOfBirth.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <fieldset className="border border-blue-500 rounded-lg px-4 pt-2 pb-4 ml-0">
                                        <legend className="text-sm font-medium text-left text-blue-600 px-2">Email</legend>
                                        <input
                                            {...signupForm.register('email')}
                                            type="email"
                                            placeholder="jinas.khanwald@gmail.com"
                                            className="w-full border-none outline-none focus:ring-0 text-sm text-gray-700"
                                        />
                                    </fieldset>
                                    {signupForm.formState.errors.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {signupForm.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="relative w-full">
                                        <input
                                            {...signupForm.register('password')}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Password"
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
                                    {signupForm.formState.errors.password && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {signupForm.formState.errors.password.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full !bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Signing up...' : 'Sign up'}
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
                                Already have an account?{' '}
                                <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h2 className="text-3xl sm:text-left font-bold text-gray-900 mb-2">Enter OTP</h2>
                                <p className="text-gray-500 text-left text-sm">
                                    We've sent a 6-digit code to {userEmail}
                                </p>
                            </div>

                            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-5">
                                <div>
                                    <fieldset className="border border-blue-500 rounded-lg px-4 pt-2 pb-4 ml-0">
                                        <legend className="text-sm font-medium text-left text-blue-600 px-2">OTP Code</legend>
                                        <input
                                            {...otpForm.register('otp')}
                                            type="text"
                                            placeholder="Enter 6-digit OTP"
                                            maxLength={6}
                                            className="w-full border-none outline-none focus:ring-0 text-sm text-gray-700 text-center text-xl font-mono"
                                        />
                                    </fieldset>
                                    {otpForm.formState.errors.otp && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {otpForm.formState.errors.otp.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full !bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                                </button>

                                <button
                                    type="button"
                                    onClick={resendOtp}
                                    disabled={isLoading}
                                    className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 transition-colors disabled:opacity-50"
                                >
                                    Resend OTP
                                </button>
                            </form>
                        </>
                    )}
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

export default SignUp