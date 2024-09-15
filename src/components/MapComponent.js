'use client'

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

export default function MapComponent({ markers }) {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const { theme, systemTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(theme);

  const lightModeStyles = [
    {
      "featureType": "all",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "weight": "2.00"
        }
      ]
    },
    {
      "featureType": "all",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#9c9c9c"
        }
      ]
    },
    {
      "featureType": "all",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        {
          "color": "#f2f2f2"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
        {
          "saturation": -100
        },
        {
          "lightness": 45
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#7b7b7b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        {
          "color": "#46bcec"
        },
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#c8d7d4"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#070707"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    }
  ];

  const darkModeStyles = [
    {
      "featureType": "all",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#202c3e"
        }
      ]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "gamma": 0.01
        },
        {
          "lightness": 20
        },
        {
          "weight": "1.39"
        },
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "weight": "0.96"
        },
        {
          "saturation": "9"
        },
        {
          "visibility": "on"
        },
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [
        {
          "lightness": 30
        },
        {
          "saturation": "9"
        },
        {
          "color": "#29446b"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "saturation": 20
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "lightness": 20
        },
        {
          "saturation": -20
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "lightness": 10
        },
        {
          "saturation": -30
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#193a55"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "saturation": 25
        },
        {
          "lightness": 25
        },
        {
          "weight": "0.01"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        {
          "lightness": -20
        }
      ]
    }
  ];

  useEffect(() => {
    setCurrentTheme(theme === 'system' ? systemTheme : theme);
  }, [theme, systemTheme]);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDtUZDVbs6sO05Z9NKBj-zA4CnS1mVOKXQ&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    };

    window.initMap = () => {
      googleMapRef.current = new google.maps.Map(mapRef.current, {
        center: { lat: 37.221297, lng: -80.429259 },
        zoom: 13,
        disableDefaultUI: true,
        styles: currentTheme === 'dark' ? darkModeStyles : lightModeStyles,
      });

      updateMarkers();
    };

    loadGoogleMaps();
  }, [currentTheme]);

  useEffect(() => {
    if (googleMapRef.current) {
      updateMarkers();
    }
  }, [markers]);

  const updateMarkers = () => {
    const bounds = new google.maps.LatLngBounds();
    const map = googleMapRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    markers.forEach((location) => {
      const position = new google.maps.LatLng(location.lat, location.lng);
      const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: location.locationName
      });

      markersRef.current.push(marker);

      bounds.extend(position);

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div>
            <h3>${location.locationName}</h3>
            <p>${location.address}</p>
            <p>Wheelchair Accessible: ${location.wheelchairAccessible ? 'Yes' : 'No'}</p>
            <p>Friendliness: ${location.friendliness}/5</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });

    if (markers.length > 0) {
      map.fitBounds(bounds);
    }
  };

  return <div id="google-map" ref={mapRef} className="w-full h-full" style={{ minHeight: '100%' }}></div>;
}