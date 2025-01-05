import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const BorrowedBooks = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBorrowedBooks();
    }, []);

    const fetchBorrowedBooks = async () => {
        try {
            setLoading(true);
            const response = await api.get('/books/borrowed');
            setBorrowedBooks(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching borrowed books');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">My Borrowed Books</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {borrowedBooks.length === 0 ? (
                <div className="text-center text-gray-600">
                    No Books Found.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {borrowedBooks.map((lending) => (
                        <div key={lending._id} className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-2">{lending.bookId.title}</h3>
                            <p className="text-gray-600 mb-2">By {lending.bookId.author}</p>
                            <div className="mb-4">
                                <p className="text-gray-600">Owner: {lending.lenderId.name}</p>
                                <p className="text-gray-600">Contact: {lending.lenderId.email}</p>
                                {lending.lenderId.phoneNumber && (
                                    <p className="text-gray-600">Phone: {lending.lenderId.phoneNumber}</p>
                                )}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={`px-3 py-1 rounded-full text-sm ${lending.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        lending.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {lending.status}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Borrowed on: {new Date(lending.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BorrowedBooks;