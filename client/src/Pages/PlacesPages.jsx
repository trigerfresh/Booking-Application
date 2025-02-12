import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Perks from '../Perks';
import axios from 'axios';

export default function PlacesPage() {
  const { action } = useParams();
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState('');
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(''); // For handling errors
  const [images, setImages] = useState([]); // State for storing fetched images

  // Fetch images from the backend
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:4000/images');
      setImages(response.data); // Store image filenames in state
    } catch (error) {
      setError('Failed to fetch images');
      console.error(error);
    }
  };

  useEffect(() => {
    if (action === 'new') {
      fetchImages(); // Fetch images when the component mounts for 'new' action
    }
  }, [action]);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  // Handle photo upload
  async function addPhotoByLink(ev) {
    ev.preventDefault();

    if (!photoLink) {
      setError('Please provide a valid photo URL.');
      return;
    }

    setLoading(true);
    setError(''); // Clear any previous errors

    try {
      // Send the link to the backend to upload the image
      const response = await axios.post(
        'http://localhost:4000/upload-by-link',
        { link: photoLink }
      );

      console.log('Photo uploaded successfully!', response.data);

      // Assuming the backend returns an image URL in `response.data.imageUrl`
      const uploadedImageUrl = response.data.imageUrl;

      console.log(uploadedImageUrl);

      if (uploadedImageUrl) {
        setAddedPhotos((prevPhotos) => [...prevPhotos, uploadedImageUrl]);
      } else {
        setError('Failed to retrieve image URL from backend.');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Failed to upload the image. Please try again.');
    } finally {
      setLoading(false);
    }

    setPhotoLink(''); // Clear the input field
  }

  return (
    <div>
      {action !== 'new' && (
        <div className="text-center">
          <Link
            className="inline-flex gap-1 bg-pink-700 text-white py-2 px-6 rounded-full"
            to={'/account/places/new'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add New Place
          </Link>
        </div>
      )}

      {action === 'new' && (
        <div>
          <form>
            {preInput('Title', 'Title for your places, should be short & catchy')}
            <input
              type="text"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              placeholder="title, for example: My lovely apt"
            />
            {preInput('Address', 'Address to your place')}
            <input
              type="text"
              value={address}
              onChange={(ev) => setAddress(ev.target.value)}
              placeholder="address"
            />
            {preInput('Photos', 'more = better')}
            <div className="flex gap-2">
              <input
                type="text"
                value={photoLink}
                onChange={(ev) => setPhotoLink(ev.target.value)}
                placeholder={'Add using a link....jpg'}
              />
              <button
                type="button" // Ensure this doesn't submit the form
                className="bg-gray-200 px-4 rounded-2xl"
                onClick={addPhotoByLink}
              >
                {loading ? 'Adding...' : 'Add Photo'}
              </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mt-3">
              {addedPhotos.length > 0 &&
                addedPhotos.map((photo, index) => (
                  <img
                    key={index}
                    src={`http://localhost:4000/${photo}`} // Fetching the image with the correct URL
                    alt="Uploaded"
                    className="h-24 w-24 object-cover"
                  />
                ))}
              {/* Displaying images fetched from backend */}
              {images.length > 0 &&
                images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:4000/uploads/${image}`}
                    alt={`Fetched Image ${index}`}
                    className="h-24 w-24 object-cover"
                  />
                ))}
            
            <button className="photoBtn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                />
              </svg>
              Upload
            </button>
            </div>
            {preInput('Description', 'Description of place')}
            <textarea
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />
            {preInput('Perks', 'Select all perks of your place')}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-2">
              <Perks selected={perks} onChange={setPerks} />
            </div>
            {preInput('Extra Info', 'House rules, etc')}
            <textarea
              value={extraInfo}
              onChange={(ev) => setExtraInfo(ev.target.value)}
            />
            {preInput(
              'Check in & Out times',
              'add check in & out times, remember to have some time window for cleaning the room between guests'
            )}
            <div className="grid sm:grid-cols-3 gap-2">
              <div className="mt-2 -mb-1">
                <h3>Check in time</h3>
                <input
                  type="text"
                  value={checkIn}
                  onChange={(ev) => setCheckIn(ev.target.value)}
                  placeholder="14"
                />
              </div>

              <div className="mt-2 -mb-1">
                <h3>Check out time</h3>
                <input
                  type="text"
                  value={checkOut}
                  onChange={(ev) => setCheckOut(ev.target.value)}
                  placeholder="11"
                />
              </div>

              <div className="mt-2 -mb-1">
                <h3>Max number of guests</h3>
                <input
                  type="number"
                  value={maxGuests}
                  onChange={(ev) => setMaxGuests(ev.target.value)}
                />
              </div>
            </div>
            <div>
              <button className="primary mt-2">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
