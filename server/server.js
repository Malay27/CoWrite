import { connectionURI } from './constant.js';
import { Server } from 'socket.io';
import { MongoClient } from 'mongodb';

const io = new Server(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

const client = new MongoClient(connectionURI, { useNewUrlParser: true, useUnifiedTopology: true });

io.on('connection', (socket) => {
    socket.on('get-document', async (documentId) => {
        const collection = client.db('cowrite').collection('documents');

        // Check if the document already exists in the database
        const result = await collection.findOne({ _id: documentId });

        if (result) {
            // If the document exists, send the document data to the client
            socket.join(documentId);
            socket.emit('load-document', result.data);
        } else {
            // If the document doesn't exist, create a new document entry in the database
            const newDocument = { _id: documentId, data: '' };
            await collection.insertOne(newDocument);

            // Send the newly created document data to the client
            socket.join(documentId);
            socket.emit('load-document', newDocument.data);
        }

        socket.on('send-changes', async (delta) => {
            // Update the document data in the database
            

            // Broadcast the changes to other connected clients
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        });

        socket.on('save-document',async data=>{
            await collection.updateOne({ _id: documentId }, { $set: { data: data } });
        })
    });
});

// Connect to the MongoDB database and start the server
client.connect().then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    // io.listen(3001);
    console.log('Socket.IO server listening on port 3001');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
