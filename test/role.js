var mongoose     =   require("mongoose");
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var Role         =   require('../models/role');
//Require the dev-dependencies
var chai         =   require('chai');
var chaiHttp     =   require('chai-http');
//var chaiAsPromised = require("chai-as-promised");
//var server      =   require('../server');
var server       = 'http://localhost:4200';
// Add promise support if this does not exist natively.

//chai.use(chaiAsPromised);
chai.use(chaiHttp);

var should = chai.should();

//For work whit environment variable.
require('dotenv').config();

describe('Roles', () => {
    beforeEach(() => {
        Role.remove({}, (err) => { 
           done();         
        });
    });
  describe('/GET roles', () => {
      it('it should GET all the roles', () => {
             chai.request(server)
            .get('/api/' + process.env.API_VERSION + '/roles')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(0);
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            });
      });
  });

  describe('/POST role', () => {
      it('when missing item in payload, should return a 400 ok response and a single error', () => {
        var role = {
                code: "MEDICO"
            }
            chai.request(server)
            .post('/api/' + process.env.API_VERSION + '/roles')
            .send(role)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('errors');
                expect(res.body.errors).to.have.property('description');
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            })
      });
      it('it should POST a role ', () => {
        var role = {
                code: "MEDICO",
                description: "Medico"
            }
            chai.request(server)
            .post('/api/' + process.env.API_VERSION + '/roles')
            .send(role)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message').eql('Role successfully added!');
                expect(res.body.role).to.have.property('code');
                expect(res.body.role).to.have.property('description');
                expect(res.body.role).to.have.property('enabled');
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            });
      });
  });
  describe('/GET/:id role', () => {
      it('it should GET a role by the given id', () => {
        var role = new Role({ 
                              code: "WEBADMIN",
                              description: "Administrador web"
                            });
        role.save((err, role) => {
            chai.request(server)
            .get('/api/' + process.env.API_VERSION + '/roles/' + role.id)
            .send(role)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.role).to.have.property('code');
                expect(res.body.role).to.have.property('description');
                expect(res.body.role).to.have.property('enabled');
                expect(res.body).to.have.property('_id').eql(role.id);
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            });
        });

      });
  });
  describe('/PUT/:id role', () => {
      it('it should UPDATE a role given the id', () => {
        var role = new Role({ 
                            code: "MEDICOP",
                            description: "Medico pediatra"
                            })
        role.save((err, role) => {
                chai.request(server)
                .put('/api/' + process.env.API_VERSION + '/roles/' + role.id)
                .send({ code: "MEDICOP",
                        description: "Medico pediatrico"
                    })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message').eql('Role successfully updated.');
                    expect(res.body.role).to.have.property('description').eql("Medico pediatrico");
                })
                .catch(function (err) {
                    console.log("Promise Rejected");
                });
          });
      });
  });
  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id role', () => {
      it('it should DELETE a role given the id', () => {
        var role = new Role({  
                            code: "MAS",
                            description: "Masajista"
                            })
        role.save((err, role) => {
                chai.request(server)
                .DELETE('/api/' + process.env.API_VERSION + '/roles/' + role.id)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message').eql('Role successfully deleted.');
                    expect(res.body.result).to.have.property('ok').eql(1);
                })
                .catch(function (err) {
                    console.log("Promise Rejected");
                });
          });
      });
  });
});