
/* accounts.js */

import { compare, genSalt, hash } from 'bcrypt'

import { db } from 'db'


export async function createProduct(data) {
    // verify name
    if (!data.name)
        return {success: false, error: 'Please specify name'};
    // verify description length 
    if (!data.description)
        return {success: false, error: 'Please specify the description'};
    if (data.description.length > 100 )
        return {success: false, error: 'Description must be less than 100 characters'};  
    // verify price 
    if (!data.price)
        return {success: false, error: 'Please specify price'};
    if (parseInt(data.price) < 50 || parseInt(data.price) > 500)
        return {success: false, error: 'Price must be between 50 and 500p'};
    // verify category 
    if (!data.category) 
        return {success: false, error: 'Please specify category'};
    if (!['drink', 'sandwich', 'snack'].includes(data.category))
        return {success: false, error: 'Category should be drink, sandwich or snack.'};
	const sql = `INSERT INTO products(name, description, price, category, image) VALUES("${data.name}", "${data.description}", ${data.price}, "${data.category}", "${data.image}")`
	console.log(sql)
	await db.query(sql)
	return true
}

export async function removeProduct(id) { 
    // sql to DELETE FROM products WHERE id = id 
    let sql = `UPDATE products SET isDeleted = true WHERE id = ${id};`
    await db.query(sql)
    return true; 
}

export async function getProducts(userId) { 
    // get all products for user id, and group by category 
    let sql = `SELECT * FROM products WHERE isDeleted = false;`
	let records = await db.query(sql)
    console.log('records', records)
	return records
}

