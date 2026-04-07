const axios = require("axios");
const captainModel = require("../models/captain.model");

module.exports.getAddressCoordinate = async (address) => {
  if (!address) throw new Error("Address is required");

  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: address,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "uber-clone-resume-project",
      },
    },
  );

  if (!response.data.length) {
    throw new Error("Unable to fetch coordinates");
  }

  return {
    lat: parseFloat(response.data[0].lat),
    lng: parseFloat(response.data[0].lon),
  };
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  try {
    // 1. Convert plain text addresses to coordinates using our existing function
    const originCoords = await module.exports.getAddressCoordinate(origin);
    const destinationCoords =
      await module.exports.getAddressCoordinate(destination);

    // 2. OSRM strictly expects "longitude,latitude" (lng first!)
    const originStr = `${originCoords.lng},${originCoords.lat}`;
    const destinationStr = `${destinationCoords.lng},${destinationCoords.lat}`;

    // 3. Make the OSRM request with the correct coordinate strings
    const url = `https://router.project-osrm.org/route/v1/driving/${originStr};${destinationStr}?overview=false`;

    const response = await axios.get(url);

    if (!response.data.routes || !response.data.routes.length) {
      throw new Error("No routes found");
    }

    const route = response.data.routes[0];

    return {
      distance: {
        value: route.distance, // meters
        text: `${(route.distance / 1000).toFixed(2)} km`,
      },
      duration: {
        value: route.duration, // seconds
        text: `${Math.ceil(route.duration / 60)} mins`,
      },
    };
  } catch (err) {
    console.error("Error calculating distance/time:", err.message);
    throw err;
  }
};
module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) throw new Error("Input is required");

  const response = await axios.get("https://photon.komoot.io/api/", {
    params: {
      q: input,
      limit: 5,
    },
  });

  return response.data.features.map((feature) => {
    const props = feature.properties;
    return `${props.name}, ${props.city || ""}, ${props.country || ""}`.trim();
  });
};

module.exports.getCaptainsInTheRadius = async (lng, lat, radius) => {
  // radius in KM

  const captains = await captainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius / 6371],
      },
    },
  });

  return captains;
};
