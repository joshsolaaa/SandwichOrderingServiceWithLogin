
/* routes.js */

import { Router } from 'oak'
import HandlebarsEnvironment from 'handlebars'
import { login, register, getUser } from 'accounts'
import { createProduct, getProducts, removeProduct  } from 'products'
import  {placeOrder, getOrders, markOrderCompleted } from 'orders'
const router = new Router()

// the routes defined here
router.get('/', async context => {
	const authorised = await context.cookies.get('authorised')
	console.log('authorised', authorised)
	let data = { authorised, isOwner: 'owner' === authorised }
	const templateString = await Deno.readTextFile("./views/home.hbs")
	if ('owner' === authorised) {
		const products = await getProducts(); 
		const orders = await getOrders();
		const orderedDrinks = orders.map(o => o.drinkId)
		const orderedSandwiches = orders.map(o => o.sandwichId)
		const orderedSnacks = orders.map(o => o.snackId)
		const drinks = products.filter(p => p.category === 'drink' && orderedDrinks.includes(p.id)).map(d => ({...d, qty: orderedDrinks.filter(od => od === d.id).length}))
		const sandwiches = products.filter(p => p.category === 'sandwich' && orderedSandwiches.includes(p.id)).map(d => ({...d, qty: orderedSandwiches.filter(od => od === d.id).length}))
		const snacks = products.filter(p => p.category === 'snack' && orderedSnacks.includes(p.id)).map(d => ({...d, qty: orderedSnacks.filter(od => od === d.id).length}))
		data = {...data, drinks: drinks.length > 0 ? drinks : null, sandwiches: sandwiches.length > 0 ? sandwiches : null, snacks: snacks.length > 0 ? snacks : null}
	}
	console.log('data is', data)
	const template = HandlebarsEnvironment.compile(templateString)
	const body = template(data)
	context.response.body = body
})

router.get('/login', async context => {
	const templateString = await Deno.readTextFile("./views/login.hbs")
	const template = HandlebarsEnvironment.compile(templateString)
	const body = template()
	context.response.body = body
})

router.get('/register', async context => {
	const templateString = await Deno.readTextFile("./views/register.hbs")
	const template = HandlebarsEnvironment.compile(templateString)
	const body = template()
	context.response.body = body
})

router.post('/register', async context => {
	console.log('POST /register')
	const body = context.request.body({ type: 'form' })
	const value = await body.value
	const obj = Object.fromEntries(value)
	console.log(obj)
	await register(obj)
	context.response.redirect('/login')
})

router.get('/logout', async context => {
  await context.cookies.delete('authorised')
  await context.cookies.delete('userId')
  context.response.redirect('/')
})

router.post('/login', async context => {
	console.log('POST /login')
	const body = context.request.body({ type: 'form' })
	const value = await body.value
	const obj = Object.fromEntries(value)
	console.log(obj)
	try {
		const {id, username} = await login(obj)
		console.log("GOT VALUES", id, username)
		await context.cookies.set('authorised', username)
		await context.cookies.set('userId', id)
		context.response.redirect('/')
	} catch(err) {
		console.log(err)
		context.response.redirect('/login')
	}
})

router.get('/foo', async context => {
	const authorised = context.cookies.get('authorised')
	console.log(context.cookies)
	if(authorised === undefined) context.response.redirect('/')
	const data = { authorised, sliderValue: 50}
	const templateString = await Deno.readTextFile("./views/foo.hbs")
	const template = HandlebarsEnvironment.compile(templateString)
	const body = template(data)
	await getProducts(); 
	context.response.body = body
})

router.get('/placeOrder', async context => {
	const authorised = context.cookies.get('authorised')
	const userId = await context.cookies.get('userId')
	console.log("USER ID IS", userId)
	console.log('cookies', context.cookies)
	if(authorised === undefined) {
		context.response.redirect('/') 
		return
	}
	const user = await getUser(parseInt(userId))
	const templateString = await Deno.readTextFile("./views/place_order.hbs")
	const template = HandlebarsEnvironment.compile(templateString)
	const products = await getProducts(); 
	console.log('user is', user)
	//console.log("products are", products); 
		const drinks = products.filter(p => p.category === 'drink')
		const sandwiches = products.filter(p => p.category === 'sandwich')
		const snacks = products.filter(p => p.category === 'snack')
		const data = {name: user[0].username, address: user[0].useraddress, authorised, userId, drinks: drinks.length > 0 ? drinks : null, sandwiches: sandwiches.length > 0 ? sandwiches : null, snacks: snacks.length > 0 ? snacks : null}
	const body = template(data)
	context.response.body = body
})

router.post('/submitProduct', async (context) => {
  console.log('POST /submitProduct');
  const body = await context.request.body({type: 'form-data'});
  const formData = await body.value.read();

// console.log('formData', formData); 

const name = formData["fields"]['name'];
const description = formData["fields"]['description'];
const price = formData["fields"]['price'];
const category = formData["fields"]['category'];

	const file = formData.files[0]
  const { originalName, filename } = file
	console.log(`file called: ${originalName}`)
	console.log(`located at: ${filename}`)
	// move the file to the uploads/ directory
	await Deno.rename(filename, `${Deno.cwd()}/public/uploads/${originalName}`)
	const {success, error} = await createProduct({name, description, price, category, image: `/uploads/${originalName}` })
    console.log(name, description, price, category, success, error);

  // Handle the image upload and other data as required
  // await register(obj)

   context.response.redirect('/');
});

router.post('/removeProduct', async context => {
	console.log('POST /removeProduct')
	const body = context.request.body({ type: 'json' })
	const value = await body.value
	console.log('value is ', value)
	await removeProduct(value.id)
	context.response.redirect('/')
});

router.post('/completeOrders', async context => {
	console.log('POST /completeOrders')
	const body = context.request.body({ type: 'json' })
	const value = await body.value
	console.log('value is ', value)
	await markOrderCompleted(value.id)
	context.response.redirect('/')
});

router.post('/submitOrder', async context => {
	console.log('POST /submitOrder')
	const body = context.request.body({ type: 'json' })
	const value = await body.value
	console.log('value is ', value)
	const orderid = await placeOrder(parseInt(value.sandwichId), parseInt(value.snackId), parseInt(value.drinkId), parseInt(value.userId), value.userName, value.userAddress)
	context.response.body = {orderid}
})


export default router
