// Global variables
var startTime;
var startLocation;
var totalDistance = 0;
var totalCalories = 0;
var totalSpeed = 0;
var readingsCount = 0;

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = R * c; // Distance in km
  return distance;
}

// Function to convert degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Function to calculate burned calories
function calculateCalories(distance) {
  // Assuming an average of 50 calories burned per km
  var calories = distance * 50;
  return calories;
}

// Function to update the statistics and UI
function updateDistance(newLatitude, newLongitude) {
  if (!startLocation) {
    startLocation = {
      latitude: newLatitude,
      longitude: newLongitude
    };
    startTime = new Date();
    return;
  }

  var distance = calculateDistance(startLocation.latitude, startLocation.longitude, newLatitude, newLongitude);
  var elapsedTime = new Date() - startTime;
  var speed = (distance / (elapsedTime / 1000)) * 3600; // Speed in km/h
  var calories = calculateCalories(distance);

  totalDistance += distance;
  totalCalories += calories;
  totalSpeed += speed;
  readingsCount++;

  updateUI();

  // Update the start location for the next calculation
  startLocation.latitude = newLatitude;
  startLocation.longitude = newLongitude;
}

// Function to update the UI with the statistics
function updateUI() {
  var distanceInMeters = totalDistance * 1000;
  var kilometers = Math.floor(distanceInMeters / 1000);
  var meters = Math.floor(distanceInMeters % 1000);

  var speed = totalSpeed / readingsCount;

  var distanceText = kilometers + " km " + meters + " m";
  document.getElementById("distance").textContent = distanceText;
  document.getElementById("calories").textContent = totalCalories.toFixed(2) + " calories";
  document.getElementById("average-speed").textContent = speed.toFixed(2) + " km/h";
}

// Function to handle successful location retrieval
function successCallback(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  updateDistance(latitude, longitude);
}

// Function to handle location retrieval error
function errorCallback(error) {
  console.error("Oh snap! An error occurred: " + error.message);
}

// Request location updates
navigator.geolocation.watchPosition(successCallback, errorCallback);
