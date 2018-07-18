'use strict';

const express = require('express');

const GET = require('./routes/get');
const POST = require('./routes/post');
const PUT = require('./routes/put');
const DELETE = require('./routes/delete');

const chamber = require('../../chamber');


const router = express.Router();


// Realtime Events
const Stream = require('../../express-eventstream');
const stream = new Stream();
router.use(stream.enable());



/* --- GET Routes --- */



router.get('/', function(request, response) {
  GET.welcome_page(request, response, stream);
});

router.get('/stream', function(request, response){
  GET.event_stream(request, response, stream);
});

router.get('/test_route', function(request, response){
  GET.test_route(request, response, stream);
});

router.get('/check_session', function(request, response){
  GET.check_session(request, response, stream);
});



/* --- POST Routes --- */





/* --- PUT Routes --- */







/* --- DELETE Routes --- */








/* --- exports --- */

module.exports = {
  router
}
