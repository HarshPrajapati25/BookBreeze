import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Library } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import books from "../static/books.jpg";
const HomePage = () => {
    const { user } = useAuth();
    return (
        <div className="h-screen bg-gray-100 flex flex-col">
            {/* Header with Welcome Message */}
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-lg font-bold p-4 font-style: italic">
                    Welcome, {user?.name || 'Reader'}!
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-8 font-style: italic">
                <div className='flex flex-col gap-8 '>
                {/* <div className="grid md:grid-cols-2 gap-8 items-center"> */}
                    {/* Introduction Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-3xl font-bold text-blue-800 mb-4" >
                            Discover Your Next Great Read😉
                        </h2>
                        <p className="text-gray-700 mb-4">
                            BookBreeze is your personal digital library companion. We're passionate about connecting readers with their perfect books, making lending and discovering new literature easier than ever.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <BookOpen className="mr-3 text-blue-500" />
                                <span>Vast collection of books at your fingertips</span>
                            </div>
                            <div className="flex items-center">
                                <Library className="mr-3 text-green-500" />
                                <span>Easy book lending and borrowing system</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Section */}
                    <div className="font-style: italic">
                        <div className="bg-white p-8 rounded-lg shadow-md" style={{
                            backgroundImage: `url(${books})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundAttachment: 'fixed'
                        }}>
                            <h3 className="text-2xl font-bold mb-4 ">Ready to Explore?</h3>
                            <div className="mt-4 text-black font-semibold text-sm pb-2">
                                Start your reading journey today!
                            </div>
                            <Link
                                to="/available-books"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 inline-flex justify-center font-style: italic"
                            >
                                Browse Available Books
                                <BookOpen className="ml-2" />
                            </Link>

                           
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-blue-800 text-white p-4 text-center">
                <p>©BookBreeze@harshp. 2024 Your Digital Library Companion </p>
            </footer>
        </div>
    );
};

export default HomePage;