import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    if (req.user.isAdmin){
      const savedHotel = await newHotel.save();
      res.status(200).json(savedHotel);
    }
    else{
      alert("You are not admin!")
    }
    
  } catch (err) {
    next(err);
  }
};
export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};
export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};
export const getHotels = async (req, res, next) => {
  const { min, max, sort, ...others } = req.query;

  let sortOptions = {};

  switch (sort) {
    case "price-asc":
      sortOptions.cheapestPrice = 1; // Ascending order
      break;
    case "price-desc":
      sortOptions.cheapestPrice = -1; // Descending order
      break;
    case "popular":
      sortOptions.viewed = -1; // Sort by popularity (most viewed)
      break;
    case "recent":
      sortOptions.createdAt = -1; // Sort by recently added (newest first)
      break;
    default:
      sortOptions = {}; // No sorting
  }

  try {
    const hotels = await Hotel.find({
      ...others,
      cheapestPrice: { $gt: min || 1, $lt: max || 999 },
    })
      .sort(sortOptions) // Apply sorting
      .limit(req.query.limit);

    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list)
  } catch (err) {
    next(err);
  }
};
export const updateSold = async (req, res) => {
  const {id} = req.params;
  const {sold} = req.body;
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(id, { sold }, { new: true });
    res.status(200).json(updatedHotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const updateViews = async (req, res) => {
  const {id} = req.params;
  const {viewed} = req.body;
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(id, { viewed }, { new: true });
    res.status(200).json(updatedHotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getMostViewed = async (req, res) => {
  try {
    // Fetch hotels sorted by views in descending order and limit to 3
    const mostViewedHotels = await Hotel.find().sort({ viewed: -1 }).limit(3);
    
    res.status(200).json(mostViewedHotels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRecentlyAdded = async (req, res) => {
  try {
    // Fetch hotels sorted by creation date in descending order and limit to 3
    const lastAddedHotels = await Hotel.find().sort({ createdAt: -1 }).limit(3);
    
    res.status(200).json(lastAddedHotels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

