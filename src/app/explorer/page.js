"use client";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useTheme } from 'next-themes';
import { lightModeStyles, darkModeStyles } from './styles';
import { ChevronDown } from 'lucide-react'; 
import markers from '../data/markerData';
import styles from './MapPage.module.css';
import CreateMarkerModal from "../../components/CreateMarkerModal";

const GOOGLE_MAPS_API_KEY = "AIzaSyDtUZDVbs6sO05Z9NKBj-zA4CnS1mVOKXQ";

const categories = [
  "Entertainment",
  "Establishment",
  "Fitness",
  "Housing",
  "Restaurant",
  "Other"
];

export default function MapPage() {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const inputRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [mapMarkers, setMapMarkers] = useState(markers);
  const [filteredMarkers, setFilteredMarkers] = useState(markers);
  const [mapMarkersRef, setMapMarkersRef] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [wheelchairFilter, setWheelchairFilter] = useState(false);
  const [highFriendlinessFilter, setHighFriendlinessFilter] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);


  useEffect(() => {
    setCurrentTheme(theme === 'system' ? systemTheme : theme);
  }, [theme, systemTheme]);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const google = window.google;
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 37.22954, lng: -80.41434 },
      zoom: 13,
      mapTypeId: "roadmap",
      styles: currentTheme === 'dark' ? darkModeStyles : lightModeStyles,
      disableDefaultUI: true,
    });

    googleMapRef.current = map;

    updateMarkers(filteredMarkers, map);

    const searchBox = new google.maps.places.SearchBox(inputRef.current);

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places.length === 0) return;

      const bounds = new google.maps.LatLngBounds();

      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const placeId = place.place_id;

        const markerExists = mapMarkers.some(
          (marker) => marker.placeId === placeId
        );

        if (!markerExists) {
          const newMarker = {
            locationName: place.name,
            lat: lat,
            lng: lng,
            address: place.formatted_address,
            placeId: placeId,
            wheelchairAccessible: false,
            friendliness: 0
          };

          setMapMarkers((prevMarkers) => {
            const updatedMarkers = [...prevMarkers, newMarker];
            updateMarkers(updatedMarkers, map);
            return updatedMarkers;
          });
        }

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });

      map.fitBounds(bounds);
      
    });
    fetch('https://rksm5pqdlaltlgj5pf6du4glwa0ahmao.lambda-url.us-east-1.on.aws/api/review/get-reviews')
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data);
        // You can process the data here if needed
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [isLoaded, currentTheme, filteredMarkers]);

  const updateMarkers = (markers, map) => {
    mapMarkersRef.forEach(marker => marker.setMap(null));
    
    const newMapMarkers = markers.map((markerData) => {
      const position = new google.maps.LatLng(markerData.lat, markerData.lng);
      const mapMarker = new google.maps.Marker({
        position: position,
        map: map,
        title: markerData.locationName
      });

      mapMarker.addListener('click', () => {
        setSelectedMarker(markerData);
        setIsModalOpen(true);
      });

      return mapMarker;
    });

    setMapMarkersRef(newMapMarkers);
  };

  useEffect(() => {
    let result = mapMarkers;

    if (nameFilter) {
      result = result.filter(marker => 
        marker.locationName.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (wheelchairFilter) {
      result = result.filter(marker => marker.wheelchairAccessible);
    }

    if (highFriendlinessFilter) {
      result = result.filter(marker => marker.friendliness > 4);
    }

    if (selectedCategories.length > 0) {
      result = result.filter(marker => 
        selectedCategories.includes(marker.category)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.locationName.localeCompare(b.locationName);
      } else if (sortBy === "friendliness") {
        return b.friendliness - a.friendliness;
      }
    });

    setFilteredMarkers(result);
  }, [mapMarkers, nameFilter, wheelchairFilter, highFriendlinessFilter, sortBy, selectedCategories]);

  const handleTypeChange = (type) => {
    setSelectedCategories(prevTypes => 
      prevTypes.includes(type)
        ? prevTypes.filter(t => t !== type)
        : [...prevTypes, type]
    );
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const handleCardClick = (marker) => {
    setSelectedMarker(marker);
    setIsModalOpen(true);
    
    const latLng = new google.maps.LatLng(marker.lat, marker.lng);
    googleMapRef.current.panTo(latLng);
    googleMapRef.current.setZoom(15);
  };


  const handleCreateButtonClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateMarker = (newMarkerData) => {
    console.log("Received new marker data:", JSON.stringify(newMarkerData, null, 2));
    const newMarker = {
      locationName: newMarkerData.buildingName,
      lat: newMarkerData.latitude,
      lng: newMarkerData.longitude,
      address: newMarkerData.address,
      placeId: newMarkerData.place_id,
      wheelchairAccessible: newMarkerData.mobility_accessibility_dict.accessiblerestrooms === "true",
      friendliness: newMarkerData.overall_inclusivity_rating
    };
    setMapMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    updateMarkers([...mapMarkers, newMarker], googleMapRef.current);
    setIsCreateModalOpen(false);
  };

  return (
    <>
      <Head>
        <title>Google Maps Search</title>
      </Head>
      <div className={`${styles.pageContainer} ${styles[currentTheme]}`}>
        <div className={styles.searchContainer}>
          <input
            id="pac-input"
            type="text"
            placeholder="Enter a location"
            ref={inputRef}
            className={styles.searchInput}
          />
          <div className={styles.filterButtons}>
            <div className={styles.categoryDropdown}>
              <button
                onClick={toggleCategoryDropdown}
                className={`${styles.filterButton} ${selectedCategories.length > 0 ? styles.active : ''} ${styles.categoryButton}`}
              >
                Category ({selectedCategories.length})
                <ChevronDown className={styles.dropdownIcon} />
              </button>
              {isCategoryDropdownOpen && (
                <div className={styles.dropdownContent}>
                  {categories.map(type => (
                    <label key={type} className={styles.dropdownItem}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(type)}
                        onChange={() => handleTypeChange(type)}
                      />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setWheelchairFilter(!wheelchairFilter)}
              className={`${styles.filterButton} ${wheelchairFilter ? styles.active : ''}`}
            >
              Wheelchair Accessible
            </button>
            <button
              onClick={() => setHighFriendlinessFilter(!highFriendlinessFilter)}
              className={`${styles.filterButton} ${highFriendlinessFilter ? styles.active : ''}`}
            >
              4+ Star Friendliness
            </button>
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.leftPanel}>
            <div className={styles.filterContainer}>
              <div className={styles.filterSortWrapper}>
                <input
                  type="text"
                  placeholder="Filter by name"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className={styles.filterInput}
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.sortSelect}
                >
                  <option value="name">Sort by Name</option>
                  <option value="friendliness">Sort by Friendliness</option>
                </select>
              </div>
            </div>
            <div className={styles.cardContainer}>
            {filteredMarkers.map((marker, index) => (
              <div key={index} className={styles.card}>
                <h3 onClick={() => handleCardClick(marker)}>{marker.locationName}</h3>
                <p>{marker.address}</p>
                <p>Friendliness: {marker.friendliness}/5</p>
                <p>Wheelchair Accessible: {marker.wheelchairAccessible ? 'Yes' : 'No'}</p>
                <span onMouseEnter={() => handleCardClick(marker)} className={styles.hoverEffect}></span>  {/* Optional: Add a hover effect */}
              </div>
            ))}
            </div>
          </div>
          <div className={styles.mapContainer} ref={mapRef}></div>
        </div>
        <div className={styles.createButton} onClick={handleCreateButtonClick}>
          <span className={styles.createText}>Create</span>
          <button>+</button>
        </div>
      </div>
      {isModalOpen && selectedMarker && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>{selectedMarker.locationName}</h2>
            <p><strong>Address:</strong> {selectedMarker.address}</p>
            <p><strong>Latitude:</strong> {selectedMarker.lat}</p>
            <p><strong>Longitude:</strong> {selectedMarker.lng}</p>
            <p><strong>GID:</strong> {selectedMarker.placeId}</p>
            <p><strong>Wheelchair Accessible:</strong> {selectedMarker.wheelchairAccessible ? 'Yes' : 'No'}</p>
            <p><strong>Friendliness:</strong> {selectedMarker.friendliness}/5</p>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
      {isCreateModalOpen && (
        <CreateMarkerModal
          isOpen={isCreateModalOpen}
          onClose={handleCreateModalClose}
          onSubmit={handleCreateMarker}
          googleMap={googleMapRef.current}
          existingMarkers={mapMarkers} 
        />
      )}
    </>
  );
}