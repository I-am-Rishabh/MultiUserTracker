const socket = io();

let userName = null;
let isFirstLocation = true; // Track if this is the first location update
let userInteracted = false; // Track if user has manually interacted with the map

// Ask for user name once on page load
window.addEventListener("DOMContentLoaded", () => {
  userName = prompt("Please enter your name:");
  if (!userName || userName.trim() === "") {
    userName = "Anonymous";
  }
});

// Initialize the map
const map = L.map("map").setView([0, 0], 16);

// Add a tile layer to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "StreetMap-byPayalKri",
}).addTo(map);

// Track user interactions to prevent auto-centering after manual zoom/pan
map.on('zoomstart', () => {
  userInteracted = true;
});

map.on('movestart', () => {
  userInteracted = true;
});

// Optional: Reset user interaction flag after some time of inactivity
let interactionTimeout;
map.on('zoomend moveend', () => {
  clearTimeout(interactionTimeout);
  interactionTimeout = setTimeout(() => {
    // Reset after 30 seconds of no interaction (optional)
    // userInteracted = false;
  }, 30000);
});

// Store markers by user ID
const markers = {};
let myMarker = null; // Track your own marker separately

// Check for geolocation support and watch position
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      console.log(
        `Location: ${latitude}, ${longitude} (Accuracy: ${accuracy} meters)`
      );

      // Only auto-center on the first location update or if user hasn't interacted
      if (isFirstLocation && !userInteracted) {
        map.setView([latitude, longitude], 16);
        isFirstLocation = false;
      }

      // Update or create your own marker (different style to distinguish from others)
      if (myMarker) {
        myMarker.setLatLng([latitude, longitude]);
      } else {
        myMarker = L.marker([latitude, longitude], {
          icon: L.icon({
            iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        })
        .addTo(map)
        .bindTooltip(`${userName} (You)`, {
          permanent: true,
          direction: "top",
          offset: [0, -10],
          className: "user-label my-label",
        });
      }

      // Send your location+name to server
      socket.emit("send-location", { latitude, longitude, userName });
    },
    (error) => {
      console.error("Geolocation error:", error);
      
      // Better error handling for mobile devices
      let errorMessage = "Location access failed. ";
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += "Please allow location access and refresh the page.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage += "Location request timed out.";
          break;
        default:
          errorMessage += "An unknown error occurred.";
          break;
      }
      alert(errorMessage);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000, // Increased timeout for mobile devices
      maximumAge: 5000, // Allow slightly older positions to improve performance
    }
  );
} else {
  console.log("Geolocation is not supported by this browser.");
  alert("Geolocation is not supported by your browser. Please use a modern browser.");
}

// Listen for incoming location data from the server
socket.on("receive-location", (data) => {
  const { id, latitude, longitude, userName: name } = data;

  // Don't create a marker for your own location (we handle that separately)
  if (id === socket.id) {
    return;
  }

  if (markers[id]) {
    // Update the marker's position
    markers[id].setLatLng([latitude, longitude]);
    // Update the tooltip content as well (in case name changes)
    markers[id].setTooltipContent(name || `User: ${id}`);
  } else {
    // Create a new marker for other users
    markers[id] = L.marker([latitude, longitude])
      .addTo(map)
      .bindTooltip(name || `User: ${id}`, {
        permanent: true,
        direction: "top",
        offset: [0, -10],
        className: "user-label other-user-label",
      });
  }
});

// Remove markers when a user disconnects
socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});

// Add a button to recenter on your location (optional)
const recenterButton = L.control({position: 'topright'});
recenterButton.onAdd = function(map) {
  const div = L.DomUtil.create('div', 'recenter-button');
  div.innerHTML = '<button onclick="recenterOnMe()" style="padding: 5px 10px; background: #007cff; color: white; border: none; border-radius: 3px; cursor: pointer;">📍 My Location</button>';
  return div;
};
recenterButton.addTo(map);

// Function to recenter on user's location
function recenterOnMe() {
  if (myMarker) {
    const latLng = myMarker.getLatLng();
    map.setView(latLng, 16);
    userInteracted = false; // Allow auto-centering again
  }
}

// Mobile-specific improvements
// Prevent context menu on long press (mobile)
map.getContainer().addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// Improve touch handling
map.getContainer().style.touchAction = 'pan-x pan-y';

// Add zoom control positioning for mobile
map.zoomControl.setPosition('bottomright');