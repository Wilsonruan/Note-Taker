// Sets up the Express app and Node.js
var express = require("express");
var path = require("path");
var app = express();
var PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const fs = require("fs")

// GET /notes - Should return the notes.html file.
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});


// GET /api/notes - Should read the db.json file and return all saved notes as JSON.
app.get("/api/notes", function (req, res) {
    return res.sendFile(path.join(__dirname, "db/db.json"));
});


// GET * - Should return the index.html file
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Add notes
app.post("/api/notes", function (req, res) {
    console.log(req.body)
    var newNote = req.body;
    console.log(newNote);
    fs.readFile(path.join(__dirname, "db/db.json"), (err, data) => {
        if (err) throw err;
        console.log(data);
        let notes = JSON.parse(data)
        notes.push(newNote);
        console.log(notes)
        fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notes), function (err) {
            if (err) throw err;
        })
    });

    res.json(newNote);
});

// Delete notes
app.delete("/api/notes/:id", function (req, res) {
    let chosen = req.params.id;
    console.log(chosen);
    let filepath = path.join(__dirname, "db/db.json")
    console.log(filepath);
    fs.readFile(filepath, "utf8", (err, data) => {
        if (err) throw err;
        console.log(data);
        let notes = JSON.parse(data)
        for (let index = 0; index < notes.length; index++) {
            if (notes[index].id === chosen) {
                notes.splice(index, 1);
                console.log(notes);
                fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notes), function (err) {
                    if (err) throw err;
                    return res.end();
                });
            }
        }
    })
});

// Inits the server
app.listen(PORT, function () {
    console.log(`App listening on PORT ${PORT}`);
});