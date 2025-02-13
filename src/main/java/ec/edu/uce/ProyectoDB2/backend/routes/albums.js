const express = require("express")
const router = express.Router()
const Album = require("../models/Album")

// Obtener todos los álbumes
router.get("/", async (req, res) => {
  try {
    const albums = await Album.find()
    res.json(albums)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Obtener un álbum por ID
router.get("/:id", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate("songs")
    if (!album) {
      return res.status(404).json({ message: "Álbum no encontrado" })
    }
    res.json(album)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Buscar álbumes
router.get("/search/:query", async (req, res) => {
  try {
    const albums = await Album.find({ $text: { $search: req.params.query } })
    res.json(albums)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router

