const chai = require("chai");
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;

const passport = require('passport');
let Arrowjs = require('../server');
let mypassport = require('../config/passport')(passport,Arrowjs);
let application = Arrowjs;
let redis = '';
let key = 'arrowCMS_current-user-2';

describe("Arrow render view", function () {


    application.get('/setcache', (req,res) => {
        mypassport.deserializeUser(2, (err , result) => {
            if (!result) {
                res.json({err : 'no cache'});
            } else {
                res.json({user : result});
            }
        });
    });


    before(function (done) {
        application.start( { passport : true, role : true } )
            .then(function () {
                redis = application.redisClient;
                return done()
            });

    });

    after(function (done) {
        application.close().then(function () {
            done()
        });
    });

    it("User should have roles that they are allowed ", (done) => {
        chai.request('http://localhost:8000')
            .get('/setcache')
            .end((err, res) => {
                let expectedRole = {
                    feature : {
                        menu : [{name:"index"},
                                {name:"create"},
                                {name:"update"},
                                {name:"delete"}],
                        blog : [{"name":"post_manage"}]
                    }
                }
                expect(JSON.parse(res.body.user.role.permissions)).to.deep.equal(expectedRole);
                done();
            });
    });

    it("Should allow user to access router '/blog/posts' because user has permission 'post_manage'", (done) => {
        chai.request('http://localhost:8000')
            .get('/blog/posts')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.redirectTo('http://localhost:8000/admin/403');
                done();
            });
    });

    it("Should not allow user to access router '/mypage' because user does not have permission 'page_manage'", (done) => {
        chai.request('http://localhost:8000')
            .get('/mypage')
            .end((err, res) => {
                expect(res).to.redirectTo('http://localhost:8000/admin/403');
                done();
            });
    });

    it("Should not allow user to access router '/mypage' because user does not have permission 'page_manage'", (done) => {
        chai.request('http://localhost:8000')
            .get('/menu')
            .end((err, res) => {
                expect(res).to.redirectTo('http://localhost:8000/admin/403');
                done();
            });
    });

});

