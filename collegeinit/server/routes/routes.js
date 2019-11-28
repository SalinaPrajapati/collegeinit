var express = require('express');
var multer = require('multer');
var controllers = require('../controllers/controllers');
var data_controller = require('../controllers/dataController');
var auth = require('../middleware/auth');

//  multer destination file save at
var uploads = multer({
    dest: './public/uploads'
});
// end


var router = express.Router();
router.get('/:pid', controllers.indexPage);
router.get('/:name/profile=:cid', controllers.collegeProfile);
router.get('/:name/blog=:cid', controllers.blogProfile);
router.get('/:name/myprofile=:cid', controllers.userProfile);
router.get('/:name/:cid', function(req, res){
    res.redirect('/home')
});
router.get('/', function (req, res) {
    res.redirect('/home')
});
router.get('/logout/logout/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/home')
});
router.post('/signup/user/:user', controllers.userSignup);
// router.post('/admin/signup', controllers.adminSignup);
// router.post('/admin/login', controllers.adminLogin);
router.post('/user/login/:user', controllers.userLogin);

// searching text
router.get('/search/data/all', controllers.search);
// end
//all data controllers of the profile of college
router.get('/get/all/colleges', data_controller.getAllColleges);
router.get('/get/single/college/:collegeId', data_controller.getSingleCollege);

//posting profile information with image
router.post('/post/college/info/:collegeId', uploads.any(), data_controller.postCollegeInfo )

// updating logo
router.post('/post/college/logo/:collegeId', uploads.any(), data_controller.postCollegeLogo)

//filtering colleges according to courses
 router.get('/get/college/with/faculty/:course', data_controller.getCourse);

// end


//comments crud
router.get('/get/blog/all/comments/:blogId', data_controller.getComments);
router.post('/post/blog/comment/:blogId', data_controller.postBlogComment);
// end
//posting notice
router.post('/post/college/notice/:collegeId', data_controller.postCollegeNotice)
//getting all college notice
router.get('/get/all/notice/:collegeId', data_controller.getCollegeNotice);
router.delete('/delete/college/notice/:noticeId', data_controller.deleteCollegeNotice)


//posting about
router.post('/post/college/about/:collegeId', data_controller.postCollegeAbout);
//getting all college about info
router.get('/get/all/about/:collegeId', data_controller.getCollegeAbout);

//posting courses
router.post('/post/college/course/:collegeId', data_controller.postCollegeCourse);
//posting college courses information
router.post('/post/college/courseinfo/:collegeId', data_controller.postCollegeCoursesInfo);
//getting all college courses and course information
router.get('/get/all/courses/:collegeId', data_controller.getCollegeCourses);

//posting admission info
router.post('/post/college/admissioninfo/:collegeId', data_controller.postCollegeAdmissionInfo);
//posting scholarship info
router.post('/post/college/scholarshipinfo/:collegeId', data_controller.postCollegeScholarshipInfo);
//getting admission information
router.get('/get/all/admissioninfo/:collegeId', data_controller.getCollegeAdmissionInfo);
router.get('/get/all/scholarshipinfo/:collegeId', data_controller.getCollegeScholarshipInfo);
//posting college adnissions and scholarships
router.post('/post/college/scholarship/:collegeId', data_controller.postCollegeScholarship);
router.post('/post/college/admission/:collegeId', data_controller.postCollegeAdmission);
//getting admission and scholarship
router.get('/get/all/admission/:collegeId', data_controller.getCollegeAdmission);
router.get('/get/all/scholarship/:collegeId', data_controller.getCollegeScholarship);
//getting all blogs
router.get('/get/all/blog', data_controller.getBlogs);
//single blog for blog detais
router.get('/get/single/blog/:id', data_controller.getBlog);
//posting blogs
router.post('/post/user/blog/:userId', uploads.any(), data_controller.postCollegeLogo);



// /end of data control
module.exports = router;