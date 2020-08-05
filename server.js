// Sets up the Express app and Node.js
var express = require("express");
var path = require("path");
var app = express();
var PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const fs = require("fs")

// GET `/notes` 
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});


// Displays all notes
app.get("/api/notes", function (req, res) {
    return res.sendFile(path.join(__dirname, "db/db.json"));
});


// Return the `index.html` file
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Add a note
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

// Deletes note
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
                let del_note = "Deleted: " + notes[index];
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