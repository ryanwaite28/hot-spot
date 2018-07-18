'use strict';

const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../../../models').models;
const chamber = require('../../../chamber');



/* --- GET Functions --- */

function welcome_page(request, response, stream) {
  return response.render(chamber.pages['welcome'], { signed_in: request.session.id || false });
}

function signup_page(request, response, stream) {
  if(request.session.id) { return response.redirect('/'); }
  return response.render(chamber.pages['signup'], { signed_in: request.session.id || false });
}

function signin_page(request, response, stream) {
  if(request.session.id) { return response.redirect('/'); }
  return response.render(chamber.pages['signin'], { signed_in: request.session.id || false });
}

function signout(request, response, stream) {
  request.session.reset();
  return response.redirect('/');
}

function event_stream(request, response, stream) {
  stream.add(request, response);
  stream.push_sse(1, "opened", { msg: 'connection opened!' });
}

function test_route(request, response, stream) {
  stream.push_sse(2, "test", { event: true });
  return response.json({ msg: 'admit one' });
}

function profile_page(request, response, stream) {
  return response.render(chamber.pages['profile'], { signed_in: request.session.id || false });
}

function check_session(request, response, stream) {
  return new Promise((resolve, reject) => {
    (async function() {
      if(request.session.id && request.session.you){
        var get_user = await models.Users.findOne({ where: { id: request.session.you.id } });
        var user = get_user.dataValues;
        delete user['password'];
        var session_id = request.session.id;
        return response.json({ online: true, session_id, user });
      }
      else {
        return response.json({ online: false });
      }
    })()
  });
}





/* --- Exports --- */

module.exports = {
  welcome_page,
  // signup_page,
  // signin_page,
  // signout,
  // profile_page,
  // event_stream,
  // test_route,
  check_session,
}
