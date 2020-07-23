const { Pool } = require('pg');
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(
    `SELECT *
    FROM users
    WHERE email = $1`, [email])
    .then (res => res.rows[0])
    .catch (err => null);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  console.log('id =', id);
  return pool.query(
    `SELECT *
    FROM users
    WHERE id = $1`, [id])
    .then (res => res.rows[0])
    .catch (err => null);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query(
    `INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING*`, [user.name, user.email, user.password]
  )
  .then(res => res.rows[0]);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query (
    `SELECT reservations.*, properties.*, AVG(rating) AS average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id 
    JOIN property_reviews ON property_reviews.property_id = properties.id 
    WHERE reservations.guest_id = $1 AND end_date < now()::date
    GROUP BY reservations.id, properties.id 
    ORDER BY start_date 
    LIMIT $2`, [guest_id, limit])
    .then(res => res.rows)
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // return pool.query(`
  // SELECT * 
  // FROM properties
  // LIMIT $1`, [limit])
  // .then(res => res.rows);
  console.log('options = ', options);

   // 1
   const queryParams = [];
   // 2
   let queryString = `
   SELECT properties.*, avg(property_reviews.rating) as average_rating
   FROM properties
   JOIN property_reviews ON properties.id = property_id
   `;
 
   // 3

  //  if (options.city) {
  //    if (options.minimum_price_per_night && options.maximum_price_per_night) {
  //     queryParams.push(`%${options.city}%`);
  //     queryString += `WHERE city LIKE $${queryParams.length}`;
  //     const minCostInCents = options.minimum_price_per_night * 100
  //     queryParams.push(`${minCostInCents}`);
  //     queryString += ` AND cost_per_night >= $${queryParams.length}`;
  //     const maxCostInCents = options.maximum_price_per_night * 100
  //     queryParams.push(`${maxCostInCents}`);
  //     queryString += ` AND cost_per_night <= $${queryParams.length}`;
  //    } else if(options.minimum_price_per_night) {
  //     queryParams.push(`%${options.city}%`);
  //     queryString += `WHERE city LIKE $${queryParams.length}`;
  //     const minCostInCents = options.minimum_price_per_night * 100
  //     queryParams.push(`${minCostInCents}`);
  //     queryString += ` AND cost_per_night >= $${queryParams.length}`;
  //    } else if (options.maximum_price_per_night) {
  //     queryParams.push(`%${options.city}%`);
  //     queryString += `WHERE city LIKE $${queryParams.length}`;
  //     const maxCostInCents = options.maximum_price_per_night * 100
  //     queryParams.push(`${maxCostInCents}`);
  //     queryString += ` AND cost_per_night <= $${queryParams.length}`;
  //    } else {
  //     queryParams.push(`%${options.city}%`);
  //     queryString += `WHERE city LIKE $${queryParams.length} `;
  //    }
  //  }
  let whereOptions = [];

  if(options.city) {
    queryParams.push(`%${options.city}%`);
    whereOptions.push(`city LIKE $${queryParams.length}`);
  }

  if(options.minimum_price_per_night) {
    const minCostInCents = options.minimum_price_per_night * 100
    queryParams.push(`${minCostInCents}`);
    whereOptions.push(`cost_per_night >= $${queryParams.length}`);
  }

  if(options.maximum_price_per_night) {
    const maxCostInCents = options.maximum_price_per_night * 100
    queryParams.push(`${maxCostInCents}`);
    whereOptions.push(`cost_per_night <= $${queryParams.length}`);
  }
 
  const makeWhereClause = function (whereOptions) {
    let whereClause = `WHERE `;
    if(whereOptions.length > 0) {
      if(whereOptions.length === 1) {
        whereClause += whereOptions[0];
        return whereClause;
      } else {
        whereClause += whereOptions[0];
        for (let i = 1; i < whereOptions.length; i++) {
          whereClause += ` AND ${whereOptions[i]}`;
        }
        return whereClause;
      }
    }
  }

  console.log('whereOptions = ', whereOptions);
  console.log('function with whereOptions = ', makeWhereClause(whereOptions));

  if(makeWhereClause(whereOptions)) {
    queryString += makeWhereClause(whereOptions);
  }
  console.log('queryString after makeWhereClause function', queryString);


   // 4

  queryString += `
  GROUP BY properties.id`;

  if(options.minimum_rating) {
  queryParams.push(`${options.minimum_rating}`);
  queryString +=`
  HAVING AVG(property_reviews.rating) >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  
 
   // 5
   console.log('query string and then queryParams = ', queryString, queryParams);
 
   // 6
   return pool.query(queryString, queryParams)
   .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
