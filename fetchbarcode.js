const express = require('express');
const mongoose  = require('mongoose');

const app = express();
const port = 5500;


mongoose.connect("mongodb://localhost:27017", {
  dbName: "IMS"
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Connection error", err);
});

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    category: String,
    price: Number,
    barcode_number: String
  });
  
  const Book = mongoose.model('Book', bookSchema);
  

  const newBook = new Book({
    title: 'Your Book Title',
    author: 'Author Name',
    category: 'Category Name',
    price: 100,
    barcode_number: '8902242718243'
  });
  
  newBook.save().then(() => console.log('Book saved')).catch(err => console.error(err));
  


  Book.find().then(books => {
    console.log(books);
  }).catch(err => console.error(err));
  


// Route to fetch all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).send('Error fetching books');
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});




app.use(express.json());

app.get('/api/product/:barcode', async (req, res) => {
  try {
    const product = await Product.findOne({ barcode_number: req.params.barcode });
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
