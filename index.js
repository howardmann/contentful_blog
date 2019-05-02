require('dotenv').config()

let express = require('express')
let exphbs = require('express-handlebars')
let app = express()
let helmet = require('helmet')

let compression = require('compression')

// helpers
let helpers = require('./helpers')

// enable compression
app.use(compression())

// helmet security
app.use(helmet())

//serve static files from public folder
app.use(express.static('public'))

// view engine
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers
}));
app.set('view engine', '.hbs');



// markdown helper
let marked = require('marked')


// contentful client
let contentful = require('contentful')

let client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "052507e07cecf8fd9e27dca2ac1bfe3a16c66d628a2e5baf0cc606a5edb17299",
  space: process.env.CONTENTFUL_SPACE || "vwq10xzbe6iz"
})

// helper
let getBlogPost = (slug) => {
  return client.getEntries({
    'content_type': 'blogPost',
    'fields.slug': slug
  })
}

// routes
app.get('/', async (req, res, next) => {
  let blogs = await client.getEntries({
    'content_type': 'blogPost',
    'select': 'sys.createdAt,sys.id,fields.slug,fields.title,fields.description,fields.body' // weird syntax to return select properties "select": "field.<field_name>,field.<field_name>" 
  })
  res.render('index',{
    items: blogs.items,
    metaTitle: 'Howie Mann Blog',
    metaDecription: 'I explain things learnt in software, finance and marketing.'
  })
})

app.get('/:slug', async (req, res, next) => {

  let post = await getBlogPost(req.params.slug)
  let items = post.items[0]
  res.render('template', {
    post: items,
    body: marked(items.fields.body),
    metaTitle: items.fields.title,
    metaDescription: items.fields.description
  })
})

app.get('/json/', async (req, res, next) => {
  let blogs = await client.getEntries({
    'content_type': 'blogPost' 
  })
  res.json(blogs)
})

app.get('/json/:slug', async (req, res, next) => {
  let post = await getBlogPost(req.params.slug)
  res.json(post)
})


const PORT = 3000
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
})

//module.exports = app