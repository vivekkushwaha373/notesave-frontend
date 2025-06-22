import { useState, useEffect, useContext } from 'react'
import { AuthContext} from '../contexts/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { noteSchema} from '../utils/validation'
import type { NoteFormData } from '../utils/validation'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../utils/api'



interface Note {
    _id: string
    title: string
    content: string
    createdAt: string
    updatedAt: string
}

const Dashboard = () => {
   
    const auth = useContext(AuthContext);
    
        if (!auth) {
            throw new Error("AuthContext not found. Did you forget to wrap your component in <AuthProvider>?");
        }
    
    const {user,logout} = auth;



    const [notes, setNotes] = useState<Note[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [searchQuery] = useState('')
    const [isCreating, setIsCreating] = useState(false)

    const form = useForm<NoteFormData>({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            title: '',
            content: '',
        },
    })

   



    useEffect(() => {
        fetchNotes()
    }, [])

   
    

    const fetchNotes = async () => {
        setIsLoading(true)
        try {
            const response = await api.get('/notes',{withCredentials: true})
            if (response.data.success) {
                setNotes(response.data.data.notes)
            }
        } catch (error: any) {
            toast.error('Failed to fetch notes')
        } finally {
            setIsLoading(false)
        }
    }

  


    const onCreateNote = async (data: NoteFormData) => {
        setIsCreating(true)
        try {
            const response = await api.post('/notes', data, {withCredentials: true})
            if (response.data.success) {
                setNotes([response.data.data.note, ...notes])
                setShowCreateForm(false)
                form.reset()
                toast.success('Note created successfully!')
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create note')
        } finally {
            setIsCreating(false)
        }
    }

    const deleteNote = async (noteId: string) => {
      
        try {
            await api.delete(`/notes/${noteId}`)
            setNotes(notes.filter(note => note._id !== noteId))
            toast.success('Note deleted successfully!')
        } catch (error: any) {
            toast.error('Failed to delete note')
        }
    }

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout',{},{withCredentials: true})
            logout()
            toast.success('Logged out successfully!')
        } catch (error) {
            logout() // Logout locally even if API call fails
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Container */}
            <div className="max-w-sm mx-auto bg-white min-h-screen shadow-lg">
              

                {/* Header */}
                <header className="px-6 py-4 bg-white border-b border-gray-100">
                    <div className="flex justify-between gap-20 items-center">
                        <div className="flex  items-center gap-3">
                            {/* Logo - Blue flower-like icon */}
                            <div className="w-8 h-8 flex items-center justify-center">
                                <img src="logo.png" alt="" />
                            </div>
                            <h3 className="text-xl font-semibold text-black">Dashboard</h3>
                        </div>
                        <p
                            onClick={handleLogout}
                            className="text-blue-500 font-medium text-sm underline"
                        >
                            Sign Out
                        </p>
                    </div>
                </header>

                <div className="px-6 py-6">
                    {/* Welcome Section */}
                    <div className="bg-white border-2 border-dashed border-blue-300 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-bold text-black mb-2 leading-tight">
                            Welcome, {user?.name} !
                        </h2>
                        <p className="text-gray-600 text-sm">Email: {user?.email}</p>
                    </div>

                    {/* Create Note Button */}
                    <div className="mb-8">
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="w-full bg-blue-500! hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
                        >
                            Create Note
                        </button>
                    </div>

                    {/* Notes Section */}
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-black text-left">Notes</h3>
                    </div>

                    {/* Notes List */}
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            {searchQuery ? 'No notes found matching your search.' : 'No notes yet. Create your first note!'}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notes.map((note) => (
                                <div key={note._id} className="bg-gray-50 rounded-lg p-1 border border-gray-200">
                                    <div className="w-full flex justify-between items-center">
                                        <h4 className="font-medium ml-2 !text-black text-base">{note.title}</h4>
                                        <button
                                            onClick={() => deleteNote(note._id)}
                                            className="ml-4 p-1 text-gray-600 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                           </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom Indicator */}
                <div className="flex justify-center pb-4">
                    <div className="w-32 h-1 bg-black rounded-full"></div>
                </div>
            </div>

            {/* Create Note Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Note</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    {...form.register('title')}
                                    type="text"
                                    placeholder="Enter note title"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {form.formState.errors.title && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {form.formState.errors.title.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Content
                                </label>
                                <textarea
                                    {...form.register('content')}
                                    rows={4}
                                    placeholder="Enter note content"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                                {form.formState.errors.content && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {form.formState.errors.content.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={form.handleSubmit(onCreateNote)}
                                    disabled={isCreating}
                                    className="flex-1 bg-blue-500! hover:bg-blue-600! text-white! font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isCreating ? 'Creating...' : 'Create Note'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCreateForm(false)
                                        form.reset()
                                    }}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard