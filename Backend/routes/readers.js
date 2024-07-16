var express = require('express');
var router = express.Router();

// GET all readers
router.get('/list', (req, res) => {
    let sqlCmd = 'select * from readers';
    conn.query(sqlCmd, (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});

// POST reader
router.post('/', (req, res) => {
    const form = req.body;
    let sqlCmd = 'INSERT INTO readers SET ?';
    conn.query(sqlCmd, form, (error, result) => {
        if (error) throw error;
        res.end();
    });
});

// DELETE reader
router.delete('/:id', (req, res) => {
    var id = req.params.id;
    var sqlCmd = `DELETE FROM readers WHERE reader_id = ?`;
    conn.query(sqlCmd, id, (error, result) => {
        if (error) throw error;
        res.end();
    });
});

// UPDATE reader
router.put('/:id', (req, res) => {
    const form = req.body;
    var id = req.params.id;
    var sqlCmd = 'UPDATE readers SET ? WHERE reader_id = ?';
    conn.query(sqlCmd, [form, id], (error, result) => {
        if (error) throw error;
        res.end();
    });
});

module.exports = router;