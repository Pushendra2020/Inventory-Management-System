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
    const { id } = req.body;
    
    // Check if the product exists in storeproduct
    const selectQuery = 'SELECT * FROM storeproduct WHERE id = ?';
    db.query(selectQuery, [id], (err, results) => {
        if (err) {
            console.error('Error selecting data:', err);
            return res.status(500).json({ success: false, message: 'Failed to find product' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found in storeproduct' });
        }

        // If product exists, remove it from storeproduct and insert into sellproduct
        const product = results[0];
        const deleteQuery = 'DELETE FROM storeproduct WHERE id = ?';
        const insertQuery = 'INSERT INTO sellproduct (id, pname, ptype, price) VALUES (?, ?, ?, ?)';

        db.beginTransaction((err) => {
            if (err) {
                console.error('Error starting transaction:', err);
                return res.status(500).json({ success: false, message: 'Transaction error' });
            }

            db.query(deleteQuery, [id], (err, deleteResult) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Error deleting data:', err);
                        res.status(500).json({ success: false, message: 'Failed to delete product' });
                    });
                }

                db.query(insertQuery, [product.id, product.pname, product.ptype, product.price], (err, insertResult) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error inserting data:', err);
                            res.status(500).json({ success: false, message: 'Failed to save product' });
                        });
                    }

                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error('Error committing transaction:', err);
                                res.status(500).json({ success: false, message: 'Transaction commit error' });
                            });
                        }
                        res.json({ success: true, message: 'Product moved to sellproduct successfully!' });
                    });
                });
            });
        });
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



