
"use client";
import Image from "next/image";
import { useState, useEffect } from 'react';

export default function Home() {
  const book = {
    title: "The River and The Source",
    author: "Margaret A. Ogolla",
    coverImage: "/background_img.jpg", 
    description: "The River and the Source by Margaret Ogolla is a compelling multi-generational novel that explores the lives of strong African women navigating cultural changes in Kenya. The story begins with Akoko, a resilient Luo woman who defies tradition, and follows her descendants as they face colonialism, education, modernity, and personal struggles.",
  };

  const initialReviews = [
    { id: 1, user: "Michael Juma", rating: 5, comment: "Absolutely loved this book! A masterpiece." },
    { id: 2, user: "Jane Omondi", rating: 4, comment: "A bit slow at times, but the characters are brilliant." },
    { id: 3, user: "Lucia Ekidor", rating: 3, comment: "Enjoyable, but not my favorite." },
  ];

  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({ user: "", rating: 5, comment: "" });
  const [showForm, setShowForm] = useState(false);
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const storedReviews = localStorage.getItem("bookReviews");
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bookReviews", JSON.stringify(reviews));
  }, [reviews]);

  const handleAddReview = () => {
    const newReviewWithId = { ...newReview, id: reviews.length + 1 };
    setReviews([...reviews, newReviewWithId]);
    setNewReview({ user: "", rating: 5, comment: "" });
    setShowForm(false);
  };

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === "newest") return b.id - a.id;
    if (sortOption === "highest") return b.rating - a.rating;
    return a.id - b.id; // Oldest
  });

  return (
    <div className="min-h-screen bg-blue-400"> 
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-6 pb-10 gap-16 sm:p-10 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-4xl bg-white p-6 rounded-lg shadow-md"> {/* Added white container */}
          <div className="flex flex-col items-center sm:flex-row gap-8">
            <Image
              src={book.coverImage}
              alt={`${book.title} cover`}
              width={200}
              height={300}
              className="rounded shadow-md"
            />
            <div>
              <h1 className="text-2xl font-bold">{book.title}</h1>
              <p className="text-lg">By {book.author}</p>
              <p className="mt-4">{book.description}</p>
              <p className="mt-4">Average Rating: {averageRating.toFixed(1)}/5</p>
            </div>
          </div>

          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>

            <select 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)} 
              className="border p-2 mb-4 rounded"
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest Rating</option>
              <option value="oldest">Oldest</option>
            </select>

            {sortedReviews.length > 0 ? (
              <ul className="list-none space-y-4">
                {sortedReviews.map((review) => (
                  <li key={review.id} className="border-b pb-4 mb-4">
                    <div className="flex justify-between">
                      <p className="font-semibold">{review.user}</p>
                      <p>Rating: {review.rating}/5</p>
                    </div>
                    <p>{review.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reviews yet.</p>
            )}

            <button 
              onClick={() => setShowForm(!showForm)} 
              className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
            >
              {showForm ? "Hide Form" : "Add Review"}
            </button>

            {showForm && (
              <form onSubmit={(e) => { e.preventDefault(); handleAddReview(); }} className="mt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={newReview.user}
                  onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                  className="border p-2 w-full rounded"
                  required
                />
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                  className="border p-2 w-full rounded"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Your Review"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="border p-2 w-full rounded"
                  rows={3}
                  required
                />
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}
