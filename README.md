# MultiUserTracker (Mapper)

A real-time multi-user tracking system built using **Node.js**, **Socket.io**, and **Leaflet.js**.  
It allows multiple users to share their location on a live map — perfect for delivery apps, fleet management, event coordination, and more.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue)](googlechrome://multiusertracker.onrender.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.0+-orange)](https://socket.io/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9+-brightgreen)](https://leafletjs.com/)

---

## 🚀 Features

- **Real-time location sharing** with **Socket.io** websockets
- **Beautiful interactive map** rendered using **Leaflet.js**
- **Support for multiple users** on the same map
- **Smart Zoom Control**: Zoom levels persist after manual interaction - no more unwanted zoom resets
- **Mobile-Optimized**: Fully responsive design with touch-friendly controls
- **Cross-Platform Compatibility**: Works seamlessly on iOS, Android, and desktop browsers
- **Named Users**: Each user enters a custom name for easy identification
- **Visual Distinction**: Different marker colors to distinguish between yourself and other users
- **Auto-Centering**: Automatically centers on your location when first loading
- **Secure communication** over HTTPS
- **Scalable and ready for deployment**
- **Deployed live** on **Render.com**

## 🚀 Live Demo

Experience the application live: **[https://multiusertracker.onrender.com/](https://multiusertracker.onrender.com/)**

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js, Socket.io
- **Frontend:** HTML5, CSS3, JavaScript, Leaflet.js (EJS templating)
- **Real-Time Communication:** Socket.IO WebSockets
- **Mapping:** Leaflet.js with OpenStreetMap tiles
- **Geolocation:** HTML5 Geolocation API
- **Deployment:** Render.com
- **Version Control:** Git, GitHub

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (version 14 or higher)
- npm or yarn package manager
- Modern web browser with geolocation support
- HTTPS connection (required for geolocation on most browsers)

---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/I-am-Rishabh/MultiUserTracker.git
   cd MultiUserTracker
   ```

## 📟 Terminal

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`
   - Allow location permissions when prompted
   - Enter your name and start tracking!

## 📱 Usage Guide

### Getting Started
1. **Open the application** in your web browser
2. **Allow location access** when prompted by your browser
3. **Enter your name** in the prompt dialog
4. **View the map** - you'll see your location marked with a red marker
5. **Share the URL** with friends to see their locations in real-time

### Map Controls
- **Zoom In/Out**: Use zoom buttons or pinch gestures on mobile
- **Pan**: Click and drag (desktop) or touch and drag (mobile)
- **Recenter**: Click the "📍 My Location" button to return to your position
- **Persistent Zoom**: Your zoom level stays the same even when locations update

### User Features
- **Your Marker**: Red marker with your name and "(You)" label
- **Other Users**: Blue markers with their respective names
- **Real-Time Updates**: All markers update automatically as users move
- **Disconnection Handling**: Markers disappear when users leave

## 🔧 API Reference

### Socket.IO Events

#### Client → Server
```javascript
// Send current location to server
socket.emit("send-location", {
  latitude: number,
  longitude: number,
  userName: string
});
```

#### Server → Client
```javascript
// Receive location updates from other users
socket.on("receive-location", (data) => {
  // data: { id, latitude, longitude, userName }
});

// Handle user disconnections
socket.on("user-disconnected", (userId) => {
  // Remove user marker from map
});
```

## 🏗️ Project Structure

```
├── server.js              # Main server file
├── views/
│   └── index.ejs          # Main HTML template
├── public/
│   ├── css/               # Stylesheets
|   |  |__ style.css
│   ├── js/                # Client-side JavaScript
│      |__ script.js
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
└── README.md             # Documentation
```

## 🔒 Privacy & Security

- **Location Data**: Location information is only shared with active users and is not stored permanently
- **Real-Time Only**: No location history is maintained on the server
- **User Control**: Users can close the browser tab to stop sharing their location
- **No Registration**: No personal information is collected beyond the chosen display name

## 🌐 Browser Compatibility

- ✅ Chrome 50+
- ✅ Firefox 45+
- ✅ Safari 10+
- ✅ Edge 15+
- ✅ Mobile Chrome (Android)
- ✅ Mobile Safari (iOS)

**Note**: HTTPS connection required for geolocation API on most modern browsers.

## 🚀 Deployment

### Render.com (Recommended)
1. Connect your GitHub repository to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Deploy automatically on push to main branch

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature-name`
3. **Commit changes**: `git commit -m 'Add some feature'`
4. **Push to branch**: `git push origin feature-name`
5. **Submit a pull request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues & Troubleshooting

### Common Issues

**Location not working on mobile:**
- Ensure you're accessing the site via HTTPS
- Check browser location permissions
- Try refreshing the page and allow permissions again

**Zoom keeps resetting:**
- This should be fixed in the latest version
- If issues persist, try the "📍 My Location" button to recenter manually

**Markers not updating:**
- Check your internet connection
- Ensure JavaScript is enabled in your browser
- Try refreshing the page

### Support

For support or bug reports, please create an issue in the repository or contact the development team.

## 🎯 Future Enhancements

- [ ] Chat functionality between users
- [ ] Location history and trails
- [ ] Group creation and private rooms
- [ ] Custom marker icons and colors
- [ ] Offline mode support
- [ ] Location sharing time limits
- [ ] Integration with mapping services

---

**Built with ❤️ for real-time location sharing**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/I-am-Rishabh/MultiUserTracker)
[![Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Now-success)](https://multiusertracker.onrender.com/)
