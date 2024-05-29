import { useState, useEffect } from 'react';
import axios from 'axios';
import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import ImageGallery from '../ImageGallery/ImageGallery';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
import ImageModal from '../ImageModal/ImageModal';

const UNSPLASH_ACCESS_KEY = '3OlXvuZbRHK9s2Dy0FM9kwuZNu-SdkMmsN9gymFhE8k';

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [noMoreImages, setNoMoreImages] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      setNoMoreImages(false);

      try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
          params: { query, page, per_page: 12 },
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        });

        if (response.status === 200) {
          const newImages = response.data.results.filter(result => !images.find(image => image.id === result.id));

          if (newImages.length === 0 && images.length > 0) {
            setNoMoreImages(true);
          } else if (newImages.length === 0 && images.length === 0) {
            setError('No images found for this query.');
          } else {
            setImages(prevImages => [...prevImages, ...newImages]);
          }
        } else {
          setError('Something went wrong. Please try again.');
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [query, page]);

  const handleSearchSubmit = (searchQuery) => {
    setQuery(searchQuery);
    setPage(1);
    setImages([]);
    setNoMoreImages(false);
    setError(null);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const openModal = (imageURL) => {
    setLargeImageURL(imageURL);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setLargeImageURL('');
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearchSubmit} />
      {error && <ErrorMessage message={error} />}
      {noMoreImages && !error && <ErrorMessage message="No more images found." />}
      <ImageGallery images={images} onImageClick={openModal} />
      {loading && <Loader />}
      {images.length > 0 && !loading && !error && !noMoreImages && <LoadMoreBtn onClick={handleLoadMore} />}
      {showModal && <ImageModal imageURL={largeImageURL} onClose={closeModal} />}
    </div>
  );
};

export default App;
