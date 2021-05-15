const mongoose=require('mongoose')

//npm i slugify marked,  these two are used so that the url bar doesnt look ugly by  throwing ids rather use some title or else
const marked = require('marked')
const slugify= require('slugify')
// for converting the markdown to html we use dompurify
const createDomPurify = require('dompurify')
const  {JSDOM} = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const createDomPurifier = require('dompurify') 

//creating the schema 
const articleSchema=new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type:String
    },
    markdown:{
        type:String,
        required: true
    },
    createdAt:{
        type:Date,
        default: Date.now 
    },

    // we will store the slug value along with  data in db and each time we create it we will validate it using the function given below
    // to render the slug in the url, change router /:id to /:slug, r
    slug:{
        type:String,
        required: true,
        unique: true
    },

    sanitizedHtml:{
        type:String,
        required: true
    }
})

// the function will validate the article each time we create, edit or delete the article
//prevalidate
articleSchema.pre('validate', function(next){
    if(this.title){
        //creating our slug from title, lower: true (conversion to lowercase letters), strict:true (to get rid of characters that cant be there in url, ex: ';')
        this.slug = slugify(this.title, {lower: true, strict: true})
    }

    //sanitizing converted html dompurify.sanitize(marked(title.markdown)), marked(title.markdown) : markdown to html 
    //to gget rid of any malicious code and to escape html characters
    //change in show.ejs as well , <%= article.markdown%> changed to <%- article.sanitizedHtml%>    
    if(this.markdown){
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }
    next()
})

//exporting a table called 'Article' by name articleSchema
module.exports = mongoose.model('Article', articleSchema)