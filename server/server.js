import { Server } from 'socket.io';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
// Update the port configuration
const io = new Server(process.env.PORT || 3001, {
    cors: {
        // Allow all origins in a production environment
        origin: process.env.NODE_ENV === "production" ? "https://co-write-one.vercel.app" : "http://localhost:3000",
        methods: ['GET', 'POST']
    }
});

console.log('MongoDB URI:', process.env.MONGODB_URI);

// Replace the hardcoded connectionURI with an environment variable
const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


io.on('connection', (socket) => {
    socket.on('get-document', async (documentId) => {
        const collection = client.db('cowrite').collection('documents');

        const result = await collection.findOne({ _id: documentId });

        if (result) {
            socket.join(documentId);
            socket.emit('load-document', result.data);
        } else {
            const newDocument = { _id: documentId, data: '' };
            await collection.insertOne(newDocument);

            socket.join(documentId);
            socket.emit('load-document', newDocument.data);
        }

        socket.on('send-changes', async (delta) => {
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        });

        socket.on('save-document',async data=>{
            await collection.updateOne({ _id: documentId }, { $set: { data: data } });
        })
    });
});

client.connect().then(() => {
    console.log('Connected to MongoDB');
    console.log('Socket.IO server listening on port 3001');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
