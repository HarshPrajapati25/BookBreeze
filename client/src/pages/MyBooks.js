// src/pages/MyBooks.js
import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [lendings, setLendings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('books');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchBooks(), fetchLendings()]);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    const response = await api.get('/books/own');
    setBooks(response.data);
  };

  const fetchLendings = async () => {
    const response = await api.get('/books/lendings');
    setLendings(response.data);
  };

  const handleReturnConfirm = async () => {
    try {
      setLoading(true);
      // Change from selectedBook._id to selectedBook.bookId._id
      await api.post('/books/return', { bookId: selectedBook.bookId._id });
      await fetchData();
      setShowReturnModal(false);
      setSelectedBook(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error returning book');
    } finally {
      setLoading(false);
    }
  };

  const ReturnModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Confirm Book Return</h3>
        <p className="mb-4">
          Are you sure you want to mark "{selectedBook?.bookId.title}" as returned?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              setShowReturnModal(false);
              setSelectedBook(null);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleReturnConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm Return
          </button>
        </div>
      </div>
    </div>
  );

  const renderBooks = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{book.title}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm ${book.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
              >
                {book.isAvailable ? 'Available' : 'Borrowed'}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">By {book.author}</p>
              {book.publicationYear && (
                <p className="text-gray-600">Published: {book.publicationYear}</p>
              )}
              {book.description && (
                <p className="text-gray-700 line-clamp-3">{book.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLendings = () => (
    <div className="space-y-6">
      {lendings.map((lending) => (
        <div key={lending._id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{lending.bookId.title}</h3>
                <div className="space-y-1">
                  <p className="text-gray-600">Borrowed by: {lending.borrowerId.name}</p>
                  <p className="text-gray-600">Email: {lending.borrowerId.email}</p>
                  {lending.borrowerId.phoneNumber && (
                    <p className="text-gray-600">Phone: {lending.borrowerId.phoneNumber}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${lending.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : lending.status === 'ACCEPTED'
                      ? 'bg-green-100 text-green-800'
                      : lending.status === 'RETURNED'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                >
                  {lending.status}
                </span>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(lending.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {lending.status !== 'RETURNED' && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedBook(lending);
                    setShowReturnModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Mark as Returned
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {lendings.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No lending history found.
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" 
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">My Books</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('books')}
            className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'books'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            My Books
          </button>
          <button
            onClick={() => setActiveTab('lendings')}
            className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'lendings'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Lending History
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {activeTab === 'books' ? renderBooks() : renderLendings()}
      {showReturnModal && selectedBook && <ReturnModal />}
    </div>
  );
};

export default MyBooks;