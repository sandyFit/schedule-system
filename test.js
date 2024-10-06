import express from 'express';

const app = express();
const port = 5050;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Simple server running at http://localhost:${port}`);
});
