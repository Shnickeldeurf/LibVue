var express = require('express');
var router = express.Router();

// checkReturnDate
const checkReturnDate = (loans) => {
    const today = new Date();
    let returned = [];
    let loaned = [];
    loans.forEach(loan => {
        let returnDate = new Date(loan.returnDate);
        if (returnDate <= today) {
            returned.push(loan.book_id);
        }
        else {
            loaned.push(loan.book_id);
        }
    });
    var set = new Set(loaned);
    var rtrns = returned.filter(x => !set.has(x));
    rtrns.forEach(id => {
        const sqlCmd = 'UPDATE books SET isBorrowed = 0 WHERE book_id = ?';
        conn.query(sqlCmd, id, (error, result) => {
            if (error) throw error;
        });
    })
}

// GET all loans
router.get('/list', (req, res) => {
    let sqlCmd = 'SELECT * FROM loans INNER JOIN readers ON loans.reader_id = readers.reader_id INNER JOIN books ON loans.book_id = books.book_id';
    conn.query(sqlCmd, (error, result) => {
        if (error) throw error;
        checkReturnDate(result);
        res.json(result);
    });
});

// GET books
router.get('/getbooks', (req, res) => {
    const sqlCmd = 'SELECT * FROM books';
    conn.query(sqlCmd, (error, result) => {
        if (error)
            console.log(error);
        else {
            res.json(result);
        }
    }); 
});

// POST loan
router.post('/', (req, res) => {
    const form = req.body;
    var bid = form.book_id;
    let sqlCmd = 'INSERT INTO loans SET ?';
    conn.query(sqlCmd, form, (error, result) => {
        if (error) throw error;
        res.end();
    });
    const sqlCmd2 = `UPDATE books SET isBorrowed = 1 WHERE book_id = ?`;
    conn.query(sqlCmd2, bid, (error, result) => {
        if (error)
            console.log(error);
        else
            res.end();
    });
});

// DELETE loan
router.delete('/:id&:bid', (req, res) => {
    var id = req.params.id;
    var sqlCmd = `DELETE FROM loans WHERE loan_id = ?`;
    conn.query(sqlCmd, id, (error, result) => {
        if (error) throw error;
        res.end();
    });
    const bid = req.params.bid;
    const sqlCmd2 = `UPDATE books SET isBorrowed = 0 WHERE book_id = ?`;
    conn.query(sqlCmd2, bid, (error, result) => {
        if (error)
            console.log(error);
        else
            res.end();
    });
});

// UPDATE loan
router.put('/:id&:bid', (req, res) => {
    const form = req.body;
    var id = req.params.id;
    var sqlCmd = 'UPDATE loans SET ? WHERE loan_id = ?';
    conn.query(sqlCmd, [form, id], (error, result) => {
        if (error) throw error;
        res.end();
    });
    const bid = req.params.bid;
    const sqlCmd2 = `UPDATE books SET isBorrowed = 0 WHERE book_id = ?`;
    conn.query(sqlCmd2, bid, (error, result) => {
        if (error)
            console.log(error);
        else
            res.end();
    });
    const sqlCmd3 = `UPDATE books SET isBorrowed = 1 WHERE book_id = ?`;
    conn.query(sqlCmd3, form.book_id, (error, result) => {
        if (error)
            console.log(error);
        else
            res.end();
    });
});

module.exports = router;