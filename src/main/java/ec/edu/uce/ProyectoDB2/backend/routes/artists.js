const express = require("express")
const router = express.Router()
const Artist = require("../models/Artist")

// Obtener todos los artistas
router.get("/", async (req, res) => {
  try {
    const artists = await Artist.find()
    res.json(artists)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Obtener un artista por ID
router.get("/:id", async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id).populate("albums")
    if (!artist) {
      return res.status(404).json({ message: "Artista no encontrado" })
    }
    res.json(artist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Buscar artistas
router.get("/search/:query", async (req, res) => {
  try {
    const artists = await Artist.find({ $text: { $search: req.params.query } })
    res.json(artists)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
