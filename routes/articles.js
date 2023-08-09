const express = require('express')
const article = require('../models/article')
//using express.router we create the routes
const router = express.Router()

// importing the created schema
const Article=require('../models/article')

//this leads to .../articles page as definition is mentioned in server.js 
//here we are passing a new object new Article bcoz in the error(in '/' in try catch block) part as well we are prepopulating the values if an empty field is found so if new page is opened it should be passed with constructor otherwise it will throw an error
// values are initialised in _form_fields file
router.get('/new', (req, res)=>{
    res.render('articles/new', {article: new Article()})
})

//for editing the created article(much similar to /new)
router.get('/edit/:id', async (req, res)=>{
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', {article: article})
})

// finding by slug instead of id
router.get('/:slug', async (req, res)=>{
    const article = await Article.findOne({slug: req.params.slug})
    if(article == null) res.redirect('/')
    res.render('articles/show', {article: article})
})

router.post('/',  async(req, res, next)=>{
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new')) 
// the above line will redirect us to the same page if any type of error is occured


router.put('/:id',  async(req, res, next)=>{
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit')) 
// the above line will redirect us to the same page if any type of error is occured


//only this much to delete a record (creating delete button is tricky, (npm i method-override) is used to delete a post by overriding the get/post method)
router.delete('/:id', async (req, res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

//same functionalities are shared by both new and edit  so we made a function that is used commonly by both 
function saveArticleAndRedirect(path){
    return async (req, res)=>{
        //here we created the new article
        let article= req.article
        //we are able to access the form fields of new article pages due to server.js ----> app.use(express.urlencoded({extended:false}))
        article.title= req.body.title
        article.description= req.body.description
        article.markdown= req.body.markdown

        // try and catch function to make user aware whether data is being saved or not
        try{
            //saving the article (since: article.save is an async function so adding async at (req, res))
            article = await article.save()
            console.log("Article saved successfully!")
            // the above stmt article on left would get saved with an id field so after saving we would redirect user to that article's id
            res.redirect(`/articles/${article.slug}`)
        } catch (e) {

            console.log(e)
            // if failure
            res.render(`articles/${path}`, {article: article})
        }
    }
}

//exporting the route so that we can use it in other file
module.exports= router
