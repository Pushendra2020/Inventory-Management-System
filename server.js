const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const port = 5501;

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



app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
      
        const hashedPassword = await bcrypt.hash(password, 10);

      
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) throw err;

          
            const userId = result.insertId; 
            const storeTableName = `${username}_storeproduct`;
            const sellTableName = `${username}_sellproduct`;

            const createStoreTableQuery = `
                CREATE TABLE IF NOT EXISTS ${storeTableName} (
                    id bigint,
                    pname VARCHAR(255),
                    ptype VARCHAR(255),
                    price DECIMAL(10, 2),
                    qunti INT
                )
            `;
            const createSellTableQuery = `
                CREATE TABLE IF NOT EXISTS ${sellTableName} (
                    id bigint ,
                    pname VARCHAR(255),
                    ptype VARCHAR(255),
                    price DECIMAL(10, 2),
                    qunti INT
                )
            `;

            db.query(createStoreTableQuery, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error creating store product table' });
                }

                db.query(createSellTableQuery, (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error creating sell product table' });
                    }

                    res.send('User registered and tables created successfully!');
                });
            });
        });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        return res.json({ success: true, username: user.name, redirectUrl: '/inventory.html' });
    });
});

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


app.get('/users', (req, res) => {
    const code = req.query.username;
    const sql = 'SELECT name,id FROM users = ?,?';
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


app.get('/storeproduct', (req, res) => {
    const username = req.query.username;
    const sql = `SELECT * FROM  ${username}_storeproduct`;
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
    const username =  req.query.username;
    const sql = `SELECT * FROM  ${username}_sellproduct`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ success: false, message: 'Failed to fetch products' });
        } else {
            res.json(results);
        }
    });
});

app.post('/storeproduct', (req, res) => {
    const { username, id, pname, ptype, price, qunti } = req.body;  
    const tableName = `${username}_storeproduct`;  

    const selectQuery = `SELECT qunti FROM ${tableName} WHERE id = ?`;
    db.query(selectQuery, [id], (err, results) => {
        if (err) {
            console.error('Error selecting data:', err);
            return res.status(500).json({ success: false, message: 'Failed to check product' });
        }

        if (results.length > 0) {
            const currentQuantity = results[0].qunti;
            const updatedQuantity = currentQuantity + 1;

            const updateQuery = `UPDATE ${tableName} SET qunti = ? WHERE id = ?`;
            db.query(updateQuery, [updatedQuantity, id], (err) => {
                if (err) {
                    console.error('Error updating quantity:', err);
                    return res.status(500).json({ success: false, message: 'Failed to update product quantity' });
                }

                return res.json({ success: true, message: 'Product quantity updated successfully!' });
            });
        } else {
            const insertQuery = `INSERT INTO ${tableName} (id, pname, ptype, price, qunti) VALUES (?, ?, ?, ?, ?)`;
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

app.post('/sellproduct', (req, res) => {
    const { username, id } = req.body;  
    const storeTableName = `${username}_storeproduct`;
    const sellTableName = `${username}_sellproduct`;

    const selectQuery = `SELECT * FROM ${storeTableName} WHERE id = ?`;
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
            const updateQuery = `UPDATE ${storeTableName} SET qunti = ? WHERE id = ?`;
            db.query(updateQuery, [updatedQuantity, id], (err) => {
                if (err) {
                    console.error('Error updating quantity:', err);
                    return res.status(500).json({ success: false, message: 'Failed to update product quantity' });
                }

                moveToSellProduct(product, sellTableName, (err) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: 'Failed to move product to sellproduct' });
                    }

                    return res.json({ success: true, message: 'Product sold successfully!' });
                });
            });
        } else {
            const deleteQuery = `DELETE FROM ${storeTableName} WHERE id = ?`;
            db.query(deleteQuery, [id], (err) => {
                if (err) {
                    console.error('Error deleting product:', err);
                    return res.status(500).json({ success: false, message: 'Failed to delete product' });
                }

                moveToSellProduct(product, sellTableName, (err) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: 'Failed to move product to sellproduct' });
                    }

                    return res.json({ success: true, message: 'Product sold successfully!' });
                });
            });
        }
    });
});

function moveToSellProduct(product, tableName, callback) {
    const checkSellProductQuery = `SELECT * FROM ${tableName} WHERE id = ?`;
    db.query(checkSellProductQuery, [product.id], (err, result) => {
        if (err) return callback(err);

        if (result.length > 0) {
            const updateSellProductQuery = `UPDATE ${tableName} SET qunti = qunti + 1 WHERE id = ?`;
            db.query(updateSellProductQuery, [product.id], (err) => {
                if (err) return callback(err);
                return callback(null);
            });
        } else {
            const insertSellProductQuery = `INSERT INTO ${tableName} (id, pname, ptype, price, qunti) VALUES (?, ?, ?, ?, ?)`;
            db.query(insertSellProductQuery, [product.id, product.pname, product.ptype, product.price, 1], (err) => {
                if (err) return callback(err);
                return callback(null);
            });
        }
    });
}

app.get('/user', (req, res) => {
    const { name } = req.query;
    let sql = 'SELECT * FROM storeproduct WHERE pname LIKE ?';
    db.query(sql, [`%${name}%`], (err, results) => {
      if (err) {
        throw err;
      }
      res.json(results);
    });
  });


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
