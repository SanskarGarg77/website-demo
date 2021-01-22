const express = require("express");
const multer = require("multer");


const Lecture = require("../models/lecture");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.get("", (req, res, next) => {
  // Post.find().then(documents => {
  //   res.status(200).json({
  //     message: "Posts fetched successfully!",
  //     posts: documents
  //   });
  // });

  res.status(200).json({
    message: "Posts fetched successfully!",
  });
});

router.post(
  "" ,
   multer({ storage: storage }).single("imagePath"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const lecture = new Lecture({
      name: req.body.name,
      profession: req.body.profession,
      lectureTitle: req.body.lectureTitle,
      date: {
        "year": req.body.year,
        "month": req.body.month,
        "day": req.body.day,

      },
      regLink: req.body.regLink,
      status: req.body.status,
      imagePath: url + "/images/" + req.file.filename
    });

      b = req.body
      lecture.save().then(createdPost => {
        res.status(201).json({
          message: "Post added successfully",
          b
        });
      });

});





// router.put(
//   "/:id",
//   multer({ storage: storage }).single("image"),
//   (req, res, next) => {
//     let imagePath = req.body.imagePath;
//     if (req.file) {
//       const url = req.protocol + "://" + req.get("host");
//       imagePath = url + "/images/" + req.file.filename
//     }
//     const post = new Post({
//       _id: req.body.id,
//       title: req.body.title,
//       content: req.body.content,
//       imagePath: imagePath
//     });
//     console.log(post);
//     Post.updateOne({ _id: req.params.id }, post).then(result => {
//       res.status(200).json({ message: "Update successful!" });
//     });
//   }
// );



// router.get("/:id", (req, res, next) => {
//   Post.findById(req.params.id).then(post => {
//     if (post) {
//       res.status(200).json(post);
//     } else {
//       res.status(404).json({ message: "Post not found!" });
//     }
//   });
// });

// router.delete("/:id", (req, res, next) => {
//   Post.deleteOne({ _id: req.params.id }).then(result => {
//     console.log(result);
//     res.status(200).json({ message: "Post deleted!" });
//   });
// });

module.exports = router;
