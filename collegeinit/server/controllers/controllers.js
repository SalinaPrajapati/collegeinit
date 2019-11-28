var models = require('../models/models');
var textSearch = require('mongoose-text-search');
exports.indexPage = function (req, res) {
    var params = req.params.pid
    var  notLoggedIn = params == 'home' || params == 'search' || params == 'colleges'|| params == 'blogs' || params == 'location' || params == 'major' || params == 'notes' || params == 'about-us' || params == 'login' || params == 'signup';
    var loggedIn = params == 'home'  || params == 'search' || params == 'blogs' || params == 'colleges' || params == 'location' || params == 'major' || params == 'notes' || params == 'about-us'
    if(req.session.loginStatus == true || req.session.userLoginStatus == true){ //if logged in
        if (loggedIn) {
            res.render('index', {
                pid: req.params.pid,
                pTitle: req.params.pid,
                loginStatus: req.session.loginStatus,
                userLoginStatus: req.session.userLoginStatus,
                userData: req.session.userData
            })
        } else {
            res.redirect('/home')
        }
    } else{ //if not logged in
        if (notLoggedIn) {
            res.render('index', {
                pid: req.params.pid,
                pTitle: req.params.pid,
                loginStatus: req.session.loginStatus,
                userLoginStatus: req.session.userLoginStatus,
                userData: req.session.userData
            })
        } else {
            res.render('error');
        }
    }
    
}

//college profile page
exports.collegeProfile = function(req, res){
    models.User.findOne({_id: req.params.cid, slug: req.params.name}, function(err, response){
      if(err){
          res.render('error')
      }else if(!response){
        res.redirect('/home')
      }else{
        res.render('collegeProfile', {
            pid: req.params.name,
            pTitle: response.name,
            loginStatus: req.session.loginStatus,
            userLoginStatus: req.session.userLoginStatus,
            userData: req.session.userData,
            profileData: response
        }) 
      }
    });
}
//end
//blog profile page
exports.blogProfile = function(req, res){
    models.Blog.findOne({_id: req.params.cid, slug: req.params.name}, function(err, response){
      if(err){
          res.render('error')
      }else if(!response){
        res.redirect('/home')
      }else{
        models.Blog.findById(req.params.cid, function(err, resp){
            models.Blog.findByIdAndUpdate(req.params.cid, {views: resp.views+1}, function(err, respo){
                res.render('blogProfile', {
                    pid: req.params.name,
                    pTitle: response.name,
                    loginStatus: req.session.loginStatus,
                    userData: req.session.userData,
                    userLoginStatus: req.session.userLoginStatus,
                    profileData: response
                })
            })
        })   
      }
    });
}

//end
// user profile
exports.userProfile = function(req, res){
    models.NormalUser.findOne({_id: req.params.cid, slug: req.params.name}, function(err, response){
      if(err){
          res.render('error')
      }else if(!response){
        res.redirect('/home')
      }else{
        res.render('userProfile', {
            pid: req.params.name,
            pTitle: response.name,
            loginStatus: req.session.loginStatus,
            userData: req.session.userData,
            userLoginStatus: req.session.userLoginStatus,
            profileData: response
        }) 
      }
    });
}
// end
exports.userSignup = function (req, res) {
    var userData = req.body;
    const valid_data = userData.name && userData.username && userData.password 
    // && userData.contact && userData.email && userData.address;
    if (valid_data) {
        if(req.params.user=='college'){
            var data = models.User({
                name: userData.name,
                username: userData.username,
                password: userData.password,
                contact: userData.contact,
                email: userData.email,
                slug: userData.name.split(' ').join('.'),
                address: userData.address,
                created: Date.now()
            });
            data.save(function (err, response) {
                if (err) {
                    res.send('Data inserted are already in used.')
                } else {
                    res.send(response.name +' Signup Successful.')
                }
            });
        }else{
            var data = models.NormalUser({
                name: userData.name,
                password: userData.password,
                username: userData.username,
                slug: userData.name.split(' ').join('.'),
                created: Date.now()
            });
            data.save(function (err, response) {
                if (err) {
                    res.send('Data inserted are already in used.')
                } else {
                    res.send(response.name +' Signup Successful.')
                }
            });
        }
    } else {
        // console.log(req.body);
        res.send('All field required')
    }
};

// exports.blog

exports.userLogin = function (req, res) {
    console.log(req.params.user);
    if(req.params.user=='college'){
        models.User.findOne({
            username: req.body.username,
            password: req.body.password
        }, function (err, response) {
            if (err) {
                req.session.loginStatus = false;
                req.session.userLoginStatus = false,
                req.session.userData = null;
                res.json({loggedIn: false, message: 'Server error. try again'})
            } else if (response) {
                req.session.loginStatus = true;
                req.session.userLoginStatus = false,
                req.session.userData = response;
                res.json({loggedIn: true, message: null})
            } else {
                req.session.loginStatus = false;
                req.session.userLoginStatus = false,
                req.session.userData = null;
                res.json({loggedIn: false, message: 'username password mismatch.'})
            }
        });
    }else{
        models.NormalUser.findOne({
            username: req.body.username,
            password: req.body.password
        }, function (err, response) {
            if (err) {
                req.session.loginStatus = false;
                req.session.userLoginStatus = false,
                req.session.userData = null;
                res.json({loggedIn: false, message: 'Server error. try again'})
            } else if (response) {
                req.session.loginStatus = false;
                req.session.userLoginStatus = true,
                req.session.userData = response;
                res.json({loggedIn: true, message: null})
            } else {
                req.session.loginStatus = false;
                req.session.userLoginStatus = false,
                req.session.userData = null;
                res.json({loggedIn: false, message: 'username password mismatch.'})
            }
        });
    }
}

// exports.adminSignup = function (req, res) {
//     var adminData = req.body;
//     if (adminData.email && adminData.password) {
//         var datas = models.Admin({
//             email: adminData.email,
//             password: adminData.password
//         });
//         datas.save(function (err, resp) {
//             if (err) {
//                 res.send('Error')
//             } else {
//                 res.send('Signup Successfully.')
//             }
//         });
//     } else {
//         res.send('All field required.')
//     }
// }
 exports.search = function(req, res){
    // { text: "courses", search: { title: /bachelor/i, text: /bachelor/i }
    models.Course.find({$text: {$search: req.query.q, $language: 'en'}}).populate('userId').exec((error, results) =>{ 
        // if(error){
            if(results.length == 0){
                models.User.find({$text: {$search: req.query.q, $language: 'en'}}, (error, result) =>{ 
                    if(error){
                        // console.log(error);
                        res.send('error')
                    }else{
                        res.send(result);
                    }
                    
                })
            }else{
                res.send(results)
            }
        // }
    })
   
    // var regexQuery = {
    //     course_name: new RegExp(req.query.q, 'i'),
    //     short_name: new RegExp(req.query.q, 'i')
    //   }
    //   models.Course.find(regexQuery, function(err, foundResponses){
    //       if(err){
    //           console.log(err);
              
    //       }
    //      console.log(foundResponses);
         
    //   })
    // models.Course.textSearch(regexQuery, function (err, output) {
    //     if (err) {
    //     //    console.log(err)
    //     }else{
    //         console.log(output);
    //     }
         
         
    //     // var inspect = require('util').inspect;
    //     // console.log(inspect(output, { depth: null }));
     
    //     // { queryDebugString: '3d||||||',
    //     //   language: 'english',
    //     //   results:
    //     //    [ { score: 1,
    //     //        obj:
    //     //         { name: 'Super Mario 64',
    //     //           _id: 5150993001900a0000000001,
    //     //           __v: 0,
    //     //           tags: [ 'nintendo', 'mario', '3d' ] } } ],
    //     //   stats:
    //     //    { nscanned: 1,
    //     //      nscannedObjects: 0,
    //     //      n: 1,
    //     //      nfound: 1,
    //     //      timeMicros: 77 },
    //     //   ok: 1 }
    //   });
}
// exports.adminLogin = function (req, res) {
//     models.Admin.findOne({
//         email: req.body.email,
//         password: req.body.password
//     }, function (err, response) {
//         if (err) {
//             res.send('Error')
//         } else if (response) {
//             res.send('Logged in')
//         } else {
//             res.json({
//                 message: 'Email, password mismatch',
//                 response: response
//             })
//         }
//     })
// }