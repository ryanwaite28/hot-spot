'use strict';

const vault_path = __dirname + '/vault/';
const html_path = vault_path + 'html/';
const css_path = vault_path + 'css/';
const js_path = vault_path + 'js/';
const images_path = vault_path + 'images/';

var paths = {
  vault_path: __dirname + '/vault/',
  html_path: __dirname + '/vault/html/',
  css_path: __dirname + '/vault/css/',
  js_path: __dirname + '/vault/js/',
  images_path: __dirname + '/vault/images/',
  cdn_path: __dirname + '/vault/_cdn/',
  glyphs_path: __dirname + '/vault/glyphicons/',
}

var pages = {
  welcome: 'welcome.html',
  signup: 'signup.html',
  signin: 'signin.html',
  about: 'about.html',
  faq: 'faq.html',
  contact: 'contact.html',
  info: 'info-1.html',
  profile: 'profile.html',
  generic: 'generic.html',
  error: 'error.html',
}

const app_secret = `
9td25k!l0zraa4z9lfpo@jbvswsng9xmp$65tyw&4s5ev2tb#6k5mok5p6kn2colr
7ajnwz%c42s1en1e3m#cjgxebxp6wsq3d7@qqoht54paiivlfw!w4mow8qg&ofxsp
vt97y08bru-inwre9vyn0wu-miw0bgwre_Ym4u387gtg=gt7cbuew_vtduefhbjjv
`;

const accepted_origins = [

];

const allowed_images = [
  'jpg',
  'jpeg',
  'png',
  'gif'
]

// --- Helper Functions

function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email.toLowerCase());
}

function randomValue() {
  return String(Date.now()) +
    Math.random().toString(36).substr(2, 34)
}

function randomValueLong() {
  return String(Date.now()) +
    Math.random().toString(36).substr(2, 34) +
    Math.random().toString(36).substr(2, 34)
}

function uniqueValue() {
	return String(Date.now()) +
		Math.random().toString(36).substr(2, 34) +
		Math.random().toString(36).substr(2, 34) +
		Math.random().toString(36).substr(2, 34)
}

function greatUniqueValue() {
	return String(Date.now()) +
		Math.random().toString(36).substr(2, 34) +
    Math.random().toString(36).substr(2, 34) +
    Math.random().toString(36).substr(2, 34) +
    Math.random().toString(36).substr(2, 34) +
		Math.random().toString(36).substr(2, 34) +
		Math.random().toString(36).substr(2, 34)
}

function Authorize(request, response, next) {
  let method = request.method;

  if(method === "GET" || method === "HEAD") {
    return next();
  }
  if(method === "POST" || method === "PUT" || method === "DELETE") {
    if(Object.keys(request.body).length === 0) {
      return response.json({
        error: true,
        message: "request body was empty... check content-type & header(s)"
      })
    }

    if(!request.session.id) {
      return response.json({
        error: true,
        message: "request unauthenticated."
      })
    }

    return next();
  }
  else {
    return response.json({
      error: true,
      message: "request method unknown/rejected: " + String(method)
    })
  }
}

function GET_SessionRequired(request, response, next) {
  if(!request.session.id) {
    return response.render(paths['error'], { message: 'You are not Signed in.', signed_in: request.session.id || false });
  }
  else { next(); }
}

function SessionRequired(request, response, next) {
  if(!request.session.id) {
    return response.json({ error: true, message: 'you are not signed in...' });
  }
  else { next(); }
}


// --- Export it

module.exports = {
  paths,
  pages,
  //
	app_secret,
  accepted_origins,
  allowed_images,
  //
  validateEmail,
  randomValue,
  randomValueLong,
  uniqueValue,
  greatUniqueValue,
  Authorize,
  GET_SessionRequired,
  SessionRequired
}
