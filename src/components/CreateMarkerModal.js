import React, { useState, useEffect, useRef } from "react";
import { FaStar, FaChevronDown, FaChevronUp } from "react-icons/fa";

const accessibilitySections = [
    {
        name: "mobilityAccessibility",
        title: "Mobility Accessibility",
        questions: [
            "Sloped Ramps",
            "Power Assisted Doors",
            "Accessible Restrooms",
            "Accessible Seating Areas"
        ]
    },
    {
        name: "cognitiveAccessibility",
        title: "Cognitive Accessibility",
        questions: [
            "Clear Signage",
            "Quiet Spaces",
            "Simplified Layout",
            "Staff Training for Cognitive Support"
        ]
    },
    {
        name: "hearingAccessibility",
        title: "Hearing Accessibility",
        questions: [
            "Visual Alarms",
            "Hearing Loop Systems",
            "Sign Language Interpreters Available",
            "Captioning on Media"
        ]
    },
    {
        name: "visionAccessibility",
        title: "Vision Accessibility",
        questions: [
            "Braille Signage",
            "Audio Descriptions",
            "High-Contrast Signage",
            "Tactile Guidance Systems"
        ]
    },
    {
        name: "bathroomAccessibility",
        title: "Bathroom Accessibility",
        questions: [
            "Gender-Neutral Options",
            "Family/Companion Care Rooms",
            "Adult Changing Tables",
            "Automatic Fixtures"
        ]
    },
    {
        name: "lgbtqInclusivity",
        title: "LGBTQ+ Inclusivity",
        questions: [
            "Gender-Inclusive Policies",
            "LGBTQ+ Safe Space Certified",
            "Staff Training on LGBTQ+ Issues"
        ]
    },
    {
        name: "sensoryConsiderations",
        title: "Sensory Considerations",
        questions: [
            "Quiet Hours/Zones",
            "Adjustable Lighting",
            "Scent-Free Areas"
        ]
    },
    {
        name: "overallInclusivity",
        title: "Overall Inclusivity",
        questions: [
            "Diverse Representation in Imagery/Art",
            "Inclusive Language in Signage and Materials",
            "Cultural Sensitivity Training for Staff"
        ]
    }
];

export default function CreateMarkerModal({ isOpen, onClose, onSubmit, googleMap, existingMarkers }) {
    const initialAccessibilityState = accessibilitySections.reduce((acc, section) => {
        acc[section.name] = {
            rating: 0,
            additionalInfo: "",
            ...section.questions.reduce((qAcc, question) => {
                qAcc[question.toLowerCase().replace(/\s+/g, '')] = null;
                return qAcc;
            }, {})
        };
        return acc;
    }, {});

    const [markerData, setMarkerData] = useState({
        locationName: "",
        address: "",
        lat: "",
        lng: "",
        place_id: "",
        user_name: "trial-user",
        category: "other",
        ...initialAccessibilityState
    });

    const [expandedSections, setExpandedSections] = useState({});
    const [placeExists, setPlaceExists] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const autocompleteRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && window.google && googleMap) {
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                types: ['establishment'],
                fields: ['name', 'formatted_address', 'geometry', 'place_id']
            });
            autocomplete.bindTo('bounds', googleMap);
            autocompleteRef.current = autocomplete;

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }

                const newMarkerData = {
                    locationName: place.name,
                    address: place.formatted_address,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    place_id: place.place_id
                };

                setMarkerData(prev => ({
                    ...prev,
                    ...newMarkerData
                }));

                // Check if the place already exists in existingMarkers
                const exists = existingMarkers.some(marker => marker.GID === place.place_id);
                setPlaceExists(exists);
            });

            return () => {
                if (autocompleteRef.current) {
                    window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
                }
            };
        }
    }, [isOpen, googleMap, existingMarkers]);

    const handleChange = (e, section) => {
        const { name, value, type } = e.target;
        setMarkerData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: type === "checkbox" ? e.target.checked : value
            }
        }));
    };

    const handleStarClick = (section, rating) => {
        setMarkerData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                rating
            }
        }));
    };

    const toggleSection = (sectionName) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));
    };

    const resetForm = () => {
        setMarkerData({
            locationName: "",
            address: "",
            lat: "",
            lng: "",
            place_id: "",
            ...initialAccessibilityState
        });
        if (inputRef.current) {
            inputRef.current.value = "";
        }
        setExpandedSections({});
        setPlaceExists(null);
    };

    const formatDataForSubmission = () => {
        const formattedData = {
            buildingName: markerData.locationName,
            category: markerData.category,  // This will always be "other"
            GID: markerData.place_id,
            user_name: "markerData.user_id",    // This will always be "trial-user"
            address: markerData.address,
            latitude: parseFloat(markerData.lat),
            longitude: parseFloat(markerData.lng),
        };
      
        accessibilitySections.forEach(section => {
            const sectionName = section.name.replace(/([A-Z])/g, '_$1').toLowerCase();
            formattedData[`${sectionName}_dict`] = {};
            formattedData[`${sectionName}_rating`] = markerData[section.name].rating || 0;
            formattedData[`${sectionName}_text`] = markerData[section.name].additionalInfo || "";
        
            section.questions.forEach(question => {
              const key = question.toLowerCase().replace(/\s+/g, '');
              formattedData[`${sectionName}_dict`][key] = markerData[section.name][key] === null ? "" : markerData[section.name][key].toString();
            });
        });
      
        return formattedData;
    };

    const formatDataForBuildingCreation = () => {
        const emptyAccessibilityData = {
            dict: {},
            rating: 0,
            text_aggregate: "",
            count: 0
        };

        return {
            buildingName: markerData.locationName,
            category: "Other",
            GID: markerData.place_id,
            address: markerData.address,
            latitude: parseFloat(markerData.lat),
            longitude: parseFloat(markerData.lng),
            mobility_accessibility_dict: {
                "slopedramps": null,
                "powerassisteddoors": null,
                "accessiblerestrooms": null,
                "accessibleseatingareas": null
            },
            mobility_accessibility_rating: 0,
            mobility_accessibility_text_aggregate: "",
            mobility_accessibility_count: 0,
            cognitive_accessibility_dict: {
                "clearsignage": "",
                "quietspaces": "",
                "simplifiedlayout": "",
                "stafftrainingforcognitivesupport": ""
            },
            cognitive_accessibility_rating: 0,
            cognitive_accessibility_text_aggregate: "",
            cognitive_accessibility_count: 0,
            hearing_accessibility_dict: {
                "visualalarms": "",
                "hearingloopsystems": "",
                "signlanguageinterpretersavailable": "",
                "captioningonmedia": ""
            },
            hearing_accessibility_rating: 0,
            hearing_accessibility_text_aggregate: "",
            hearing_accessibility_count: 0,
            vision_accessibility_dict: {
                "braillesignage": "",
                "audiodescriptions": "",
                "high-contrastsignage": "",
                "tactileguidancesystems": ""
            },
            vision_accessibility_rating: 0,
            vision_accessibility_text_aggregate: "",
            vision_accessibility_count: 0,
            bathroom_accessibility_dict: {
                "gender-neutraloptions": "",
                "family/companioncarerooms": "",
                "adultchangingtables": "",
                "automaticfixtures": ""
            },
            bathroom_accessibility_rating: 0,
            bathroom_accessibility_text_aggregate: "",
            bathroom_accessibility_count: 0,
            lgbtq_inclusivity_dict: {
                "gender-inclusivepolicies": "",
                "lgbtq+safespacecertified": "",
                "stafftrainingonlgbtq+issues": ""
            },
            lgbtq_inclusivity_rating: 0,
            lgbtq_inclusivity_text_aggregate: "",
            lgbtq_inclusivity_count: 0,
            sensory_considerations_dict: {
                "quiethours/zones": "",
                "adjustablelighting": "",
                "scent-freeareas": ""
            },
            sensory_considerations_rating: 0,
            sensory_considerations_text_aggregate: "",
            sensory_considerations_count: 0,
            overall_inclusivity_dict: {
                "Diverse Representation in Imagery/art": "",
                "Inclusive Language in Signage and Materials": "",
                "Cultural Sensitivity Training for Staff": ""
            },
            overall_inclusivity_rating: 0,
            overall_inclusivity_text_aggregate: "",
            overall_inclusivity_count: 0
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitSuccess(false);
        setSubmitError(null);
        
        const formattedReviewData = formatDataForSubmission();
        console.log("Submitting formatted review data:", JSON.stringify(formattedReviewData, null, 2));
        
        try {
            if (!placeExists) {
                // If the building doesn't exist, create it first
                const buildingData = formatDataForBuildingCreation();
                console.log("Creating new building:", JSON.stringify(buildingData, null, 2));

                const buildingResponse = await fetch('https://rksm5pqdlaltlgj5pf6du4glwa0ahmao.lambda-url.us-east-1.on.aws/api/buildings/create-building', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(buildingData),
                });

                if (!buildingResponse.ok) {
                    throw new Error('Failed to create building');
                }

                const buildingResult = await buildingResponse.json();
                console.log('Building created successfully:', buildingResult);
            }

            // Now create the review
            const reviewResponse = await fetch('https://rksm5pqdlaltlgj5pf6du4glwa0ahmao.lambda-url.us-east-1.on.aws/api/review/create-review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedReviewData),
            });

            if (!reviewResponse.ok) {
                throw new Error('Failed to create review');
            }

            const reviewResult = await reviewResponse.json();
            console.log('Review created successfully:', reviewResult);
            setSubmitSuccess(true);
            onSubmit(formattedReviewData);
            setTimeout(() => {
                onClose();
                setSubmitSuccess(false);
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error('Error:', error);
            setSubmitError('Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative p-8 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800 max-h-[80vh] flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Add New Location</h3>
                {submitSuccess ? (
                    <div className="text-green-600 text-center py-4">
                        Review submitted successfully!
                    </div>
                ) : (
                <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Search Location
                        </label>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search for a location"
                            className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    {placeExists !== null && (
                        <h3 className={`text-lg font-semibold ${placeExists ? 'text-red-500' : 'text-green-500'}`}>
                            {placeExists ? 'This location already exists in our database.' : 'This is a new location!'}
                        </h3>
                    )}
                    {markerData.place_id && (
                        <div className="mb-4">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                {markerData.locationName}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{markerData.address}</p>
                        </div>
                    )}
                    <div className="flex-grow overflow-y-auto pr-4 -mr-4">
                        {markerData.place_id && accessibilitySections.map((section) => (
                            <div key={section.name} className="mb-4">
                                <button
                                    type="button"
                                    onClick={() => toggleSection(section.name)}
                                    className="flex items-center justify-between w-full py-2 text-left text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 rounded-md px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-orange-500"
                                >
                                    <span className="text-lg font-medium">{section.title}</span>
                                    {expandedSections[section.name] ? <FaChevronUp /> : <FaChevronDown />}
                                </button>
                                {expandedSections[section.name] && (
                                    <div className="mt-4 space-y-4">
                                        <div className="mb-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Rating
                                            </label>
                                            <div className="flex items-center mt-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <FaStar
                                                        key={star}
                                                        className={`cursor-pointer ${
                                                            star <= markerData[section.name].rating
                                                                ? "text-orange-400"
                                                                : "text-gray-300 dark:text-gray-600"
                                                        }`}
                                                        size={24}
                                                        onClick={() => handleStarClick(section.name, star)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {section.questions.map((question) => (
                                            <div key={question} className="mb-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {question}
                                                </label>
                                                <select
                                                    name={question.toLowerCase().replace(/\s+/g, '')}
                                                    value={markerData[section.name][question.toLowerCase().replace(/\s+/g, '')] === null ? '' : markerData[section.name][question.toLowerCase().replace(/\s+/g, '')].toString()}
                                                    onChange={(e) => handleChange(e, section.name)}
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                >
                                                    <option value="">Select</option>
                                                    <option value="true">Yes</option>
                                                    <option value="false">No</option>
                                                </select>
                                            </div>
                                        ))}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Additional Information
                                            </label>
                                            <textarea
                                                name="additionalInfo"
                                                value={markerData[section.name].additionalInfo}
                                                onChange={(e) => handleChange(e, section.name)}
                                                rows="3"
                                                className="mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                placeholder={`Add any additional information about ${section.title.toLowerCase()} here`}
                                            ></textarea>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {submitError && (
                        <div className="text-red-600 text-center py-2">
                            {submitError}
                        </div>
                    )}
                    
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={() => { resetForm(); onClose(); }}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!markerData.place_id || isSubmitting}
                            className={`px-4 py-2 text-white text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                                markerData.place_id && !isSubmitting
                                ? "bg-orange-500 hover:bg-orange-600" 
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
                )}
            </div>
        </div>
    );
}