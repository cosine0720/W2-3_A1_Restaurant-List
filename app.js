const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurant')

const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

// 首頁
app.get('/', (req, res) => {
  Restaurant.find({})
    .lean()
    .then(restaurantsData => res.render("index", { restaurantsData }))
    .catch(err => console.log(err))
})

// 搜尋
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.trim().toLowerCase()) || 
           restaurant.category.toLowerCase().includes(keyword.trim().toLowerCase())
  })
  res.render('index', { restaurants: restaurants, keywords: keyword })
})

// 新增餐廳頁面
app.get("/restaurants/new", (req, res) => {
  res.render("new")
})

app.post('/restaurants', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

// 瀏覽特定餐廳
app.get("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
    .lean()
    .then(restaurantData => res.render("show", { restaurantData }))
    .catch(err => console.log(err))
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})