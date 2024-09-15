import React, { useState, useEffect, useRef } from 'react';

export default function SearchBar({ onSearchResults }) {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);
    const searchBoxRef = useRef(null);

    useEffect(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
            initSearchBox();
        }
    }, []);

    const initSearchBox = () => {
        searchBoxRef.current = new window.google.maps.places.SearchBox(inputRef.current);
        
        searchBoxRef.current.addListener('places_changed', () => {
            const places = searchBoxRef.current.getPlaces();
            if (places.length === 0) {
                return;
            }

            const results = places.map(place => ({
                locationName: place.name,
                address: place.formatted_address,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                wheelchairAccessible: false, // Default value, update if you have this data
                friendliness: 0 // Default value, update if you have this data
            }));

            onSearchResults(results);
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // The search is now handled by the SearchBox listener
    };

    return (
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white dark:bg-gray-700 overflow-hidden border border-gray-300 dark:border-gray-600">
                <div className="grid place-items-center h-full w-12 text-gray-300 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    ref={inputRef}
                    className="peer h-full w-full outline-none text-sm text-gray-700 dark:text-gray-200 pr-2 bg-white dark:bg-gray-700"
                    type="text"
                    id="search"
                    placeholder="Search for a location..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-r transition duration-300 search-button">
                    Search
                </button>
            </form>
        </div>
    );
}