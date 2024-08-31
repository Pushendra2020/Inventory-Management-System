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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
