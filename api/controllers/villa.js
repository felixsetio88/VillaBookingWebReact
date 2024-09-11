import Villa from "../models/Villa.js";
import Room from "../models/Room.js";
import { createError } from "../utils/error.js";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { Formidable } from "formidable";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createVillaWithPhoto = async (req, res, next) => {
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

      const isVillaExist = await Villa.findOne({ name });
      if(isVillaExist){
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

      const newVilla = new Villa({
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
      const savedVilla = await newVilla.save();
      res.status(200).json(savedVilla);
    } catch(err){
      next(err);
    }
  })
}

export const updateVillaWithPhoto = async (req, res, next) => {
  const form = new Formidable();

  form.parse(req, async(err, fields, files) => {
    if(err){
      return next(createError(400, "Please fill in all of the required fields!"));
    }

    if(!req.user.isAdmin){
      return next(createError(400, "Sorry, your product has not been added, it is possible that you are not using an admin account."));
    }
    
    try {
      const villaId = req.params.id;
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const type = Array.isArray(fields.type) ? fields.type[0] : fields.type;
      const city = Array.isArray(fields.city) ? fields.city[0] : fields.city;
      const address = Array.isArray(fields.address) ? fields.address[0] : fields.address;
      const distance = Array.isArray(fields.distance) ? fields.distance[0] : fields.distance;
      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const desc = Array.isArray(fields.desc) ? fields.desc[0] : fields.desc;
      const cheapestPrice = Number(fields.cheapestPrice);

      const villa = await Villa.findById(villaId);
      if(!villa){
        return next(createError(400, "Sorry, villa is not found in the system"));
      }

      if(name && villa.name !== name){
        const isVillaExists = await Villa.findOne({ name });
        if(isVillaExists){
          return next(createError(400, "This name has already been used. Try for another name."));
        }
      }

      let dataChanges = {
        name: name || villa.name,
        type: type || villa.type,
        city: city || villa.city,
        address: address || villa.address,
        distance: distance || villa.distance,
        title: title || villa.title,
        desc: desc || villa.desc,
        cheapestPrice: cheapestPrice || villa.cheapestPrice
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
          for(const oldPhoto of villa.photos){
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
      const updatedVilla = await Villa.findByIdAndUpdate(villaId, { $set: dataChanges }, { new: true });
      res.status(200).json(updatedVilla);
    } catch(err){
      next(err);
    }
  })
}

export const createVilla = async (req, res, next) => {
  const newVilla = new Villa(req.body);

  try {
    if (req.user.isAdmin){
      const savedVilla = await newVilla.save();
      res.status(200).json(savedVilla);
    } else {
      alert("You are not admin!")
    }
  } catch (err) {
    next(err);
  }
};

export const updateVilla = async (req, res, next) => {
  try {
    const updatedVilla = await Villa.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedVilla);
  } catch (err) {
    next(err);
  }
};

export const deleteVilla = async (req, res, next) => {
  try {
    await Villa.findByIdAndDelete(req.params.id);
    res.status(200).json("Villa has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getVilla = async (req, res, next) => {
  try {
    const villa = await Villa.findById(req.params.id);
    res.status(200).json(villa);
  } catch (err) {
    next(err);
  }
};

export const getVillas = async (req, res, next) => {
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
    const villas = await Villa.find({
      ...others,
      cheapestPrice: { $gt: min || 1, $lt: max || 999 },
    })
      .sort(sortOptions) // Apply sorting
      .limit(req.query.limit);

    res.status(200).json(villas);
  } catch (err) {
    next(err);
  }
};

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Villa.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Villa.countDocuments({ type: "Hotel" });
    const apartmentCount = await Villa.countDocuments({ type: "Apartment" });
    const resortCount = await Villa.countDocuments({ type: "Resort" });
    const villaCount = await Villa.countDocuments({ type: "Villa" });
    const cabinCount = await Villa.countDocuments({ type: "Cabin" });

    res.status(200).json([
      { type: "Hotel", count: hotelCount },
      { type: "Apartments", count: apartmentCount },
      { type: "Resorts", count: resortCount },
      { type: "Villas", count: villaCount },
      { type: "Cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getVillaRooms = async (req, res, next) => {
  try {
    const villa = await Villa.findById(req.params.id);
    const list = await Promise.all(
      villa.rooms.map((room) => {
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
    const updatedVilla = await Villa.findByIdAndUpdate(id, { sold }, { new: true });
    res.status(200).json(updatedVilla);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const updateViews = async (req, res) => {
  const {id} = req.params;
  const {viewed} = req.body;
  try {
    const updatedVilla = await Villa.findByIdAndUpdate(id, { viewed }, { new: true });
    res.status(200).json(updatedVilla);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getMostViewed = async (req, res) => {
  try {
    const mostViewedVillas = await Villa.find().sort({ viewed: -1 }).limit(3);
    
    res.status(200).json(mostViewedVillas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRecentlyAdded = async (req, res) => {
  try {
    const lastAddedVillas = await Villa.find().sort({ createdAt: -1 }).limit(3);
    res.status(200).json(lastAddedVillas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

