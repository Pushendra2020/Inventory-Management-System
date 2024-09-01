

const { MongoClient } = require('mongodb');

// Replace the URI string with your MongoDB deployment's connection string.
const uri = "mongodb://localhost:27017"; // Update with your MongoDB URI

async function insertProduct(product) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db("IMS");
    const collection = db.collection("Books");

    const result = await collection.insertOne(product);
    console.log(`Product inserted with _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

// Example product to insert
const exampleProduct = {
  barcode_number: "8902242718243",
  Name: "Sundaram A4 Book 1",
  Description: "A4 size notebook with 172 pages.",
  Price: 7500,
  Category: "A4 book",
  Manufacturer: "SUNDARAM MULTI PAP LIMITED",
  Pages: 1721,
  Code: "C321"
};

// Run the function
insertProduct(exampleProduct).catch(console.error);





