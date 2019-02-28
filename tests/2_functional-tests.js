/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("API ROUTING FOR /api/threads/:board", function() {
    suite("POST", function() {});

    suite("GET", function() {
      //       // If no name is passed, the endpoint responds with 'hello Guest'.
      //       test('Test GET /hello with no name',  function(done){ // Don't forget the callback...
      //          chai.request(server)             // 'server' is the Express App
      //           .get('/hello')                  // http_method(url). NO NAME in the query !
      //           .end(function(err, res){        // res is the response object
      //             // Test the status and the text response (see the example above).
      //             // Please follow the order -status, -text. We rely on that in our tests.
      //             // It should respond 'Hello Guest'
      //             assert.equal(res.status, 200, 'response status should be 200');
      //             assert.equal(res.text, 'hello Guest', 'response status should be Guest');
      //             done();   // Always call the 'done()' callback when finished.
      //           });
      //       });
      //       /**  Another one... **/
      //       test('Test GET /hello with your name',  function(done){ // Don't forget the callback...
      //          chai.request(server)             // 'server' is the Express App
      //           .get('/hello?name=Eddie') /** <=== Put your name in the query **/
      //           .end(function(err, res){        // res is the response object
      //             // Your tests here.
      //             // Replace assert.fail(). Make the test pass.
      //             // Test the status and the text response. Follow the test order like above.
      //             assert.equal(res.status, 200, 'resopnse status should be 200');
      //              assert.equal(res.text, 'hello Eddie', 'response status should be Eddie'/** <==  Put your name here **/);
      //             done();   // Always call the 'done()' callback when finished.
      //           });
    });
  });

  suite("DELETE", function() {});

  suite("PUT", function() {
    //       test('#example - responds with appropriate JSON data when sending {surname: "Polo"}',  function(done){
    //          chai.request(server)
    //           .put('/travellers')         // note the PUT method
    //           .send({surname: 'Polo'})    // attach the payload, encoded as JSON
    //           .end(function(err, res){    // Send the request. Pass a Node callback
    //             assert.equal(res.status, 200, 'response status should be 200');
    //             assert.equal(res.type, 'application/json', "Response should be json");
    //             // res.body contains the response parsed as a JS object, when appropriate
    //             // (i.e the response type is JSON)
    //             assert.equal(res.body.name, 'Marco', 'res.body.name should be "Marco"');
    //             assert.equal(res.body.surname, 'Polo', 'res.body.surname should be "Polo"' );
    //             // call 'done()' when... done
    //             done();
    //           });
    //     });
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    suite("POST", function() {});

    suite("GET", function() {});

    suite("PUT", function() {});

    suite("DELETE", function() {});
  });
});
