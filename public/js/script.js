const socket = io();

let userName = null;

// Ask for user name once on page load
window.addEventListener("DOMContentLoaded", () => {
  userName = prompt("Please enter your name:");
  if (!userName || userName.trim() === "") {
    userName = "Anonymous";
  }
});

// Check for geolocation support and watch position
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      console.log(
        `Location: ${latitude}, ${longitude} (Accuracy: ${accuracy} meters)`
      );

      // Send location along with userName
      socket.emit("send-location", { latitude, longitude, userName });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
} else {
  console.log("Geolocation is not supported by this browser.");
}

// Initialize the map
const map = L.map("map").setView([0, 0], 16);

// Add a tile layer to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "StreetMap-byPayalKri",
}).addTo(map);

// Store markers by user ID
const markers = {};

// Listen for incoming location data from the server
socket.on("receive-location", (data) => {
  const { id, latitude, longitude, userName: name } = data;

  if (markers[id]) {
    // Update the marker's position
    markers[id].setLatLng([latitude, longitude]);
    // Update the tooltip content as well (in case name changes)
    markers[id].setTooltipContent(name || `User: ${id}`);
  } else {
    // Create a new marker and bind a permanent tooltip showing the user name
    markers[id] = L.marker([latitude, longitude])
      .addTo(map)
      .bindTooltip(name || `User: ${id}`, {
        permanent: true, // Keep tooltip always visible
        direction: "top", // Show tooltip above the marker
        offset: [0, -10], // Offset it a bit higher
        className: "user-label", // Optional CSS class for styling
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

socket.on("send-location", (data) => {
  // data includes { latitude, longitude, userName }
  io.emit("receive-location", { id: socket.id, ...data });
});
