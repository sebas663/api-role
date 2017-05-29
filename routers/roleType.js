var express      = require("express");
var mongoose     = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var Role         = require('../models/roleType');
var validator    = require('express-route-validator')

// API routes
var router = express.Router();

router.route('/roles')
  .get(function (req, res) {
        var promise = Role.find().exec();
        promise.then(function(roles) {
           response(res,roles);
        })
        .catch(function(err){
            // just need one of these
            //console.log('error:', err);
            res.status(500).send(err.message);
        });
    })
  .post(validator.validate({
         body: {
                code:             { isRequired: true },
                description:      { isRequired: true },
                permissionCodes:  { isRequired: true }
              },
              headers: {
                'content-type': { isRequired: true, equals: 'application/json' }
              }
        }),
        function(req, res) {
            //console.log('POST');
            //console.log(req.body);
            var role = new Role({
                  code: req.body.code,
                  description: req.body.description,
                  permissionCodes: req.body.permissionCodes
            });
            var promise = role.save();
            promise.then(function(role) {
              response(res,role);
            })
            .catch(function(err){
              // just need one of these
              //console.log('error:', err);
              res.status(500).send(err.message);
            });
        }
  );

router.route('/role/:idRole')
  .get(validator.validate({
          params: {
            idRole: { isRequired: true , isMongoId: true }
          }
      }),
      function(req, res) {
          var promise = Role.findById(req.params.idRole).exec();
          promise.then(function(role) {
            //console.log('GET /roles/' + req.params.idRole);
             response(res,role);
          })
          .catch(function(err){
            // just need one of these
            //console.log('error:', err);
            res.status(500).send(err.message);
          });
       }
  )
  .put(validator.validate({
          params: {
            idRole: { isRequired: true , isMongoId: true }
          }
      }),
      function(req, res) {
          //console.log('PUT');
          //console.log(req.body);
          var promise = Role.findById(req.params.idRole).exec();
          promise.then(function(role) {
            if(role){
                role.code = req.body.code,
                role.description = req.body.description,
                role.permissionCodes = req.body.permissionCodes
                return role.save(); // returns a promise
            }
          })
          .then(function(role) {
              var message = "Role successfully updated.";                
              response(res,role,message);
          })
          .catch(function(err){
              // just need one of these
              //console.log('error:', err);
              res.status(500).send(err.message);
          }); 
      }
  )
  .delete(validator.validate({
              params: {
                idRole: { isRequired: true, isMongoId: true }
              }
          }),
          function(req, res) {
              Role.findByIdAndRemove(req.params.idRole, function (err, role) {  
                 if(err)
                    res.status(500).send(err.message);
                 var message = "Role successfully deleted.";                
                 response(res,role,message);
              });
          }
  );
var response = function(res,role,messageOK,messageNotOK){
    if(role) {
      var resp = {
                  message: messageOK,
                  id:role._id
                };
      if(messageOK){
        res.status(200).jsonp(resp);
      }else{
        res.status(200).jsonp(role);
      }
    }else{
      var dfault =  "Role Not Found";
      if(messageNotOK){
        res.status(400).send(messageNotOK);
      }else{
        res.status(400).send(dfault);
      }
    }
};
module.exports = router