import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';



export default function NewBook() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    rating: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post('http://localhost:5000/api/books', formData);
      toast.success('Book added successfully!');
      router.push('/books');
    } catch (err) {
      toast.error('Failed to add book');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Add New Book</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 h-32"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Rating (1-5)</label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'star' : 'stars'}
              </option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
}