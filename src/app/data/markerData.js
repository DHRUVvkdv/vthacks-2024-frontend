/**
 * @typedef {Object} Marker
 * @property {string} locationName - The name of the location
 * @property {number} lat - Latitude of the location
 * @property {number} lng - Longitude of the location
 * @property {string} address - Address of the location
 */

/** @type {Marker[]} */
const markers = [
    {
      locationName: 'Data and Decision Sciences Building',
      lat: 37.23179467482696,
      lng: -80.42732307479794,
      address: '727 Prices Fork Rd, Blacksburg, VA 24060',
      placeId: 'ChIJB_Mf0KuVTYgRpK3jC3AMtVE',
      category: 'Establishment',
      wheelchairAccessible: true,
      friendliness: 4
      
    },
    {
      locationName: 'Casa de Ady',
      lat: 37.21010573857386,
      lng: -80.39658803237668,
      address: '1827 Grayland St, Blacksburg, VA 24060',
      placeId: 'ChIJY2hoNbKVTYgRctQ9Fd0-PR8',
      category: 'Housing',
      wheelchairAccessible: false,
      friendliness: 4
    },
    {
      locationName: 'Benny Pizza',
      lat: 37.229585480216166, 
      lng: -80.41524269479582,
      address: '110 Draper Rd NW, Blacksburg, VA 24060, USA',
      placeId: 'ChIJ9db1unSVTYgR4S9hOoP1gjo',
      wheelchairAccessible: true,
      friendliness: 3
    },
    {
      locationName: 'D.P. Dough',
      lat: 37.230710559471795, 
      lng: -80.41533678035071,
      address: '215 N Main St, Blacksburg, VA 24060, USA',
      placeId: 'ChIJpeE9kXSVTYgRUzu2OYwZm8g',
      wheelchairAccessible: true,
      friendliness: 5
    }
  ];
  
  export default markers;