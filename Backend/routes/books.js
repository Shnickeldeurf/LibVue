const fs = require('fs');
const formidable = require('formidable');
var express = require('express');
var router = express.Router();

// GET all books
router.get('/list', (req, res) => {
    let sqlCmd = 'select * from books';
    conn.query(sqlCmd, (error, result) => {
        if (error)
            console.log(error);
        else {
            result.forEach(book => {
                const coverImage = Buffer.from(book.cover).toString('base64');
                book.image = coverImage;
            });
            res.json(result);
        }
    });
});

// POST book
router.post('/', (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) throw err;
        let formData = {
            title: fields.title,
            author: fields.author,
            genre: fields.genre,
            isBorrowed: fields.isBorrowed,
            cover: fs.readFileSync(files.cover[0].filepath)
        };
        let sqlCmd = 'INSERT INTO books SET ?';
        conn.query(sqlCmd, formData, (error, result) => {
            if (error) throw error;
            res.end();
        });
    });
});

// DELETE book
router.delete('/:id', (req, res) => {
    var id = req.params.id;
    var sqlCmd = `DELETE FROM books WHERE book_id = ?`;
    conn.query(sqlCmd, id, (error, result) => {
        if (error) throw error;
        res.end();
    });
});

// UPDATE book
router.put('/:id', (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) throw err;
        let formData = {
            title: fields.title,
            author: fields.author,
            genre: fields.genre,
            isBorrowed: fields.isBorrowed,
            cover: fs.readFileSync(files.cover[0].filepath)
        };
        let id = req.params.id;
        var sqlCmd = 'UPDATE books SET ? WHERE book_id = ?';
        conn.query(sqlCmd, [formData, id], (error, result) => {
            if (error)
                console.log(error);
            else
                res.end();
        });
    });
});

//Return book
router.put('/return/:id', (req, res) => {
    var id = req.params.id;
    var rdate = new Date();
    rdate = rdate.getFullYear().toString() + '-' + (rdate.getMonth() + 1).toString().padStart(2, 0) +
    '-' + rdate.getDate().toString().padStart(2, 0);

    var sqlCmd = 'UPDATE loans SET returnDate = ? WHERE book_id = ? AND returnDate > ?';
    conn.query(sqlCmd, [rdate, id, rdate], (error, result) => {
        if (error)
            console.log(error);
        else
            console.log(result);
    });

    var sqlCmd2 = `UPDATE books SET isBorrowed = 0 WHERE book_id = ?`;
    conn.query(sqlCmd2, id, (error, result) => {
        if (error)
            console.log(error);
        else
            res.end();
    });
});

module.exports = router;