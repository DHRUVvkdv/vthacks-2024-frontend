"use client";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useTheme } from 'next-themes';
import { lightModeStyles, darkModeStyles, ACCESSIBILITY_SUBCATEGORIES } from './styles';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import styles from './MapPage.module.css';
import CreateMarkerModal from "../../components/CreateMarkerModal";
import StarRating from "../../components/StarRating"; 

const GOOGLE_MAPS_API_KEY = "AIzaSyDtUZDVbs6sO05Z9NKBj-zA4CnS1mVOKXQ";

const categories = [
  "Entertainment",
  "Establishment",
  "Fitness",
  "Housing",
  "Restaurant",
  "Other"
];

const placeholderReviews = [
  {
    name: "John Doe",
    text: "Great accessibility features. The ramps are well-maintained and the staff is very helpful."
  },
  {
    name: "Jane Smith",
    text: "The automatic doors make entry easy. However, some areas could use better lighting for those with visual impairments."
  },
  {
    name: "Alex Johnson",
    text: "Excellent accommodations for wheelchair users. The elevators are spacious and always in good working order."
  },
  {
    name: "Sam Brown",
    text: "The braille signage is very helpful. I'd love to see more tactile maps throughout the building."
  }
];

export default function MapPage() {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const inputRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
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
  const [openSections, setOpenSections] = useState({});
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [reviewsVisible, setReviewsVisible] = useState({});
  const [reviews, setReviews] = useState({});
  const [accessibilityData, setAccessibilityData] = useState({});


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

    // Fetch data from API
    fetch('https://rksm5pqdlaltlgj5pf6du4glwa0ahmao.lambda-url.us-east-1.on.aws/api/buildings/get-buildings/get')
      .then(response => response.json())
      .then(data => {
        setMapMarkers(data);
        updateMarkers(data, map);
        // Fetch accessibility data for each building
        console.log("now")
        data.forEach(building => {
          fetchAccessibilityData(building.GID);
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    // Fetch reviews data
    fetch('https://rksm5pqdlaltlgj5pf6du4glwa0ahmao.lambda-url.us-east-1.on.aws/api/review/get-reviews')
      .then(response => response.json())
      .then(data => {
        console.log('Reviews API Response:', data);
        const reviewsByGID = data.reduce((acc, review) => {
          if (!acc[review.GID]) {
            acc[review.GID] = [];
          }
          acc[review.GID].push(review);
          return acc;
        }, {});
        setReviews(reviewsByGID);
      })
      .catch(error => {
        console.error('Error fetching reviews data:', error);
      });

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

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });

      map.fitBounds(bounds);
    });
  }, [isLoaded, currentTheme]);

  const toggleReviews = (key) => {
    setReviewsVisible(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const updateMarkers = (markers, map) => {
    mapMarkersRef.forEach(marker => marker.setMap(null));
   
    const newMapMarkers = markers.map((markerData) => {
      const position = new google.maps.LatLng(markerData.latitude, markerData.longitude);
      const mapMarker = new google.maps.Marker({
        position: position,
        map: map,
        title: markerData.buildingName
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
        marker.buildingName.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (wheelchairFilter) {
      result = result.filter(marker => marker.mobility_accessibility_dict.accessiblerestrooms);
    }

    if (highFriendlinessFilter) {
      result = result.filter(marker => marker.overall_inclusivity_rating > 4);
    }

    if (selectedCategories.length > 0) {
      result = result.filter(marker => 
        selectedCategories.includes(marker.category)
      );
    }

    // Apply advanced filters
    Object.entries(advancedFilters).forEach(([category, subcategories]) => {
      Object.entries(subcategories).forEach(([subcategory, isSelected]) => {
        if (isSelected) {
          result = result.filter(marker => marker[`${category}_dict`]?.[subcategory]);
        }
      });
    });

    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.buildingName.localeCompare(b.buildingName);
      } else if (sortBy === "friendliness") {
        return b.overall_inclusivity_rating - a.overall_inclusivity_rating;
      }
    });

    setFilteredMarkers(result);
 
    // Update map markers when filters change
    if (googleMapRef.current) {
      updateMarkers(result, googleMapRef.current);
    }
  }, [mapMarkers, nameFilter, wheelchairFilter, highFriendlinessFilter, sortBy, selectedCategories, advancedFilters]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prevCategories => 
      prevCategories.includes(category)
        ? prevCategories.filter(c => c !== category)
        : [...prevCategories, category]
    );
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const fetchAccessibilityData = (GID) => {
    fetch(`https://rksm5pqdlaltlgj5pf6du4glwa0ahmao.lambda-url.us-east-1.on.aws/api/aggregations/get-aggregation/${GID}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(`Aggregate data for GID ${GID}:`, JSON.stringify(data, null, 2));
        if (Object.keys(data).length === 0) {
          throw new Error('No data available');
        }
        setAccessibilityData(prevData => ({
          ...prevData,
          [GID]: processAccessibilityData(data)
        }));
      })
      .catch(error => {
        console.error('Error fetching accessibility data:', error);
        setAccessibilityData(prevData => ({
          ...prevData,
          [GID]: createNoDataAvailableObject()
        }));
      });
  };
  
  const processAccessibilityData = (data) => {
    const processedData = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key.endsWith('_dict')) {
        processedData[key] = Object.entries(value).reduce((acc, [subKey, [first, second]]) => {
          if (second === 0) {
            acc[subKey] = 'No data available';
          } else {
            acc[subKey] = first / second >= 0.5 ? 'Yes' : 'No';
          }
          return acc;
        }, {});
      } else if (key.endsWith('_rating')) {
        const [first, second] = value;
        processedData[key] = second === 0 ? 0 : Math.round(first / second);
      }
      // We're not processing text fields as per your request
    });
    return processedData;
  };
  
  const createNoDataAvailableObject = () => {
    const noDataObject = {};
    Object.keys(ACCESSIBILITY_SUBCATEGORIES).forEach(key => {
      noDataObject[`${key}_dict`] = Object.keys(ACCESSIBILITY_SUBCATEGORIES[key]).reduce((acc, subKey) => {
        acc[subKey] = 'No data available';
        return acc;
      }, {});
      noDataObject[`${key}_rating`] = 0;
    });
    return noDataObject;
  };

  const handleCardClick = (marker) => {
    setSelectedMarker({
      ...marker,
      accessibilityData: accessibilityData[marker.GID] || {}
    });
    setIsModalOpen(true);
    
    const latLng = new google.maps.LatLng(marker.latitude, marker.longitude);
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
    setMapMarkers((prevMarkers) => [...prevMarkers, newMarkerData]);
    updateMarkers([...mapMarkers, newMarkerData], googleMapRef.current);
    setIsCreateModalOpen(false);
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleAdvancedFilter = () => {
    setIsAdvancedFilterOpen(!isAdvancedFilterOpen);
  };

  const handleAdvancedFilterChange = (category, subcategory) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: !prev[category]?.[subcategory]
      }
    }));
  };

  return (
    <>
      <Head>
        <title>Accessibility Map</title>
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
                  {categories.map(category => (
                    <label key={category} className={styles.dropdownItem}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                      />
                      {category}
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
              High Inclusivity
            </button>
            <button
              onClick={toggleAdvancedFilter}
              className={`${styles.filterButton} ${isAdvancedFilterOpen ? styles.active : ''} ${styles.advancedFilterButton}`}
            >
              <Filter size={18} />
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
                  <option value="friendliness">Sort by Inclusivity</option>
                </select>
              </div>
            </div>
            <div className={styles.cardContainer}>
            {filteredMarkers.map((marker, index) => (
              <div key={index} className={styles.card} onClick={() => handleCardClick(marker)}>
                <h3>{marker.buildingName}</h3>
                <p className={styles.category}>{marker.category}</p>
                <p className={styles.location}>{marker.address}</p>
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
            <h2 className={styles.modalHeading}>{selectedMarker.buildingName}</h2>
            <p><strong>Address:</strong> {selectedMarker.address}</p>
            <p><strong>Category:</strong> {selectedMarker.category}</p>
            
            <h3>Accessibility Information:</h3>
            {Object.entries(ACCESSIBILITY_SUBCATEGORIES).map(([key, subcategories]) => (
              <div key={key} className={styles.accessibilitySection}>
                <button 
                  className={styles.sectionToggle}
                  onClick={() => toggleSection(key)}
                >
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  {openSections[key] ? <ChevronUp /> : <ChevronDown />}
                </button>
                {openSections[key] && (
                  <div className={styles.sectionContent}>
                    <div className={styles.ratingContainer}>
                      <strong>Rating:</strong>
                      <StarRating rating={selectedMarker.accessibilityData[`${key}_rating`] || 0} />
                    </div>
                    <h4>Details:</h4>
                    <ul>
                      {Object.entries(subcategories).map(([subKey, subName]) => (
                        <li key={subKey}>
                          {subName}: {selectedMarker.accessibilityData[`${key}_dict`]?.[subKey] || 'No data available'}
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => toggleReviews(key)} 
                      className={styles.reviewToggle}
                    >
                      {reviewsVisible[key] ? "Hide reviews" : "Show all reviews"}
                    </button>
                    {reviewsVisible[key] && (
                    <div className={styles.allReviews}>
                      {reviews[selectedMarker.GID]?.map((review, index) => (
                        <div key={index} className={styles.reviewItem}>
                          <span className={styles.reviewerName}>{review.user_name}</span>
                          <p className={styles.reviewText}>{review[`${key}_text`]}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  </div>
                )}
              </div>
            ))}
            <button onClick={() => setIsModalOpen(false)} className={styles.closeButton}>Close</button>
          </div>
        </div>
      )}
      {isAdvancedFilterOpen && (
        <div className={styles.modalOverlay} onClick={toggleAdvancedFilter}>
          <div className={styles.advancedFilterContent} onClick={(e) => e.stopPropagation()}>
            <h2>Advanced Filters</h2>
            <div className={styles.filterGrid}>
              {Object.entries(ACCESSIBILITY_SUBCATEGORIES).map(([key, subcategories]) => (
                <div key={key} className={styles.filterSection}>
                  <h3>{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h3>
                  <div className={styles.filterItemsGrid}>
                    {Object.entries(subcategories).map(([subKey, subName]) => (
                      <label key={subKey} className={styles.filterItem}>
                        <input
                          type="checkbox"
                          checked={advancedFilters[key]?.[subKey] || false}
                          onChange={() => handleAdvancedFilterChange(key, subKey)}
                        />
                        <span>{subName}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={toggleAdvancedFilter} className={styles.closeButton}>Close</button>
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