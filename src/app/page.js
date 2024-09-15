"use client";

import { useState, useEffect } from "react";
import MapComponent from "../components/MapComponent";
import SearchBar from "../components/SearchBar";
import LocationCard from "../components/LocationCard";
import CreateMarkerModal from "../components/CreateMarkerModal";
import markerData from "./data/markerData";

export default function Home() {
    const [isHovered, setIsHovered] = useState(false);
    const [markers, setMarkers] = useState(markerData);
    const [wheelchairFilter, setWheelchairFilter] = useState("all");
    const [friendlinessFilter, setFriendlinessFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        // Load Google Maps API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        document.head.appendChild(script);
    }, []);

    useEffect(() => {
        let filteredMarkers = [...(searchResults.length > 0 ? searchResults : markerData)];

        if (wheelchairFilter !== "all") {
            filteredMarkers = filteredMarkers.filter(
                (marker) => marker.wheelchairAccessible === (wheelchairFilter === "accessible")
            );
        }

        if (friendlinessFilter !== "all") {
            filteredMarkers = filteredMarkers.filter((marker) => marker.friendliness >= 4);
        }

        filteredMarkers.sort((a, b) => {
            if (sortBy === "name") {
                return a.locationName.localeCompare(b.locationName);
            } else if (sortBy === "friendliness") {
                return b.friendliness - a.friendliness;
            }
            return 0;
        });

        setMarkers(filteredMarkers);
    }, [wheelchairFilter, friendlinessFilter, sortBy, searchResults]);

    const handleCreateMarker = (newMarker) => {
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    };

    const handleSearchResults = (results) => {
        setSearchResults(results);
        setMarkers(results);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 w-full p-4 shadow-sm">
                <SearchBar onSearchResults={handleSearchResults} />

                <div className="mt-4 flex space-x-4">
                    <select
                        className="p-2 border rounded text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 dropdown"
                        value={wheelchairFilter}
                        onChange={(e) => setWheelchairFilter(e.target.value)}
                    >
                        <option value="all">All Accessibility</option>
                        <option value="accessible">Wheelchair Accessible</option>
                        <option value="not-accessible">Not Wheelchair Accessible</option>
                    </select>
                    <select
                        className="p-2 border rounded text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                        value={friendlinessFilter}
                        onChange={(e) => setFriendlinessFilter(e.target.value)}
                    >
                        <option value="all">All Friendliness</option>
                        <option value="4plus">4 Stars & Up</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <div className="w-1/2 p-6 overflow-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Location List</h2>
                        <select
                            className="p-2 border rounded text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="name">Sort by Name</option>
                            <option value="friendliness">Sort by Friendliness</option>
                        </select>
                    </div>

                    {markers.map((marker, index) => (
                        <LocationCard key={index} marker={marker} />
                    ))}
                </div>
                <div className="w-1/2 bg-gray-100 dark:bg-gray-800">
                    <MapComponent markers={markers} />
                </div>
            </div>

            <div
                className="absolute bottom-8 right-8 flex items-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {isHovered && (
                    <span className="mr-2 bg-orange-500 text-white text-sm py-1 px-2 rounded shadow-lg button">
                        Create
                    </span>
                )}
                <button
                    className="button w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-all duration-300"
                    onClick={() => setIsModalOpen(true)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                </button>
            </div>

            <CreateMarkerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateMarker}
            />
        </div>
    );
}