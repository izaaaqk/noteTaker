const express = require("express");
const path = require("path");
const fs = require("fs");

const server = express();

const PORT = process.env.PORT || 3000;

let noteData = [];

server.use(express.json());
server.use(
    express.urlencoded({
        extended: true,
    })
);
server.use(express.static(path.join(__dirname, "public")));

server.get("/api/notes", function (err, res) {
    try {
        noteData = fs.readFileSync("db/db.json", "utf8");
        console.log("Hello from the SERVER!");
        noteData = JSON.parse(noteData);
    } catch (err) {
        console.log("\n error (catch err app.get):");
        console.log(err);
    }
    res.json(noteData);
});

server.post("/api/notes", function (req, res) {
    try {
        noteData = fs.readFileSync("./db/db.json", "utf8");
        console.log(noteData);
        noteData = JSON.parse(noteData);
        req.body.id = noteData.length;
        noteData.push(req.body);
        noteData = JSON.stringify(noteData);
        fs.writeFile("./db/db.json", noteData, "utf8", function (err) {
            if (err) throw err;
        });

        res.json(JSON.parse(noteData));
    } catch (err) {
        throw err;
        console.error(err);
    }
});

server.delete("/api/notes/:id", function (req, res) {
    try {
        noteData = fs.readFileSync("./db/db.json", "utf8");
        noteData = JSON.parse(noteData);
        noteData = noteData.filter(function (note) {
            return note.id != req.params.id;
        });
        noteData = JSON.stringify(noteData);

        fs.writeFile("./db/db.json", noteData, "utf8", function (err) {
            if (err) throw err;
        });

        res.send(JSON.parse(noteData));
    } catch (err) {
        throw err;
        console.log(err);
    }
});


server.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

server.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

server.get("/api/notes", function (req, res) {
    return res.sendFile(path.json(__dirname, "db/db.json"));
});

server.listen(PORT, function () {
    console.log("SERVER IS LISTENING: " + PORT);
});