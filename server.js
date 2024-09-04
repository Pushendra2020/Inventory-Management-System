const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const port = 5500;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('client'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'new_schema'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});


app.post('/scan', (req, res) => {
    const code = req.body.code;

    const query = 'SELECT id, pname, ptype, price FROM product WHERE id = ?';
    db.query(query, [code], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length > 0) {
            // product mil ne ke bath 
            const product = results[0];
            res.json({
                id: product.id,
                pname: product.pname,
                ptype: product.ptype,
                price: product.price
            });
        } else {
            // agar nahi mila tho
            res.status(404).send('No results found for the scanned code.');
        }
    });
});


app.get('/product', (req, res) => {
    const code = req.query.code; // Expecting a query parameter
    const sql = 'SELECT id, pname, ptype, price FROM product WHERE id = ?';
    db.query(sql, [code], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length > 0) {
            res.json(results[0]); // Send the first result as JSON
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    });
});


app.get('/storeproduct/:id', (req, res) => {
    const code = req.query.code; // Expecting a query parameter
    const sql = 'SELECT id, pname, ptype, price FROM storeproduct WHERE id = ?';
    db.query(sql, [code], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length > 0) {
            res.json(results[0]); // Send the first result as JSON
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    });
});



app.post('/storeproduct', (req, res) => {
    const {id, pname, ptype, price } = req.body;
    const sql = 'INSERT INTO storeproduct (id,pname, ptype, price) VALUES (?,?, ?, ?)';

    db.query(sql, [id,pname, ptype, price], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ success: false, message: 'Failed to save product' });
        } else {
            res.json({ success: true, message: 'Product saved successfully!', id: result.insertId });
        }
    });
});


app.post('/sellproduct', (req, res) => {
    const {id, pname, ptype, price } = req.body;
    const sql = 'INSERT INTO sellproduct (id,pname, ptype, price) VALUES (?,?, ?, ?)';

    db.query(sql, [id,pname, ptype, price], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ success: false, message: 'Failed to save product' });
        } else {
            res.json({ success: true, message: 'Product saved successfully!', id: result.insertId });
        }
    });
});



app.get('/storeproduct', (req, res) => {
    const sql = 'SELECT * FROM storeproduct';
console.log("work");
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ success: false, message: 'Failed to fetch products' });
        } else {
            res.json(results);
        }
    });
});


app.get('/sellproduct', (req, res) => {
    const sql = 'SELECT * FROM sellproduct';
console.log("work23");
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ success: false, message: 'Failed to fetch products' });
        } else {
            res.json(results);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});



