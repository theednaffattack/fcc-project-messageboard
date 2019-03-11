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

let replyPassword = "password";
let requestPassword2 = "";

let replyId = "";
let testThreadId1 = "";
let board = "testing";

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("API ROUTING FOR /api/threads/:board", function() {
    suite("POST", function() {
      test("Post Thread - responds status 200 when posting proper data", function(done) {
        chai
          .request(server)
          .post("/api/threads/testing")
          .send({
            text: "Test",
            delete_password: "abc123",
            board: "testing"
          }) // attach the payload, encoded as JSON
          .end(function(err, res) {
            // Send the request. Pass a Node callback

            assert.equal(res.status, 200, "response status should be 200");
            done();
          });
      });
    });

    suite("GET", function() {
      // If no name is passed, the endpoint responds with 'hello Guest'.
      test("GET an *array* of the most recent 10 bumped threads on the board with only the most recent 3 replies", function(done) {
        // Don't forget the callback...
        chai
          .request(server)
          .get("/api/threads/testing")
          .end(function(err, res) {
            assert.equal(res.status, 200, "response status should be 200");
            assert.isArray(res.body, "req.body should be an Array");
            assert.isAtMost(
              res.body.length,
              10,
              "req.body is 10 threads long at most"
            );

            assert.isArray(
              res.body[0].replies,
              "req.body.replies should be an Array"
            );

            assert.property(res.body[0], "replies", "`replies` is present");

            assert.isAtMost(
              res.body[0].replies.length,
              3,
              "req.body.replies is 3 replies long at most"
            );

            assert.property(res.body[0], "_id", "`_id` is present");
            assert.property(res.body[0], "text", "`text` is present");
            assert.property(
              res.body[0],
              "created_on",
              "`created_on` is present"
            );
            assert.property(res.body[0], "bumped_on", "`bumped_on` is present");
            assert.notProperty(
              res.body[0],
              "delete_password",
              "`delete_password` is not present"
            );
            assert.notProperty(
              res.body[0],
              "reported",
              "`reported` is not present"
            );

            testThreadId1 = res.body[0]._id;
            testThreadId2 = res.body[1]._id;
            done(); // Always call the 'done()' callback when finished.
          });
      });
    });

    suite("DELETE", function() {
      // don't delete with the wrong password
      test("Don't delete a thread when posting the wrong password", function(done) {
        chai
          .request(server)
          .delete("/api/threads/testing")
          .send({
            delete_password: "wrong",
            thread_id: testThreadId1
          })
          .end(function(err, res) {
            if (err) {
              console.error("delete error" + err);
              done();
            }
            // assert.equal(res.status, 200, "response status should be 200");
            assert.equal(res.text, "incorrect password");
            done(); // Always call the 'done()' callback when finished.
          });
      });

      // don't delete with the wrong thread_id
      test("Don't delete a thread when posting the wrong thread_id", function(done) {
        chai
          .request(server)
          .delete("/api/threads/testing")
          .send({
            delete_password: "abc123",
            thread_id: "0000001817a0904dda175c34"
          })
          .end(function(err, res) {
            assert.equal(res.text, "incorrect thread_id");
            done();
          });
      });
      // delete when both are correct
      test("Delete a Thread when `thread_id and password` are both correct", function(done) {
        chai
          .request(server)
          .delete("/api/threads/testing")
          .send({
            delete_password: "abc123",
            thread_id: testThreadId2
          })
          .end(function(err, res) {
            if (err) console.error("assertion error: " + err);
            assert.equal(res.text, "success");
            done();
          });
      });
    });

    suite("PUT", function() {
      // update a reply's report property to true
      // /api/threads/{board}
      test("Change a thread's `reported` value to true", function(done) {
        console.log("YOOOOOOOOOOOOOOO testThreadId2");
        console.log(testThreadId2);
        console.log(board);
        chai
          .request(server)
          .put(`/api/threads/${board}`)
          .send({
            report_id: testThreadId2, // testThreadId1,
            board: board
          })
          .end(function(err, res) {
            if (err) console.error("TEST suite error `put command`: " + err);
            // console.log("RESPONSE TEXT");
            // console.log(res.text);
            assert.equal(
              res.text,
              "success",
              "Expect response text to equal `success`"
            );
            done();
          });
      });
    });

    suite("API ROUTING FOR /api/replies/:board", function() {
      // I can POST a reply to a thead on a specific board by passing
      // form data text, delete_password, & thread_id to /api/replies/{board}
      // and it will also update the bumped_on date to the comments date.
      // (Recomend res.redirect to thread page /b/{board}/{thread_id})
      // In the thread's 'replies' array will be saved _id, text, created_on,
      // delete_password, & reported.
      suite("POST", function() {
        test("Post reply - responds status 200 when posting proper data", function(done) {
          chai
            .request(server)
            .post("/api/replies/testing")
            .send({
              text: "my reply post",
              delete_password: replyPassword,
              thread_id: testThreadId1
            })
            .end(function(err, res) {
              assert.equal(res.status, 200, "response status should be 200");

              done();
            });
        });
      });

      // I can GET an entire thread with all it's replies from
      // /api/replies/{board}?thread_id={thread_id}. Also hiding the same fields.
      suite("GET", function() {
        test("Get all replies from thread with `thread_id` and board", function(done) {
          chai
            .request(server)
            .get(`/api/replies/testing?thread_id=${testThreadId1}`)
            .end(function(err, res) {
              assert.equal(res.status, 200, "response status should be 200");
              console.log(Object.keys(res.body.replies));
              assert.property(res.body, "text");
              assert.property(res.body, "created_on");
              assert.property(res.body, "bumped_on");
              assert.notProperty(res.body, "reported");
              assert.notProperty(res.body, "delete_password");
              assert.property(res.body, "replies");
              assert.isArray(res.body.replies);
              if (res.body.replies.length > 0) {
                assert.property(res.body.replies[0], "_id");
                replyId = res.body.replies[0]._id;
                assert.property(res.body.replies[0], "text");
                assert.property(res.body.replies[0], "created_on");
                assert.notProperty(res.body.replies[0], "reported");
                assert.notProperty(res.body.replies[0], "delete_password");
              }
              done();
              // if (res.body.replies.length > 0) {
              //   assert.isArray(
              //     res.body.replies[0],
              //     "res.body.replies[0] should be an Array"
              //   );
              //   assert.notProperty(
              //     res.body.replies[0],
              //     "reported",
              //     "reported should not be present"
              //   );
              // }
            });
        });
      });

      suite("PUT", function() {
        // update a reply's report property to true
        // /api/threads/{board}
        test("Change a reply's reported value to true", function(done) {
          chai
            .request(server)
            .put(`/api/replies/${board}`)
            .send({
              thread_id: testThreadId1, // testThreadId1,
              reply_id: replyId,
              board: board
            })
            .end(function(err, res) {
              console.log("RESPONSE BODY");
              console.log(res.text);
              assert.equal(
                res.text,
                "success",
                "Expect response text to equal `success`"
              );
              done();
            });
        });
      });

      suite("DELETE", function() {
        // don't delete with the wrong password
        test("Don't delete a reply when posting the wrong password", function(done) {
          chai
            .request(server)
            .delete("/api/replies/testing")
            .send({
              delete_password: "wrong",
              reply_id: replyId
            })
            .end(function(err, res) {
              if (err) {
                console.error("delete error" + err);
                done();
              }
              // assert.equal(res.status, 200, "response status should be 200");
              assert.equal(res.text, "incorrect password");
              done(); // Always call the 'done()' callback when finished.
            });
        });

        // don't delete with the wrong reply_id
        test("Don't delete a reply when posting the wrong reply_id", function(done) {
          chai
            .request(server)
            .delete("/api/replies/testing")
            .send({
              delete_password: replyPassword,
              reply_id: "0000001817a0904dda175c33"
            })
            .end(function(err, res) {
              assert.equal(res.text, "incorrect reply_id");
              done();
            });
        });
        // delete when both are correct
        test("Delete a Thread when `reply_id and password` are both correct", function(done) {
          chai
            .request(server)
            .delete("/api/replies/testing")
            .send({
              delete_password: replyPassword,
              reply_id: replyId
            })
            .end(function(err, res) {
              if (err) console.error("assertion error: " + err);
              assert.equal(res.text, "success");
              done();
            });
        });
      });
    });
  });
});
