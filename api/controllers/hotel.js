import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { createError } from "../utils/error.js";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { Formidable } from "formidable";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    if (req.user.isAdmin){
      const savedHotel = await newHotel.save();
      res.status(200).json(savedHotel);
    } else {
      alert("You are not admin!")
    }
  } catch (err) {
    next(err);
  }
};

export const createHotelWithPhoto = async (req, res, next) => {
  const form = new Formidable();

  form.parse(req, async(err, fields, files) => {
    if(err){
      return next(createError(400, "Error parsing form data!"));
    }

    try {
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const type = Array.isArray(fields.type) ? fields.type[0] : fields.type;
      const city = Array.isArray(fields.city) ? fields.city[0] : fields.city;
      const address = Array.isArray(fields.address) ? fields.address[0] : fields.address;
      const distance = Array.isArray(fields.distance) ? fields.distance[0] : fields.distance;
      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const desc = Array.isArray(fields.desc) ? fields.desc[0] : fields.desc;
      const cheapestPrice = Number(fields.cheapestPrice);

      if(!name || !title || !city || !address || !distance || !title || !desc || !cheapestPrice){
        return next(createError(400, "Please fill in all of the required fields!"));
      }

      if(!req.user.isAdmin){
        return next(createError(400, "Sorry, your product has not been added, it is possible that you are not using an admin account."));
      }

      const isHotelExist = await Hotel.findOne({ name });
      if(isHotelExist){
        return next(createError(400, "This name has already been used. Try for another name."));
      }

      if(!files.photos){
        return next(createError(400, "Sorry, no image(s) are uploaded into the system."));
      }

      const photos = files.photos;
      const uploadedPhotos = [];
      for(const photo of photos){
        if(!photo.mimetype.startsWith('image')){
          return next(createError(400, "Sorry, only image files are allowed."));
        }

        const prevPath = photo.filepath;
        const originalFilename = photo.originalFilename;
        const newFilename = `${uuidv4()}${path.extname(originalFilename)}`;
        const newPath = path.join(__dirname, '../uploads/villas', newFilename);

        fs.renameSync(prevPath, newPath);
        const picturePath = `/uploads/villas/${newFilename}`;
        uploadedPhotos.push(picturePath);
      }

      const newHotel = new Hotel({
        name,
        type,
        city,
        address,
        distance,
        title,
        desc,
        cheapestPrice,
        photos: uploadedPhotos
      });
      const savedHotel = await newHotel.save();
      res.status(200).json(savedHotel);
    } catch(err){
      next(err);
    }
  })
}

export const updateHotelWithPhoto = async (req, res, next) => {
  const form = new Formidable();

  form.parse(req, async(err, fields, files) => {
    if(err){
      return next(createError(400, "Please fill in all of the required fields!"));
    }

    if(!req.user.isAdmin){
      return next(createError(400, "Sorry, your product has not been added, it is possible that you are not using an admin account."));
    }
    
    try {
      const hotelId = req.params.id;
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const type = Array.isArray(fields.type) ? fields.type[0] : fields.type;
      const city = Array.isArray(fields.city) ? fields.city[0] : fields.city;
      const address = Array.isArray(fields.address) ? fields.address[0] : fields.address;
      const distance = Array.isArray(fields.distance) ? fields.distance[0] : fields.distance;
      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const desc = Array.isArray(fields.desc) ? fields.desc[0] : fields.desc;
      const cheapestPrice = Number(fields.cheapestPrice);

      const hotel = await Hotel.findById(hotelId);
      if(!hotel){
        return next(createError(400, "Sorry, hotel is not found in the system"));
      }

      if(name && hotel.name !== name){
        const isHotelExists = await Hotel.findOne({ name });
        if(isHotelExists){
          return next(createError(400, "This name has already been used. Try for another name."));
        }
      }

      let dataChanges = {
        name: name || hotel.name,
        type: type || hotel.type,
        city: city || hotel.city,
        address: address || hotel.address,
        distance: distance || hotel.distance,
        title: title || hotel.title,
        desc: desc || hotel.desc,
        cheapestPrice: cheapestPrice || hotel.cheapestPrice
      };

      if(files.photos){
        const photos = files.photos;
        const uploadedPhotos = [];

        for(const photo of photos){
          if(!photo.mimetype.startsWith('image')){
            return next(createError(400, "Sorry, only image files are allowed."));
          }

          const prevPath = photo.filepath;
          const originalFilename = photo.originalFilename;
          const newFilename = `${uuidv4()}${path.extname(originalFilename)}`;
          const newPath = path.join(__dirname, '../uploads/villas', newFilename);

          fs.renameSync(prevPath, newPath);
          const picturePath = `/uploads/villas/${newFilename}`;
          uploadedPhotos.push(picturePath);
        }

        if(uploadedPhotos.length > 0){
          for(const oldPhoto of hotel.photos){
            const oldPhotoPath = path.join(__dirname, '../uploads/villas', path.basename(oldPhoto));
            if(fs.existsSync(oldPhotoPath)){
              fs.unlinkSync(oldPhotoPath);
            }
          }
          dataChanges.photos = uploadedPhotos;
        } else {
          dataChanges.photos = uploadedPhotos;
        }
      }
      const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, { $set: dataChanges }, { new: true });
      res.status(200).json(updatedHotel);
    } catch(err){
      next(err);
    }
  })
}

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
    case "type":
      sortOptions.type = -1;
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
    const mostViewedHotels = await Hotel.find().sort({ viewed: -1 }).limit(3);
    
    res.status(200).json(mostViewedHotels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRecentlyAdded = async (req, res) => {
  try {
    const lastAddedHotels = await Hotel.find().sort({ createdAt: -1 }).limit(3);
    
    res.status(200).json(lastAddedHotels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

