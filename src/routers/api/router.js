'use strict';

const express = require('express');
const cors = require('cors');

const GET = require('./routes/get');
const POST = require('./routes/post');
const PUT = require('./routes/put');
const DELETE = require('./routes/delete');

const chamber = require('../../chamber');



const router = express.Router();
router.use(cors());



/* --- GET Routes --- */



router.get('/', function(request, response) {
  GET.welcome_api(request, response);
});



/* --- POST Routes --- */





/* --- PUT Routes --- */







/* --- DELETE Routes --- */








/* --- exports --- */

module.exports = {
  router
}
