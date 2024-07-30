
/* orders.js */

import { compare, genSalt, hash } from 'bcrypt'

import { db } from 'db'

import { getProducts } from 'products'

/**
 * Places new order.
 * @param {integer} sandwichId
 * @param {integer} snackId
 * @param {integer} drinkId
 * @param {integer} userId
 * @param {string} userName
 * @param {string} userAddress
 * @returns {integer} the id of the new order
 */
export async function placeOrder(sandwichId, snackId, drinkId, userId, userName, userAddress) {
    if (!sandwichId)
        return {success: false, error: 'Please specify sandwich'};
    if (!snackId)
        return {success: false, error: 'Please specify snack'};
    if (!drinkId)
        return {success: false, error: 'Please specify drink'};  
    if (!userId)
        return {success: false, error: 'Please specify user'};
    const products = await getProducts(); 
	if (!products.find(p => p.id === sandwichId && p.category === 'sandwich')) { 
		return {success: false, error: 'Sandwich does not exist'};
	}
	if (!products.find(p => p.id === snackId && p.category === 'snack')) { 
		return {success: false, error: 'Snack does not exist'};
	}
	if (!products.find(p => p.id === drinkId && p.category === 'drink')) { 
		return {success: false, error: 'Drink does not exist'};
	}
	const sql = `INSERT INTO orders(sandwichId, snackId, drinkId, accountId) VALUES(${sandwichId}, ${snackId}, ${drinkId}, ${userId})`
	console.log(sql)
	const {lastInsertId} = await db.query(sql)
	const userUpdateSql = `UPDATE accounts SET username = "${userName}",  useraddress = "${userAddress}" WHERE id = ${userId}`;
	await db.query(userUpdateSql);
	return lastInsertId
}
/**
 * Get all orders.
 * @returns {array} array containing all the orders 
 */
export async function getOrders() { 
    // get all products for user id, and group by category 
    let sql = `SELECT * FROM orders WHERE isCompleted = false;`
	let records = await db.query(sql)
    console.log('records', records)
	return records
}

export async function markOrderCompleted(itemId) { 
	const orderUpdateSql = `UPDATE orders SET isCompleted = true WHERE drinkId = ${itemId} OR sandwichId = ${itemId} OR snackId = ${itemId}`;
	await db.query(orderUpdateSql);
	return true
}