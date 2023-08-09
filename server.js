const express = require('express')
require('dotenv').config()
const app = express()
//importing mongoose to connect with the db
const mongoose=require('mongoose')
//importing the created articles router insit the routes folder
const articleRouter = require('./routes/articles')
//importing the article model to render the values from db
const Article = require('./models/article')
//for overriding the method instead of get/post to be able to delete
const methodOverride= require('method-override')

//connecting to the database( process.env port used during deployment)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/blog', { useUnifiedTopology: true , useNewUrlParser: true, useCreateIndex:true}).then(()=> console.log('MongoDb Connected...')).catch(err=> console.log(err))

const PORT= process.env.PORT || 5500;

//setting up the view engine
app.set('view engine', 'ejs')


//this will allow us to get the values that are inside the new article
app.use(express.urlencoded({extended:false}))


//to be able to override the method (previously used only for get and post) to able to use it for delete in index.js
app.use(methodOverride('_method'))


// to render images that are present at public/images/img.jpg
app.use(express.static('public'))


//this is the homepage here we are rendering whatever on index.js
app.get('/', async (req, res)=>{

    const articles = await Article.find().sort({createdAt: 'desc'})
    res.render('articles/index', {articles: articles})
})

// setting the path /articles and where does it leads to
app.use('/articles', articleRouter)



//due to this the server runs on port 5000
app.listen(PORT, console.log(`server is starting at ${PORT}`))
