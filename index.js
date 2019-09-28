// application

// middlewares imports
const express = require('express');
const cors = require('./middlewares/cors-middleware');
const auth = require('./middlewares/auth-middleware');
const authMiddleware = auth.authMiddleware;
const errorHandler = require('./middlewares/error-handling-middleware');

// routes imports
const homeRouter = require('./routes/home-routes');
const departmentRrouter = require('./routes/department-routes');
const subdepartmentRrouter = require('./routes/subdepartment-routes');
const photoalbumRouter = require('./routes/photoalbum-routes');
const newsRouter = require('./routes/news-routes');
const publicationRouter = require('./routes/publication-routes');
const ContactUSRouter = require('./routes/ContactUsRouter')


const authRouter = require('./routes/auth-routes');
// intialize a database connection when imported
const databaseConnect = require('./database'); 

// application config
const app = express();
const port = 4000;
const serverStartMessage = `server is running on port ${port}`;
express.static('public'); // config static files root dir


app.use(cors);
app.options('*',(req, res, next)=>{
    res.status(200);
    res.send();
});

app.use(authMiddleware);
// content type middleware if needed
app.use(express.json());
// json error handling middleware;

app.use('/departments', departmentRrouter);
app.use('/subdepartments', subdepartmentRrouter);
app.use('/photoalbum', photoalbumRouter);
app.use('/news', newsRouter);
app.use('/publication', publicationRouter);
app.use('/auth', authRouter);
app.use('/ContactUS', ContactUSRouter)
app.use('/', homeRouter);

app.use(express.static('public')); // static files middleware

app.use(errorHandler);

app.listen(port,()=>{
    console.log(serverStartMessage);
});

