import asyncHandler from 'express-async-handler'
import { QueryCommand, ScanCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";
import { dynamoClient } from "../config/db.js";
import { v4 as uuid } from "uuid";

const getBooksById = asyncHandler(async (req, res) => {
    const params = {
      TableName: "Books",
      KeyConditionExpression: "#attr = :value",
      ExpressionAttributeNames: {
        "#attr": "_id",
      },
      ExpressionAttributeValues: {
        ":value": { S: req.params.id },
      },
    };
  
    try {
      const data = await dynamoClient.send(new QueryCommand(params));
      const items = data.Items.map((item) => unmarshall(item));
      res.send(items);
    } catch (err) {
      res.status(500).json({ message: "Error get book" });
    }
});


const getBooks = asyncHandler(async(req, res) => {

    const params = {
        TableName: "Books",
    };
    
    try {
        const data = await dynamoClient.send(new ScanCommand(params));
        const items = data.Items.map((item) => unmarshall(item));
        res.send(items);
    } catch (err) {
        res.status(500).json({ message: "Error get book" });
    }

});

const postBooks = asyncHandler(async (req, res) => {
const bookData = req.body;

const params = {
    TableName: "Books",
    Item: marshall(
    {
        _id: uuid(),
        name: bookData.name,
        author: bookData.author,
        description: bookData.description,
        countInStock: bookData.countInStock,
        price: bookData.price,
        image: bookData.image,
    },{ removeUndefinedValues: true }
    ),
};

try {
    await dynamoClient.send(new PutItemCommand(params));
    res.status(201).json({ message: "Book created successfully" });
} catch (err) {
    res.status(500).json({ message: "Error creating book" });
}
});


export { getBooksById, getBooks, postBooks }