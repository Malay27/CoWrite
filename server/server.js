import { connectionURI } from './constant.js';
import { Server } from 'socket.io';
import { MongoClient } from 'mongodb';

const io = new Server(3001, {
    cors: {
        origin: 'https://co-write-one.vercel.app',
        methods: ['GET', 'POST']
    }
});

const client = new MongoClient(connectionURI, { useNewUrlParser: true, useUnifiedTopology: true });

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
