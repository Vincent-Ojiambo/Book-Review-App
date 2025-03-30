
"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import { StarIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

const booksData = [
  {
    id: 1,
    title: "The River and The Source",
    author: "Margaret A. Ogolla",
    coverImage: "/the_river_and_the_source.jpg",
    description: "A compelling multi-generational novel about strong African women navigating cultural changes in Kenya.",
  },
  {
    id: 2,
    title: "Weep Not, Child",
    author: "Ngũgĩ wa Thiong'o",
    coverImage: "/weep_not_child.jpg",
    description: "The first major novel in English by an East African author, dealing with the Mau Mau uprising.",
  },
  {
    id: 3,
    title: "Petals of Blood",
    author: "Ngũgĩ wa Thiong'o",
    coverImage: "/petals_of_blood.jpg",
    description: "A novel exploring the post-colonial struggles of Kenya through interconnected lives.",
  },
  {
    id: 4,
    title: "Dust",
    author: "Yvonne Adhiambo Owuor",
    coverImage: "/dust.jpg",
    description: "A powerful story of family, love, and redemption set against Kenya's political turmoil.",
  }
];

export default function BookReviewApp() {
  // Refs
  const reviewFormRef = useRef(null);
  const bookListRef = useRef(null);

  // State management
  const [books] = useState(booksData);
  const [selectedBookId, setSelectedBookId] = useState(1);
  const [reviews, setReviews] = useState(() => {
    const initialReviews = {};
    booksData.forEach(book => {
      initialReviews[book.id] = [];
    });
    return initialReviews;
  });
  const [newReview, setNewReview] = useState({ 
    user: "", 
    rating: 5, 
    comment: "" 
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    rating: 5,
    comment: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookList, setShowBookList] = useState(false);

  // Get current book and its reviews (ensuring it's always an array)
  const selectedBook = books.find(book => book.id === selectedBookId) || books[0];
  const bookReviews = Array.isArray(reviews[selectedBookId]) ? reviews[selectedBookId] : [];

  // Load reviews from localStorage
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const storedReviews = localStorage.getItem("bookReviews");
        if (storedReviews) {
          const parsedReviews = JSON.parse(storedReviews);
          // Merge with initial empty reviews to ensure all books have review arrays
          const mergedReviews = {...reviews};
          booksData.forEach(book => {
            mergedReviews[book.id] = Array.isArray(parsedReviews[book.id]) 
              ? parsedReviews[book.id] 
              : [];
          });
          setReviews(mergedReviews);
        }
      } catch (err) {
        setError("Failed to load reviews. Showing default reviews.");
        console.error("Storage error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, []);

  // Save reviews to localStorage
  useEffect(() => {
    const saveReviews = async () => {
      try {
        localStorage.setItem("bookReviews", JSON.stringify(reviews));
      } catch (err) {
        console.error("Failed to save reviews:", err);
      }
    };

    saveReviews();
  }, [reviews]);

  // Scroll to form when shown
  useEffect(() => {
    if (showForm && reviewFormRef.current) {
      setTimeout(() => {
        reviewFormRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 100);
    }
  }, [showForm]);

  // Handle book selection
  const selectBook = (bookId) => {
    setSelectedBookId(bookId);
    setShowForm(false);
    setEditingId(null);
    setShowBookList(false);
    setError(null);
  };

  // Handle new review submission
  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    const trimmedUser = newReview.user.trim();
    const trimmedComment = newReview.comment.trim();
    
    if (!trimmedUser || !trimmedComment) {
      setError("Please fill in all fields");
      return;
    }

    if (trimmedUser.length > 50) {
      setError("Name must be 50 characters or less");
      return;
    }

    if (trimmedComment.length > 500) {
      setError("Review must be 500 characters or less");
      return;
    }

    const review = {
      user: trimmedUser,
      rating: newReview.rating,
      comment: trimmedComment,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      lastEdited: null
    };

    setReviews(prev => ({
      ...prev,
      [selectedBookId]: [...(prev[selectedBookId] || []), review]
    }));

    setNewReview({ user: "", rating: 5, comment: "" });
    setShowForm(false);
    setError(null);
  };

  // Start editing a review
  const startEditing = (review) => {
    setEditingId(review.id);
    setEditForm({
      rating: review.rating,
      comment: review.comment
    });
    setShowForm(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({
      rating: 5,
      comment: ""
    });
  };

  // Save edited review
  const saveEditedReview = (id) => {
    const trimmedComment = editForm.comment.trim();
    
    if (!trimmedComment) {
      setError("Review comment cannot be empty");
      return;
    }

    if (trimmedComment.length > 500) {
      setError("Review must be 500 characters or less");
      return;
    }

    setReviews(prev => ({
      ...prev,
      [selectedBookId]: prev[selectedBookId].map(review => {
        if (review.id === id) {
          return {
            ...review,
            rating: editForm.rating,
            comment: trimmedComment,
            lastEdited: new Date().toISOString().split('T')[0]
          };
        }
        return review;
      })
    }));

    setEditingId(null);
    setError(null);
  };

  // Delete a review
  const handleDeleteReview = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews(prev => ({
        ...prev,
        [selectedBookId]: prev[selectedBookId].filter(review => review.id !== id)
      }));
    }
  };

  // Handle add review button click
  const handleAddReviewClick = () => {
    setShowForm(true);
    setEditingId(null);
  };

  // Calculate average rating
  const averageRating = bookReviews.length > 0 
    ? bookReviews.reduce((sum, review) => sum + review.rating, 0) / bookReviews.length 
    : 0;

  // Sort reviews based on selected option (only if there are reviews)
  const sortedReviews = bookReviews.length > 0
    ? [...bookReviews].sort((a, b) => {
        switch (sortOption) {
          case "newest": return new Date(b.date) - new Date(a.date);
          case "oldest": return new Date(a.date) - new Date(b.date);
          case "highest": return b.rating - a.rating;
          case "lowest": return a.rating - b.rating;
          default: return 0;
        }
      })
    : [];

  // Render star ratings
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-5 w-5 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-300 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Book Selection Dropdown */}
        <div className="relative mb-6">
          <button
            onClick={() => setShowBookList(!showBookList)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto flex justify-between items-center"
            aria-expanded={showBookList}
            aria-haspopup="listbox"
          >
            <span className="truncate max-w-xs">{selectedBook.title}</span>
            <svg 
              className={`w-4 h-4 ml-2 transition-transform ${showBookList ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showBookList && (
            <div 
              ref={bookListRef}
              className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto"
              role="listbox"
            >
              {books.map(book => (
                <button
                  key={book.id}
                  onClick={() => selectBook(book.id)}
                  className={`block w-full text-left px-4 py-2 hover:bg-blue-50 truncate ${selectedBookId === book.id ? 'bg-blue-100 font-medium' : ''}`}
                  role="option"
                  aria-selected={selectedBookId === book.id}
                >
                  {book.title} by {book.author}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Book Info Section */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative w-48 h-64">
                <Image
                  src={selectedBook.coverImage}
                  alt={`Cover of ${selectedBook.title}`}
                  fill
                  className="rounded-lg shadow-md object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h1 className="text-2xl font-bold text-gray-800">{selectedBook.title}</h1>
              <p className="text-lg text-gray-600 mb-4">By {selectedBook.author}</p>
              <p className="text-gray-700 mb-4">{selectedBook.description}</p>
              <div className="flex items-center gap-2">
                {renderStars(Math.round(averageRating))}
                <span className="text-gray-700">
                  {averageRating.toFixed(1)} ({bookReviews.length} review{bookReviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">Customer Reviews</h2>
              <div className="flex gap-3">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Sort reviews by"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
                <button
                  onClick={handleAddReviewClick}
                  className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Add a review"
                >
                  Add Review
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}

            {sortedReviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet.</p>
                <button
                  onClick={handleAddReviewClick}
                  className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Be the first to review!
                </button>
              </div>
            ) : (
              <ul className="space-y-6">
                {sortedReviews.map((review) => (
                  <li key={review.id} className="border-b pb-6 last:border-b-0">
                    {editingId === review.id ? (
                      // Edit Review Form
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">Editing review by {review.user}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEditedReview(review.id)}
                              className="text-green-600 hover:text-green-800 focus:outline-none"
                              aria-label="Save changes"
                            >
                              <CheckIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-red-600 hover:text-red-800 focus:outline-none"
                              aria-label="Cancel editing"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="edit-rating" className="block text-sm font-medium mb-1">Rating</label>
                          <select
                            id="edit-rating"
                            value={editForm.rating}
                            onChange={(e) => setEditForm({...editForm, rating: Number(e.target.value)})}
                            className="border rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {[5, 4, 3, 2, 1].map((num) => (
                              <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="edit-comment" className="block text-sm font-medium mb-1">Review</label>
                          <textarea
                            id="edit-comment"
                            value={editForm.comment}
                            onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                            className="w-full border rounded px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            maxLength={500}
                          />
                          <p className="text-xs text-gray-500 text-right mt-1">
                            {editForm.comment.length}/500 characters
                          </p>
                        </div>
                      </div>
                    ) : (
                      // Review Display
                      <div>
                        <div className="flex justify-between mb-2">
                          <div>
                            <p className="font-semibold">{review.user}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>Posted: {review.date}</span>
                              {review.lastEdited && (
                                <span>(Edited: {review.lastEdited})</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {renderStars(review.rating)}
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditing(review)}
                                className="text-blue-600 hover:text-blue-800 focus:outline-none"
                                aria-label={`Edit review by ${review.user}`}
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review.id)}
                                className="text-red-600 hover:text-red-800 focus:outline-none"
                                aria-label={`Delete review by ${review.user}`}
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mt-2">{review.comment}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* New Review Form - with ref for scrolling */}
            <div ref={reviewFormRef}>
              {showForm && (
                <form onSubmit={handleSubmitReview} className="mt-8 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-4">Write a Review</h3>
                  
                  <div className="mb-4">
                    <label htmlFor="user-name" className="block text-sm font-medium mb-1">Your Name</label>
                    <input
                      id="user-name"
                      type="text"
                      value={newReview.user}
                      onChange={(e) => setNewReview({...newReview, user: e.target.value})}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      maxLength={50}
                    />
                    <p className="text-xs text-gray-500 text-right mt-1">
                      {newReview.user.length}/50 characters
                    </p>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="rating" className="block text-sm font-medium mb-1">Rating</label>
                    <select
                      id="rating"
                      value={newReview.rating}
                      onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                      className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[5, 4, 3, 2, 1].map((num) => (
                        <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium mb-1">Review</label>
                    <textarea
                      id="comment"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      className="w-full border rounded px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 text-right mt-1">
                      {newReview.comment.length}/500 characters
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-1"
                    >
                      Submit Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

