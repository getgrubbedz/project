const express = require('express');
const path = require('path');
const multer = require('multer');
const Pet = require('../models/Pet');

const router = express.Router();
const upload = multer({
  dest: path.join(__dirname, '../public/images')
});


router.get('/pets', async (req, res, next) => {
  const pets = await Pet.findAll({raw: true});
  res.render('pets/petList', { title: 'Our Pets', pets: pets, auth: req.auth });
});

router.get('/pets/manage', async(req, res, next) => {
  if (req.user) {
    const pets = await Pet.findAll({raw: true});
    res.render('pets/managePets', { title: 'Pet Management', pets: pets, auth: req.auth});
  } else {
    res.redirect('/pets');
  }
})

router.get('/pets/new', (req, res, next) => {
  if (req.user) {
    if (req.auth.petmgmt) {
      res.render('pets/newPet', {title: 'New Pet', auth: req.auth});
    } else {
      res.status(401).send('Not Authorized');
    }
  } else {
    res.redirect('/pets');
  }
});

router.post('/pets/new', upload.single("img"), async (req, res, next) => {
  if (req.user) {
    if (req.auth.petmgmt) {
      const { name, type, breed, age } = req.body;
      const filename = (req.file) ? req.file.filename: null;
      const pet = await Pet.create({
        name: name,
        type: type,
        breed: breed,
        age: age,
        img: filename,
      });
      res.redirect('/pets');
    } else {
      res.status(401).send('Not Authorized');
    }
  } else {
    res.redirect('/pets');
  }
});

router.get('/pets/:id', async (req, res, next) => {
  const id = req.params.id;
  const pet = await Pet.findOne({ where: { id: req.params.id }, raw: true});
  res.render('pets/petDetails', { title: pet.name, pet: pet, auth: req.auth });
});

router.post('/pets/:id', upload.single("img"), async (req, res, next) => {
  const id = req.params.id;
  if (req.user) {
    if (req.auth.petmgmt) {
      const { name, type, breed, age } = req.body;
      const pet = await Pet.findOne({ where: { id: req.params.id } });
      const filename = (req.file) ? req.file.filename: pet.img;
      console.log(filename);
      pet.set({
        name: name,
        type: type,
        breed: breed,
        age: age,
        img: filename,
      });
      await pet.save();
      res.redirect(`/pets/${id}`);
    } else {
      res.status(401).send('Not Authorized');
    }
  } else {
    res.redirect(`/pets/${id}`);
  }
});

router.get('/pets/:id/edit', async (req, res, next) => {
  const id = req.params.id;
  if (req.user) {
    if (req.auth.petmgmt) {
      const pet = await Pet.findOne({ where: { id: req.params.id }, raw: true});
      res.render('pets/updatePet', { title: `Update ${pet.name}`, pet: pet, auth: req.auth });
    } else {
      res.status(401).send('Not Authorized');
    }
  } else {
    res.redirect(`/pets/${id}`);
  }
});

router.get('/pets/:id/delete', async (req, res, next) => {
  const id = req.params.id;
  if (req.user) {
    if (req.auth.petmgmt) {
      const pet = await Pet.findOne({ where: { id: req.params.id } });
      await pet.destroy();
      res.redirect('/pets/manage');
    } else {
      res.status(401).send('Not Authorized');
    }
  } else {
    res.redirect(`/pets/${id}`);
  }
});

module.exports = router;