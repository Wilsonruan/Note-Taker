// Sets up the Express app and Node.js
var express = require("express");
var path = require("path");
var app = express();
var PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const fs = require("fs")

// GET /notes - Return the notes.html file.
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// GET * - Return the index.html file
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// GET /api/notes - Display notes from db.json file.
app.get("/api/notes", function (req, res) {
    return res.sendFile(path.join(__dirname, "db/db.json"));
});

// POST /api/notes - Retrieve new notes to save on the request body, add it to the db.json file
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

// DELETE /api/notes/:id - Receive a query parameter containing the id of a note to delete.
app.delete("/api/notes/:id", function (req, res) {
    let chosen = req.params.id;
    console.log(`ID query parameter: ${chosen}`);
    let filepath = path.join(__dirname, "db/db.json")
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
    console.log(`Server listening on PORT ${PORT}`);
});