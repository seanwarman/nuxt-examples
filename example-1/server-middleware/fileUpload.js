const express = require("express");
const fileUpload = require("express-fileupload");
const axios = require("axios");
const app = express();

app.use(
  fileUpload({
    safeFileNames: true, // can use custom regex function in place of boolean
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  })
);

app.post("/fileUpload", function (req, res) {
  const BlobMasterCode =
    process.env.BLOB_MASTERCODE ||
    "iKCqnEn9fjHj8bs970dRiT8FUAAcgC46/idCBbhdKANkJx9rYBaHdA==";

  console.log(BlobMasterCode);
  const url =
    process.env.BLOB_URL ||
    "https://funcapp-devdbw-docstorage.azurewebsites.net/api/UploadToBLOB";
  console.log(url);

  const allowedFileTypes = [
    "image/jpeg", // .jpg or .jpeg
    "image/bmp", // .bpm
    "image/png", // .png
    "text/csv", // .csv
    "text/plain", // .txt
    "application/pdf", // .pdf
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  ];

  function handleFileErrors(file) {
    if (!allowedFileTypes.includes(file.mimetype)) {
      res.send("file-type-error");
    } else if (file.truncated) {
      res.send("file-size-error");
    }
  }

  const options = {
    params: {
      code: BlobMasterCode,
      email: req.headers.email,
      filename: req.files.file.name,
    },
    headers: {
      Authorization: req.headers.authorization,
      ServiceName: req.headers.servicename,
      ApplicationReference: req.headers.applicationreference,
      DocumentType: req.headers.documenttype,
    },
  };

  if (req.headers.singlefile === "true") {
    const file = req.files.file;
    handleFileErrors(file);
    axios
      .post(url, file.data, options)
      .then(() => {
        res.statusCode = 200;
        res.send("success");
      })
      .catch((e) => {
        res.statusCode = 500;
        res.send(e.message);
      });
  } else {
    const filesArray = Object.values(req.files)[0];
    filesArray.forEach((file) => handleFileErrors(file));
    let fileUploadError = false;
    filesArray.forEach((file) => {
      options.params.filename = file.name;
      axios.post(url, file.data, options).catch(() => {
        res.statusCode = 500;
        fileUploadError = true;
      });
    });
    if (!fileUploadError) {
      res.statusCode = 200;
      res.send("success");
    }
  }
});

module.exports = app;
