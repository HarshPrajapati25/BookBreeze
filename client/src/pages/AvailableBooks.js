// src/pages/AvailableBooks.js
import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AvailableBooks = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [requestingBook, setRequestingBook] = useState(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books/available');
      setBooks(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch available books');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestClick = (bookId) => {
    setRequestingBook(bookId);
    setRequestNotes('');
    setError('');
  };

  const handleRequestCancel = () => {
    setRequestingBook(null);
    setRequestNotes('');
    setError('');
  };

  const handleRequest = async (book) => {
    try {
      await api.post('/books/request', {
        bookId: book._id,
        notes: requestNotes
      });

      setSuccessMessage(`Successfully requested "${book.title}"`);
      setTimeout(() => setSuccessMessage(''), 3000);

      setRequestingBook(null);
      setRequestNotes('');
      await fetchBooks(); // Refresh the book list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request book');
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
      <h1 className="text-3xl text-black bg-white w-60 font-bold mb-8 font-style: italic">Available Books</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {books.length === 0 ? (
        <div className="text-gray-600 text-center py-8">
          No books are currently available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {book.title}
                </h2>
                <p className="text-gray-600 mb-2">
                  By {book.author}
                </p>
                {book.publicationYear && (
                  <p className="text-gray-600 text-sm mb-2">
                    Published in {book.publicationYear}
                  </p>
                )}
                {book.description && (
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {book.description}
                  </p>
                )}
                <div className="text-sm text-gray-600 mb-4">
                  Owner: {book.ownerId.name}
                </div>

                {requestingBook === book._id ? (
                  <div className="space-y-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleRequest(book)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        Confirm Request
                      </button>
                      <button
                        onClick={handleRequestCancel}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRequestClick(book._id)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Request Book
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableBooks;