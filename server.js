let express = require('express')
let exphbs = require('express-handlebars')
let app = express()

let compression = require('compression')

// enable compression
app.use(compression())

//serve static files from public folder
app.use(express.static('public'))

// view engine
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// markdown helper
let marked = require('marked')


// contentful client
let contentful = require('contentful')

let client = contentful.createClient({
  accessToken: '052507e07cecf8fd9e27dca2ac1bfe3a16c66d628a2e5baf0cc606a5edb17299',
  space: 'vwq10xzbe6iz'
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
    'select': 'sys.id,fields.slug,fields.title,fields.description' // weird syntax to return select properties "select": "field.<field_name>,field.<field_name>" 
  })
  res.render('index',{
    items: blogs.items,
    metaTitle: 'homepage',
    metaDecription: 'This is the description'
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

app.get('/template/:slug', async (req, res, next) => {

  let post = await getBlogPost(req.params.slug)
  let items = post.items[0]
  res.render('template', {
    post: items,
    body: marked(items.fields.body),
    metaTitle: items.fields.title,
    metaDescription: items.fields.description
  })
})


const PORT = 3000
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
})