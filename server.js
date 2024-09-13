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

// Route for scanning products
app.post('/scan', (req, res) => {
    const code = req.body.code;
    const query = 'SELECT id, pname, ptype, price, qunti FROM product WHERE id = ?';
    db.query(query, [code], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length > 0) {
            const product = results[0];
            res.json({
                id: product.id,
                pname: product.pname,
                ptype: product.ptype,
                price: product.price,
                qunti: product.qunti
            });
        } else {
            res.status(404).send('No results found for the scanned code.');
        }
    });
});

// Fetch product by code (GET request)
app.get('/product', (req, res) => {
    const code = req.query.code;
    const sql = 'SELECT id, pname, ptype, price, qunti FROM product WHERE id = ?';
    db.query(sql, [code], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    });
});

// Fetch store product by id (GET request)
app.get('/storeproduct/:id', (req, res) => {
    const code = req.params.id;
    const sql = 'SELECT id, pname, ptype, price, qunti FROM storeproduct WHERE id = ?';
    db.query(sql, [code], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    });
});

// Fetch all store products (GET request)
app.get('/storeproduct', (req, res) => {
    const sql = 'SELECT * FROM storeproduct';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ success: false, message: 'Failed to fetch products' });
        } else {
            res.json(results);
        }
    });
});

// Fetch all sold products (GET request)
app.get('/sellproduct', (req, res) => {
    const sql = 'SELECT * FROM sellproduct';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ success: false, message: 'Failed to fetch products' });
        } else {
            res.json(results);
        }
    });
});

// Add or update store product (POST request)
app.post('/storeproduct', (req, res) => {
    const { id, pname, ptype, price, qunti } = req.body;

    const selectQuery = 'SELECT qunti FROM storeproduct WHERE id = ?';
    db.query(selectQuery, [id], (err, results) => {
        if (err) {
            console.error('Error selecting data:', err);
            return res.status(500).json({ success: false, message: 'Failed to check product' });
        }

        if (results.length > 0) {
            const currentQuantity = results[0].qunti;
            const updatedQuantity = currentQuantity + 1;

            const updateQuery = 'UPDATE storeproduct SET qunti = ? WHERE id = ?';
            db.query(updateQuery, [updatedQuantity, id], (err) => {
                if (err) {
                    console.error('Error updating quantity:', err);
                    return res.status(500).json({ success: false, message: 'Failed to update product quantity' });
                }

                return res.json({ success: true, message: 'Product quantity updated successfully!' });
            });
        } else {
            const insertQuery = 'INSERT INTO storeproduct (id, pname, ptype, price, qunti) VALUES (?, ?, ?, ?, ?)';
            db.query(insertQuery, [id, pname, ptype, price, 1], (err) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    return res.status(500).json({ success: false, message: 'Failed to save product' });
                }

                return res.json({ success: true, message: 'Product saved successfully with quantity 1!' });
            });
        }
    });
});

// Sell a product (POST request)
app.post('/sellproduct', (req, res) => {
    const { id } = req.body;

    const selectQuery = 'SELECT * FROM storeproduct WHERE id = ?';
    db.query(selectQuery, [id], (err, results) => {
        if (err) {
            console.error('Error selecting data:', err);
            return res.status(500).json({ success: false, message: 'Failed to find product' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found in storeproduct' });
        }

        const product = results[0];
        const updatedQuantity = product.qunti - 1;

        if (updatedQuantity > 0) {
            const updateQuery = 'UPDATE storeproduct SET qunti = ? WHERE id = ?';
            db.query(updateQuery, [updatedQuantity, id], (err) => {
                if (err) {
                    console.error('Error updating quantity:', err);
                    return res.status(500).json({ success: false, message: 'Failed to update product quantity' });
                }

                moveToSellProduct(product, db, (err) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: 'Failed to move product to sellproduct' });
                    }

                    return res.json({ success: true, message: 'Product sold successfully!' });
                });
            });
        } else {
            const deleteQuery = 'DELETE FROM storeproduct WHERE id = ?';
            db.beginTransaction((err) => {
                if (err) {
                    console.error('Error starting transaction:', err);
                    return res.status(500).json({ success: false, message: 'Transaction error' });
                }

                db.query(deleteQuery, [id], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error deleting product:', err);
                            res.status(500).json({ success: false, message: 'Failed to delete product' });
                        });
                    }

                    moveToSellProduct(product, db, (err) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: 'Failed to move product to sellproduct' });
                        }

                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error('Error committing transaction:', err);
                                    res.status(500).json({ success: false, message: 'Transaction commit failed' });
                                });
                            }

                            return res.json({ success: true, message: 'Product sold successfully!' });
                        });
                    });
                });
            });
        }
    });
});

// Function to move product to sellproduct table
function moveToSellProduct(product, connection, callback) {
    const checkSellProductQuery = "SELECT * FROM sellproduct WHERE id = ?";
    connection.query(checkSellProductQuery, [product.id], (err, result) => {
        if (err) return callback(err);

        if (result.length > 0) {
            const updateSellProductQuery = "UPDATE sellproduct SET qunti = qunti + 1 WHERE id = ?";
            connection.query(updateSellProductQuery, [product.id], (err) => {
                if (err) return callback(err);
                return callback(null);
            });
        } else {
            const insertSellProductQuery = "INSERT INTO sellproduct (id, pname, ptype, price, qunti) VALUES (?, ?, ?, ?, ?)";
            connection.query(insertSellProductQuery, [product.id, product.pname, product.ptype, product.price, 1], (err) => {
                if (err) return callback(err);
                return callback(null);
            });
        }
    });
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



