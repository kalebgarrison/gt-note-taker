const express = require("express");
const path = require("path");
const fs = require("fs");


const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// View routes
// Use GET method here
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});
// API routes
app.get("/api/notes", (req, res) => {
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) {
      return res.send("An error occurred reading your data.");
    }
    const arrayOfNotes = JSON.parse(data);
    res.json(arrayOfNotes);
  });
});

app.post("/api/notes", (req, res) => {
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) {
      return res.send("An error occurred reading your data.");
    }
    const arrayOfNotes = JSON.parse(data);
    const newNote = {...req.body, id: arrayOfNotes.length + 1};
    arrayOfNotes.push(newNote);
    fs.writeFile("db/db.json", JSON.stringify(arrayOfNotes), "utf8", (err) => {
        if (err){
            return res.send("An error occurred writing your data.");
        }
        res.json(arrayOfNotes);
    })
  }); 
});

// API Delete Method
app.delete("/api/notes/:id", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        return res.send("An error occurred reading your data.");
      }
      const arrayOfNotes = JSON.parse(data);
      const noteDb = arrayOfNotes.filter((note) => note.id != req.params.id);
      fs.writeFile("./db/db.json", JSON.stringify(noteDb), "utf8", (err) => {
        if (err) {
          return res.send("An error occurred writing your data.");
        }
        res.json(noteDb);
      });
    });
  });



app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
  });

app.listen(PORT, (req, res) => {
  console.log(`Currently running on http://localhost:${PORT}`);
}); 