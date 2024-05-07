import express from 'express'

import bodyParser from 'body-parser'

import bcrypt from 'bcrypt';

import { v4 as uuidv4 } from 'uuid';

import cookieParser from 'cookie-parser'

import { setmail, sendmail } from './mail.js'
import { insertdata, setDB, checkEmail } from './database.js';
import { getProductDetails, insertProduct, getAllProductDetails, getAllProductId, getAllProductDetailsByCategory } from './product.js';
import { getOrderDetails } from './order.js';
import { getUserDetails, getAllUserDetails } from './user.js';
import { getAllOrderDetails } from './order.js';
import { insertCart, getAllCartDetails, clearAllCart, totalAllCartPrice } from './cart.js';
import { setUserAndSessionId, getUserAndSessionId,deleteUserSession,cookieExist } from './session.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express()
const saltRounds = 10;

app.use(express.static(__dirname + '\\public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())


var transporter = setmail()
var client = setDB()


app.get('/', function (req, res) {
  res.render('index.ejs')
})


app.get('/login', async function (req, res) {
  if (await cookieExist (req.cookies.Velurelle)) {
    res.redirect('/my-account')
   }
   else {
  res.render('login.ejs', {
    'status': ' '
  })
}
})

app.post('/login', async function (req, res) {

  var data = await checkEmail(req.body.email, client)

  if (data.rowCount > 0) {

    bcrypt.compare(req.body.password, data.rows[0].password, async function (err, result) {
      if (result) {
        if (data.rows[0].user_type == 1) {
          console.log("User login successful")
          var sessionId = uuidv4();
          await setUserAndSessionId(sessionId, data.rows[0])
          res.cookie('Velurelle', sessionId)
          res.redirect('/my-account')
        }
        else if (data.rows[0].user_type == 0) {
          res.redirect('/admin')
        }
      }
      else {
        console.log("Incorrect password")
        res.render('login.ejs', {
          'status': 'Incorrect password'
        })
      }
    });

  }
  else {
    console.log("No user exist")
    res.render('login.ejs', {
      'status': 'No user exist'
    })
  }
})




app.get('/register', async function (req, res) {
  if (await cookieExist (req.cookies.Velurelle)) {
 res.redirect('/my-account')
}
else{
  res.render('register.ejs', {
    'status': ' '
  })
}
})


app.post('/register', async function (req, res) {

  var data = await checkEmail(req.body.email, client)
  if (data.rowCount > 0) {
    console.log("User already exist please login")
    res.render('register.ejs', {
      'status': 'User already exist'
    });
  }
  else {
    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
      if (hash) {
        insertdata(req.body.name, req.body.email, hash, client)
      } else {
        Console.log(err)
      }
    });
    sendmail(req.body.email, req.body.name, transporter)

    res.render('thankyou.ejs', {
      'name': req.body.name
    });
  }
})

app.get('/reset', function (req, res) {
  res.render('reset.ejs')
})

app.get('/product', async function (req, res) {
  var idExist = false
  var allProductId = await getAllProductId(client)
  allProductId.forEach(function (id, index) {
    if (id.id == req.query.id)
      idExist = true
  });
  if (idExist) {
    var product = await getProductDetails(client, req.query.id)
    res.render('product.ejs', product)
  }
  else {
    res.redirect('/list')
  }
})

app.post('/product', async function (req, res) {

  var UserDetail = await getUserAndSessionId(req.cookies.Velurelle)

  insertCart(client, UserDetail.id, req.query.id, req.body.size, req.body.qty)
  res.redirect('cart')
})

app.get('/list', async function (req, res) {
  var product = await getAllProductDetailsByCategory(client, req.query.category_id)
  console.log(product)
  res.render('list.ejs', {
    'product': product
  })
})

app.get('/order', async function (req, res) {

  var UserDetail = await getUserAndSessionId(req.cookies.Velurelle)

  var order = await getAllOrderDetails(client, UserDetail.id)
  var product = await getAllProductDetails(client)
  res.render('order.ejs', {
    'order': order,
    'product': product,
    'name': req.body.name
  })
})

app.get('/cart', async function (req, res) {

  if (await cookieExist(req.cookies.Velurelle)) {

    // console.log(req.cookies.Velurelle)

    var UserDetail = await getUserAndSessionId(req.cookies.Velurelle)

    console.log(UserDetail)

    var cartDetail = await getAllCartDetails(client, UserDetail.id)
    var product = await getAllProductDetails(client)
    var total = await totalAllCartPrice(client, UserDetail.id)
    console.log(total)
    // console.log(cartDetail,)
    res.render('cart.ejs', {
      'cartDetail': cartDetail,
      'product': product,
      'total': total[0].sum
    })
  }
  else {
    res.redirect('/login')
  }
})

app.get('/my-account', async function (req, res) {

  if (await cookieExist(req.cookies.Velurelle)) {

    // Gets User Detail from Cookie
    var UserDetail = await getUserAndSessionId(req.cookies.Velurelle)

    // console.log(UserDetail)

    // console.log(req.cookies.Velurelle)
    res.render('account.ejs', {
      'name': UserDetail.name
    })
  }
  else {
    res.redirect('/login')
  }

})

app.get('/detail', async function (req, res) {
  res.render('edit.ejs',{
    'name': req.body.name
  })
})


app.post('/clearcart', async function (req, res) {
  await clearAllCart(client)
  res.redirect('cart')
})



app.get('/admin', async function (req, res) {
  
  var useradmindetail = await getAllUserDetails(client)
  res.render('admin.ejs',{
    'users': useradmindetail
  })
})

app.post('/admin', function (req, res) {
  var userdatalist = Object.values(req.body)
  insertProduct(client, userdatalist)
  res.render('admin.ejs')
})

app.post('/logout', async function(req,res){
  await deleteUserSession(req.cookies.Velurelle)
  res.redirect('/login')
})




app.get('/search', function (req, res) {
  res.render('search.ejs')
})

app.get('/gucci', function (req, res) {
  res.render('gucci.ejs')
})

app.get('/chanel', function (req, res) {
  res.render('chanel.ejs')
})

app.get('/givenchy', function (req, res) {
  res.render('givenchy.ejs')
})

app.get('/dior', function (req, res) {
  res.render('dior.ejs')
})

app.get('/louis-vuitton', function (req, res) {
  res.render('louisvuitton.ejs')
})

app.get('/versace', function (req, res) {
  res.render('versace.ejs')
})

app.get('/fashion-shows', function (req, res) {
  res.render('fashionshow.ejs')
})

app.get('/arts-&-culture', function (req, res) {
  res.render('arts.ejs')
})


app.get('/contact', function (req, res) {
  res.render('contact.ejs')
})

app.get('/find-a-store', function (req, res) {
  res.render('findstore.ejs')
})

app.get('/privacy-policy', function (req, res) {
  res.render('privacy.ejs')
})




app.listen(8080, function (req, res) {
  console.log("Server started")
})