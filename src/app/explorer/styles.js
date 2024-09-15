// styles/mapStyles.js
export const ACCESSIBILITY_SUBCATEGORIES = {
  mobility_accessibility: {
    slopedramps: "Sloped Ramps",
    powerassisteddoors: "Power-Assisted Doors",
    accessiblerestrooms: "Accessible Restrooms",
    accessibleseatingareas: "Accessible Seating Areas"
  },
  cognitive_accessibility: {
    clearsignage: "Clear Signage",
    quietspaces: "Quiet Spaces",
    simplifiedlayout: "Simplified Layout",
    stafftrainingforcognitivesupport: "Staff Training for Cognitive Support"
  },
  hearing_accessibility: {
    visualalarms: "Visual Alarms",
    hearingloopsystems: "Hearing Loop Systems",
    signlanguageinterpretersavailable: "Sign Language Interpreters Available",
    captioningonmedia: "Captioning on Media"
  },
  vision_accessibility: {
    braillesignage: "Braille Signage",
    audiodescriptions: "Audio Descriptions",
    "high-contrastsignage": "High-Contrast Signage",
    tactileguidancesystems: "Tactile Guidance Systems"
  },
  bathroom_accessibility: {
    "gender-neutraloptions": "Gender-Neutral Options",
    "family/companioncarerooms": "Family/Companion Care Rooms",
    adultchangingtables: "Adult Changing Tables",
    automaticfixtures: "Automatic Fixtures"
  },
  lgbtq_inclusivity: {
    "gender-inclusivepolicies": "Gender-Inclusive Policies",
    "lgbtq+safespacecertified": "LGBTQ+ Safe Space Certified",
    "stafftrainingonlgbtq+issues": "Staff Training on LGBTQ+ Issues"
  },
  sensory_considerations: {
    "quiethours/zones": "Quiet Hours/Zones",
    adjustablelighting: "Adjustable Lighting",
    "scent-freeareas": "Scent-Free Areas"
  },
  overall_inclusivity: {
    diverserepresentationinimagery: "Diverse Representation in Imagery/Art",
    inclusivelanguageinsignageandmaterials: "Inclusive Language in Signage and Materials",
    culturalsensitivitytrainingforstaff: "Cultural Sensitivity Training for Staff"
  }
};

export const lightModeStyles = [
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
  
  export const darkModeStyles = [
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