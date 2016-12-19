// var assert = require('assert'),
// 	co = require('co'),
// 	expect = require('chai').expect,
// 	thinky = require(__base+'/api/config/thinky.js'),
// 	r = thinky.r;
//
// before(done => {
// 	co(function *(){
// 		var tables = yield r.db('test').tableList().forEach(function(name){ return r.table(name).delete() })
// 		done();
// 	})
// })
//
// describe('Users Model', () => {
//
// 	var correctPassword = '12345',
// 		wrongPassword = '123456',
// 		email = 'test@testing.com';
//
// 	describe('users.passwordMatches function', () => {
//
// 		before(done => {
// 			co(function*() {
// 				var user = yield M.User.userCreate({ first_name: 'test', email: email, password: correctPassword })
// 				done()
// 			})
// 		})
//
// 		it('should work if password matches', done => {
// 			co(function*() {
// 				var data = yield M.User.passwordMatches(email, correctPassword)
// 				expect(data).to.be.an('object')
// 				done()
// 			})//.catch(e => console.log(e))
// 		});
//
// 		it('should work fail if password does not match', done => {
// 			co(function*() {
// 				var data = yield M.User.passwordMatches(email, wrongPassword)
// 				assert.equal(data, false)
// 				done()
// 			})
// 		});
//
// 	});
//
// 	describe('user.comparePassword function', () => {
//
// 		var user;
//
// 		before(done => {
// 			M.User.filter({ email: email }).run().then(res => {
// 				user = res[0]
// 				done()
// 			})
// 		})
//
// 		it('should work if password matches', done => {
// 			co(function*() {
// 				assert.equal(yield user.comparePassword(correctPassword), true)
// 				done()
// 			})
// 		});
//
// 		it('should fail if password does not match', done => {
// 			co(function*() {
// 				assert.equal(yield user.comparePassword(wrongPassword), false)
// 				done()
// 			})
// 		});
//
// 	});
// });
