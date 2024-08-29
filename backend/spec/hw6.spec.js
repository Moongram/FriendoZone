/*
 * Test suite hw6-backend
 */

require('es6-promise').polyfill();
require('isomorphic-fetch');
const { JUnitXmlReporter } = require('jasmine-reporters');
// Setup the reporter
jasmine.getEnv().addReporter(new JUnitXmlReporter({
    savePath: './', 
    consolidateAll: true, 
    filePrefix: 'junit-report.xml' 
}));
const url = path => `http://localhost:3000${path}`;

describe('Validate Registration, Login, Profile, and Article Functionality', () => {
    let cookie;
    let testId;
    let testUsername;

    beforeAll((done) => {
        testId = new Date().getTime();
        testUsername = "testUser" + testId;
        done();
    });

    it('should register a new user: POST /register', (done) => {
        let regUser = {
            username: testUsername,
            password: '123',
            email: 'lily@rice.edu',
            dob: 1,
            zipcode: '77005',
            phone: '123-456-7890',
        }
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regUser)
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(testUsername);
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('should log in as the test user: POST /login', (done) => {
        let loginUser = {
            username: testUsername, 
            password: '123'
        };
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginUser)
        }).then(res => {
            cookie = res.headers.get('set-cookie');
            return res.json()
        }).then(res => {
            expect(res.username).toEqual(testUsername);
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('should update the headline: PUT /headline', (done) => {
        let newHeadline = {
            headline: 'updated headline'
        }
        fetch(url('/headline'), {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': cookie
            },
            body: JSON.stringify(newHeadline)
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(testUsername);
            expect(res.headline).toEqual('updated headline');
            done();
        });
    });

    it('should return the headline of the test user: GET /headline', (done) => {
        fetch(url('/headline'), {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': cookie
            }
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(testUsername);
            expect(res.headline).toEqual('updated headline');
            done();
        });
    });

    it('should return the headline of the requested user: GET /headline/user', (done) => {
        fetch(url('/headline/test'), {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': cookie
            }
        }).then(res => res.json()).then(res => {
            // prestored in my mongodb database
            expect(res.username).toEqual('test');
            expect(res.headline).toEqual('Happy');
            done();
        });
    });

    it('should return articles with newly posted article: POST /article', (done) => {  
        let newArticle = {
            text: 'message'
        }
        fetch(url('/article'), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': cookie
            },
            body: JSON.stringify(newArticle)
        }).then(res => res.json()).then(res => {
            expect(res.articles[res.articles.length - 1].text).toEqual('message');
            done();
        });
    });

    it('should return all articles in the logged in user feed: GET /articles', (done) => { 
        fetch(url('/articles'), {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': cookie
            }
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toBeGreaterThan(0);
            done();
        });
    });

    it('should return an article with correct pid: GET /articles/id', (done) => {
        fetch(url('/articles/1'), {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': cookie
            }
        }).then(res => res.json()).then(res => {
            // prestored in my mongodb database
            expect(res.articles[0].author).toEqual("testUser1700016924684");
            done();
        });
    });

    it('should return all articles with correct author: GET /articles/id', (done) => {
        fetch(url('/articles/' + testUsername), {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': cookie
            }
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toBeGreaterThan(0);
            done();
        });
    });

    it('shoud logout the test user: PUT /logout', (done) => {
        fetch(url('/logout'), {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': cookie
            }
        }).then(res => {
            return res.text(); 
        }).then(body => {
            expect(body).toEqual("OK");
            done();
        });
    });

});
