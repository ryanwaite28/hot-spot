'use strict';

const express = require('express');
const client_sessions = require('client-sessions');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const validator = require('validator');
const nunjucks = require('nunjucks');

const google = require('./firebase_config/index');
const chamber = require('./chamber');

const main_router = require('./routers/main/router').router;
const api_router = require('./routers/api/router').router;



/* --- Setup --- */

const app = express();

nunjucks.configure(chamber.paths['html_path'], { autoescape: true, express: app });

app.use(fileUpload({ safeFileNames: true, preserveExtension: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/vault', express.static(chamber.paths['vault_path']));
app.use('/css', express.static(chamber.paths['css_path']));
app.use('/js', express.static(chamber.paths['js_path']));
app.use('/images', express.static(chamber.paths['images_path']));
app.use('/html', express.static(chamber.paths['html_path']));

app.use(client_sessions({
  cookieName: 'session',
  secret: chamber.app_secret,
  duration: 5 * 30 * 60 * 1000,
  activeDuration: 2 * 5 * 60 * 1000,
  cookie: { httpOnly: false, secure: false, ephemeral: false }
}));



/* --- Mount --- */

app.use("/", main_router);
app.use("/api", api_router);



/* --- Listen --- */

app.set('port', (process.env.PORT || 8000));
app.listen(app.get('port'), function() {
  console.log('Listening on port ' + String(app.get('port')) + '...');
});
