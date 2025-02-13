const express = require("express")
const router = express.Router()
const Song = require("../models/Song")

// Obtener todas las canciones
router.get("/", async (req, res) => {
  try {
    const songs = await Song.find()
    res.json(songs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Obtener una canción por ID
router.get("/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate("artists")
    if (!song) {
      return res.status(404).json({ message: "Canción no encontrada" })
    }
    res.json(song)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Buscar canciones
router.get("/search/:query", async (req, res) => {
  try {
    const songs = await Song.find({ $text: { $search: req.params.query } })
    res.json(songs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
