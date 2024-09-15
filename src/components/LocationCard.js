import { FaWheelchair, FaStar } from "react-icons/fa";

// Utility function to safely format coordinates
const formatCoordinate = (value) => {
    if (typeof value === 'number') {
        return value.toFixed(6);
    } else if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 'N/A' : parsed.toFixed(6);
    }
    return 'N/A';
};

export default function LocationCard({ marker }) {
    return (
        <div className="card bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm p-5 mb-4 hover:shadow-md transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{marker.locationName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{marker.address}</p>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>Lat: {formatCoordinate(marker.lat)}</span>
                <span className="ml-2">Lng: {formatCoordinate(marker.lng)}</span>
            </div>
            <div className="flex items-center mb-1">
                <FaWheelchair
                    className={marker.wheelchairAccessible ? "text-orange-500" : "text-gray-400 dark:text-gray-600"}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {marker.wheelchairAccessible ? "Accessible" : "Not accessible"}
                </span>
            </div>
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <FaStar
                        key={i}
                        className={i < marker.friendliness ? "text-orange-400" : "text-gray-300 dark:text-gray-600"}
                    />
                ))}
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {marker.friendliness}/5 Friendliness
                </span>
            </div>
        </div>
    );
}