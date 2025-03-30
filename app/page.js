
// "use client";
// import Image from "next/image";
// import { useState, useEffect } from 'react';
// import { StarIcon } from '@heroicons/react/24/solid';

// export default function BookReviewPage() {
//   // Book data
//   const book = {
//     title: "The River and The Source",
//     author: "Margaret A. Ogolla",
//     coverImage: "/background_img.jpg", 
//     description: "The River and the Source by Margaret Ogolla is a compelling multi-generational novel that explores the lives of strong African women navigating cultural changes in Kenya.",
//   };

//   // Initial reviews with dates
//   const initialReviews = [
//     { 
//       id: 1, 
//       user: "Michael Juma", 
//       rating: 5, 
//       comment: "Absolutely loved this book! A masterpiece.", 
//       date: "2023-10-15" 
//     },
//     { 
//       id: 2, 
//       user: "Jane Omondi", 
//       rating: 4, 
//       comment: "Great character development.", 
//       date: "2023-11-02" 
//     },
//   ];

//   // State management
//   const [reviews, setReviews] = useState(initialReviews);
//   const [newReview, setNewReview] = useState({ 
//     user: "", 
//     rating: 5, 
//     comment: "" 
//   });
//   const [showForm, setShowForm] = useState(false);
//   const [sortOption, setSortOption] = useState("newest");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Load reviews from localStorage
//   useEffect(() => {
//     try {
//       const storedReviews = localStorage.getItem("bookReviews");
//       if (storedReviews) {
//         const parsedReviews = JSON.parse(storedReviews);
//         setReviews(Array.isArray(parsedReviews) ? parsedReviews : initialReviews);
//       }
//     } catch (err) {
//       setError("Failed to load reviews");
//       console.error("Storage error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // Save reviews to localStorage
//   useEffect(() => {
//     try {
//       localStorage.setItem("bookReviews", JSON.stringify(reviews));
//     } catch (err) {
//       console.error("Storage save error:", err);
//     }
//   }, [reviews]);

//   // Handle form submission
//   const handleSubmitReview = (e) => {
//     e.preventDefault();
    
//     if (!newReview.user.trim() || !newReview.comment.trim()) {
//       setError("Please fill in all fields");
//       return;
//     }

//     const review = {
//       ...newReview,
//       id: Date.now(),
//       date: new Date().toISOString().split('T')[0]
//     };

//     setReviews(prev => [...prev, review]);
//     setNewReview({ user: "", rating: 5, comment: "" });
//     setShowForm(false);
//     setError(null);
//   };

//   // Delete a review
//   const handleDeleteReview = (id) => {
//     if (window.confirm("Delete this review?")) {
//       setReviews(prev => prev.filter(review => review.id !== id));
//     }
//   };

//   // Calculate average rating
//   const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length || 0;

//   // Sort reviews based on selected option
//   const sortedReviews = [...reviews].sort((a, b) => {
//     switch (sortOption) {
//       case "newest": return new Date(b.date) - new Date(a.date);
//       case "oldest": return new Date(a.date) - new Date(b.date);
//       case "highest": return b.rating - a.rating;
//       case "lowest": return a.rating - b.rating;
//       default: return 0;
//     }
//   });

//   // Render star ratings
//   const renderStars = (rating) => {
//     return (
//       <div className="flex">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <StarIcon
//             key={star}
//             className={`h-5 w-5 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
//           />
//         ))}
//       </div>
//     );
//   };

//   if (isLoading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-blue-400 py-8">
//       <div className="container mx-auto px-4 max-w-4xl">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           {/* Book Info Section */}
//           <div className="flex flex-col md:flex-row gap-6 mb-8">
//             <div className="w-full md:w-1/3 flex justify-center">
//               <Image
//                 src={book.coverImage}
//                 alt={`${book.title} cover`}
//                 width={200}
//                 height={300}
//                 className="rounded-lg shadow-md"
//                 priority
//               />
//             </div>
//             <div className="w-full md:w-2/3">
//               <h1 className="text-2xl font-bold text-gray-800">{book.title}</h1>
//               <p className="text-lg text-gray-600 mb-4">By {book.author}</p>
//               <p className="text-gray-700 mb-4">{book.description}</p>
//               <div className="flex items-center gap-2">
//                 {renderStars(Math.round(averageRating))}
//                 <span className="text-gray-700">
//                   {averageRating.toFixed(1)} ({reviews.length} reviews)
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Reviews Section */}
//           <div className="border-t pt-6">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">Customer Reviews</h2>
//               <div className="flex gap-3">
//                 <select
//                   value={sortOption}
//                   onChange={(e) => setSortOption(e.target.value)}
//                   className="border rounded px-3 py-1 text-sm"
//                 >
//                   <option value="newest">Newest</option>
//                   <option value="oldest">Oldest</option>
//                   <option value="highest">Highest Rated</option>
//                   <option value="lowest">Lowest Rated</option>
//                 </select>
//                 <button
//                   onClick={() => setShowForm(!showForm)}
//                   className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
//                 >
//                   {showForm ? "Cancel" : "Add Review"}
//                 </button>
//               </div>
//             </div>

//             {error && (
//               <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
//                 {error}
//               </div>
//             )}

//             {sortedReviews.length === 0 ? (
//               <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
//             ) : (
//               <ul className="space-y-6">
//                 {sortedReviews.map((review) => (
//                   <li key={review.id} className="border-b pb-6 last:border-b-0">
//                     <div className="flex justify-between mb-2">
//                       <div>
//                         <p className="font-semibold">{review.user}</p>
//                         <p className="text-sm text-gray-500">{review.date}</p>
//                       </div>
//                       <div className="flex items-center gap-3">
//                         {renderStars(review.rating)}
//                         <button
//                           onClick={() => handleDeleteReview(review.id)}
//                           className="text-red-500 text-sm hover:text-red-700"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                     <p className="text-gray-700">{review.comment}</p>
//                   </li>
//                 ))}
//               </ul>
//             )}

//             {/* Review Form */}
//             {showForm && (
//               <form onSubmit={handleSubmitReview} className="mt-8 bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-medium text-lg mb-4">Write a Review</h3>
                
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">Your Name</label>
//                   <input
//                     type="text"
//                     value={newReview.user}
//                     onChange={(e) => setNewReview({...newReview, user: e.target.value})}
//                     className="w-full border rounded px-3 py-2"
//                     required
//                     maxLength={50}
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">Rating</label>
//                   <select
//                     value={newReview.rating}
//                     onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
//                     className="border rounded px-3 py-2"
//                   >
//                     {[5, 4, 3, 2, 1].map((num) => (
//                       <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">Review</label>
//                   <textarea
//                     value={newReview.comment}
//                     onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
//                     className="w-full border rounded px-3 py-2 h-32"
//                     required
//                     maxLength={500}
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
//                 >
//                   Submit Review
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { StarIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function BookReviewPage() {
  // Book data
  const book = {
    title: "The River and The Source",
    author: "Margaret A. Ogolla",
    coverImage: "/background_img.jpg", 
    description: "The River and the Source by Margaret Ogolla is a compelling multi-generational novel that explores the lives of strong African women navigating cultural changes in Kenya.",
  };

  // Initial reviews with dates
  const initialReviews = [
    { 
      id: 1, 
      user: "Michael Juma", 
      rating: 5, 
      comment: "Absolutely loved this book! A masterpiece.", 
      date: "2023-10-15",
      lastEdited: null 
    },
    { 
      id: 2, 
      user: "Jane Omondi", 
      rating: 4, 
      comment: "Great character development.", 
      date: "2023-11-02",
      lastEdited: null 
    },
  ];

  // State management
  const [reviews, setReviews] = useState(initialReviews);
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

  // Load reviews from localStorage
  useEffect(() => {
    try {
      const storedReviews = localStorage.getItem("bookReviews");
      if (storedReviews) {
        const parsedReviews = JSON.parse(storedReviews);
        setReviews(Array.isArray(parsedReviews) ? parsedReviews : initialReviews);
      }
    } catch (err) {
      setError("Failed to load reviews");
      console.error("Storage error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save reviews to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("bookReviews", JSON.stringify(reviews));
    } catch (err) {
      console.error("Storage save error:", err);
    }
  }, [reviews]);

  // Handle new review submission
  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (!newReview.user.trim() || !newReview.comment.trim()) {
      setError("Please fill in all fields");
      return;
    }

    const review = {
      ...newReview,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      lastEdited: null
    };

    setReviews(prev => [...prev, review]);
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
    if (!editForm.comment.trim()) {
      setError("Review comment cannot be empty");
      return;
    }

    setReviews(prev => prev.map(review => {
      if (review.id === id) {
        return {
          ...review,
          rating: editForm.rating,
          comment: editForm.comment,
          lastEdited: new Date().toISOString().split('T')[0]
        };
      }
      return review;
    }));

    setEditingId(null);
    setError(null);
  };

  // Delete a review
  const handleDeleteReview = (id) => {
    if (window.confirm("Delete this review?")) {
      setReviews(prev => prev.filter(review => review.id !== id));
    }
  };

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length || 0;

  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortOption) {
      case "newest": return new Date(b.date) - new Date(a.date);
      case "oldest": return new Date(a.date) - new Date(b.date);
      case "highest": return b.rating - a.rating;
      case "lowest": return a.rating - b.rating;
      default: return 0;
    }
  });

  // Render star ratings
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-5 w-5 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-blue-300 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Book Info Section */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-full md:w-1/3 flex justify-center">
              <Image
                src={book.coverImage}
                alt={`${book.title} cover`}
                width={200}
                height={300}
                className="rounded-lg shadow-md"
                priority
              />
            </div>
            <div className="w-full md:w-2/3">
              <h1 className="text-2xl font-bold text-gray-800">{book.title}</h1>
              <p className="text-lg text-gray-600 mb-4">By {book.author}</p>
              <p className="text-gray-700 mb-4">{book.description}</p>
              <div className="flex items-center gap-2">
                {renderStars(Math.round(averageRating))}
                <span className="text-gray-700">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
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
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    setEditingId(null);
                  }}
                  className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
                >
                  {showForm ? "Cancel" : "Add Review"}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}

            {sortedReviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
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
                              className="text-green-600 hover:text-green-800"
                              aria-label="Save changes"
                            >
                              <CheckIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-red-600 hover:text-red-800"
                              aria-label="Cancel editing"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Rating</label>
                          <select
                            value={editForm.rating}
                            onChange={(e) => setEditForm({...editForm, rating: Number(e.target.value)})}
                            className="border rounded px-3 py-1 w-full"
                          >
                            {[5, 4, 3, 2, 1].map((num) => (
                              <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Review</label>
                          <textarea
                            value={editForm.comment}
                            onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                            className="w-full border rounded px-3 py-2 h-32"
                            required
                          />
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
                                className="text-blue-600 hover:text-blue-800"
                                aria-label="Edit review"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review.id)}
                                className="text-red-600 hover:text-red-800"
                                aria-label="Delete review"
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

            {/* New Review Form */}
            {showForm && (
              <form onSubmit={handleSubmitReview} className="mt-8 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-4">Write a Review</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    value={newReview.user}
                    onChange={(e) => setNewReview({...newReview, user: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    required
                    maxLength={50}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                    className="border rounded px-3 py-2"
                  >
                    {[5, 4, 3, 2, 1].map((num) => (
                      <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Review</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    className="w-full border rounded px-3 py-2 h-32"
                    required
                    maxLength={500}
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}