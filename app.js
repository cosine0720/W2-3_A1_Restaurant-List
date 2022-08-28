const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
const port = 3000

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// routes setting
app.get('/', (req, res) => {
  // past the movie data into 'index' partial template
  res.render('index', { restaurants: restaurantList.results });
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.trim().toLowerCase()) || 
           restaurant.category.toLowerCase().includes(keyword.trim().toLowerCase())
  })
  res.render('index', { restaurants: restaurants, keywords: keyword })
})

app.get('/restaurants/:restaurant_id', (req, res) => {

  const restaurant = restaurantList.results[req.params.restaurant_id - 1]
  res.render('show', { restaurant: restaurant })
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})