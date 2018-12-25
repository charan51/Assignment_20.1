const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 3000;
const router = express.Router();
const fs = require('fs');
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'assets')));
app.get('/', (req, res) => {
    fs.readFile('./data/data.json', (err, data) => {
        res.status(200).render('home', {
            todoList: JSON.parse(data)
        });
    });
});

app.get('/new', (req, res) => {
    console.log('done');
    return res.status(200).render('newItem');
});
app.get('/:id', (req, res) => {
    const paramID = parseInt(req.params.id);
    fs.readFile('./data/data.json', (err, data) => {
        const resData = JSON.parse(data);
        resData.map(item => {
            return item.id === paramID ? res.status(200).render('showItem', { item }) : null;
        });
    });
});
app.get('/edit/:id', (req, res) => {
    const paramID = parseInt(req.params.id);
    fs.readFile('./data/data.json', (err, data) => {
        const resData = JSON.parse(data);
        resData.map(item => {
            return item.id === paramID ? res.status(200).render('editItem', { item }) : null;
        });
    });

});
app.post('/edit/:id', (req, res) => {
    const paramID = parseInt(req.params.id);
    const title = req.body.title;
    const description = req.body.description;
    fs.readFile('./data/data.json', (err, data) => {
        let resData = JSON.parse(data);
        for (let i = 0; i < resData.length; i++) {
            if (resData[i].id === paramID) {
                resData[i].title = title;
                resData[i].description = description;
            };
        }
        fs.writeFile('./data/data.json', JSON.stringify(resData), (err) => {
            if (err) throw err;
            console.log('complete');
        });
        res.status(200).redirect('/');
    });
});
app.get('/delete/:id', (req, res) => {
    const paramID = parseInt(req.params.id);
    fs.readFile('./data/data.json', (err, data) => {
        let resData = JSON.parse(data);
        const deltedData = resData.filter(item => {
            return item.id !== paramID;
        })
        fs.writeFile('./data/data.json', JSON.stringify(deltedData), (err) => {
            if (err) throw err;
            console.log('complete');
        });
        res.status(200).redirect('/');
    });
});
app.post('/new', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    fs.readFile('./data/data.json', (err, data) => {
        let resData = JSON.parse(data);
        resData.push({
            id: resData.length + 1,
            title: title,
            description: description,
            completed: false,
            tags: ["project", "list", "new", "awesome"]
        });
        fs.writeFile('./data/data.json', JSON.stringify(resData), (err) => {
            if (err) throw err;
            console.log('complete');
        });
    });
    res.status(200).redirect('/');
});
// port server config
app.listen(PORT, () => {
    console.log('express running on server ' + PORT);
});