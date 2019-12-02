const express = require('express');
const app = express();
const fs = require('fs');

const port = process.env.PORT || 5000;
const FILE = './feedbacks.json';
const txtFile = './feedbackstxt.txt';


async function writeToFile(body) {
    const comments = await readFromFile();
    comments.push(body);
    const error = fs.writeFileSync(FILE, JSON.stringify(comments));
    return error;
}

async function writeToTxtFile(body) {
    const comments = await readFromFile();
    comments.push(body);
    const error = fs.writeFileSync(txtFile, JSON.stringify(comments));
    return error;
}

async function readFromFile() {
    const rawdata = await fs.readFileSync(FILE);
    const comments = JSON.parse(rawdata);

    return comments;
}

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.post('/feedbacks', async function (req, res) {
    await writeToFile(req.body);
    await writeToTxtFile(req.body);
    res.json({
        success: true,
        body: req.body
    });
});

app.get('/express_backend', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.get('/feedbacks', async function (req, res) {
    res.json({
        success: true,
        body: await readFromFile()
    });
});

app.listen(port, () => console.log(`Server app listening on port ${port
    }!`));