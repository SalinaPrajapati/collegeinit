var models = require('../models/models');
var fs = require('fs');
// getting all colleges registered
exports.getAllColleges = function(req, res){
    models.User.find({}, { password: 0 }, function(err, response){
        if(err){  //if error occured
            res.send('Error on fetching colleges');
        }else{  //if success
            res.send(response);
        }
    })
}
// end 

// getting single college registered
exports.getSingleCollege = function(req, res){
    models.User.findById(req.params.collegeId, function(err, response){
        if(err){  //if error occured
            res.send('Error on fetching college.');
        }else{  //if success
            res.send(response);
        }
    })
}
// end 

//saving profile info of colleges with image
exports.postCollegeInfo = function(req, res){
    if(req.files){  //if file present
        req.files.forEach(function (file) {
            var filename = (new Date).valueOf() + '-' + file.originalname;
            fs.rename(file.path, './public/uploads/' + filename, function (err) {
                // if (err) {
                //     res.send('File data error. Try again');
                //     console.log(err);
                    
                // } else {
                    // console.log('requested f' + req.files);
                    var data = req.body;
                    models.User.findByIdAndUpdate(data._id, {
                        name: data.name,
                        username: data.username,
                        password: data.password,
                        email: data.email,
                        contact: data.contact,
                        slug: data.name.split(' ').join('.'),
                        // later updated
                        established: data.established,
                        board: data.board,
                        optional_contact: data.optional_contact,
                        Website: data.Website,
                        facebook_link: data.facebook_link,
                        background_image: filename,
                        location: {
                            lat: data.lat,
                            lng: data.lng
                        }
                    },function (err, response) {
                        if (err) {
                            res.send('File data error. Try again');
                            console.log(err);
                            
                        } else {
                            res.send('success');
                        }
                    });
            })
        });
    }else{  //if file not present
        var data = req.body;
        models.User.findByIdAndUpdate(data._id, {
            name: data.name,
            username: data.username,
            password: data.password,
            email: data.email,
            contact: data.contact,
            slug: data.name.split(' ').join('.'),
            // later updated
            established: data.established,
            board: data.board,
            optional_contact: data.optional_contact,
            website: data.website,
            facebook_link: data.facebook_link,
            location: {
                lat: data.lat,
                lng: data.lng
            }
        },function (err, response) {
            if (err) {
                res.send('Invalid data. Try again');
            } else {
                res.send('success');
            }
        });
    }
}
//end
//saving college logo
exports.postCollegeLogo = function(req, res){
    if(req.files){  //if file present
        req.files.forEach(function (file) {
            var filename = (new Date).valueOf() + '-' + file.originalname;
            fs.rename(file.path, './public/uploads/' + filename, function (err) {
                    var data = req.body;
                    models.User.findByIdAndUpdate(data._id, {
                        logo: filename,
                    },function (err, response) {
                        if (err) {
                            res.send('File data error. Try again');
                        } else {
                            res.send('success');
                        }
                    });
            })
        });
    }else{
        res.send('Please select file.')
    }
}
// end

//posting notice
exports.postCollegeNotice = function(req, res){
    if(req.body.noticeTitle && req.body.noticeBody){
        var notice = models.Notice({
            noticeTitle: req.body.noticeTitle,
            noticeBody: req.body.noticeBody,
            created: Date.now(),
            userId: req.params.collegeId
        });
        notice.save(function(err, response){
            if(err){
                res.send("error on posting notice.")
            }else{
                res.send('success');
            }
        })
    }else{
        res.send('All field required.')
    }
    
}
// end
// delete college notice
exports.deleteCollegeNotice = function(req, res){
    models.Notice.findByIdAndDelete(req.params.noticeId, function(err, response){
        if(err){
            res.send('error on deleting notice');
        }else{
            res.send('success')
        }
    })
}
// end

exports.getCollegeNotice = function(req, res){
  models.Notice.find({userId: req.params.collegeId}, function(err, response){
      if(err){
          res.send('error on fetching notice')
      }else{
          res.send(response);
      }
  });
}

//posting about
exports.postCollegeAbout = function(req, res){
    console.log(req.body);
    if(req.body.aboutBody){
        models.About.findOne({userId: req.params.collegeId}, function(err, resp){
            if(!resp){
                var about = models.About({
                    aboutBody: req.body.aboutBody,
                    created: Date.now(),
                    userId: req.params.collegeId
                });
                about.save(function(err, response){
                    if(err){
                        res.send("error on posting about info.")
                    }else{
                        res.send('success');
                    }
                })
            }else{
                models.About.findOneAndUpdate({userId: req.params.collegeId}, {
                    aboutBody: req.body.aboutBody,
                    created: Date.now(),
                    userId: req.params.collegeId
                }, function(err, response){
                    if(err){
                        res.send("error on updating about info.")
                    }else{
                        res.send('success');
                    }
                })
            }
        })
    }else{
        res.send('Please write something on editor.')
    }
    
}
// end
// getting college about info
exports.getCollegeAbout = function(req, res){
  models.About.find({userId: req.params.collegeId}, function(err, response){
      if(err){
          res.send('error on fetching about Info')
      }else{
          res.send(response);
      }
  });
}
// end

//posting college courses
exports.postCollegeCourse = function(req, res){
    var courseInfo = req.body;
    var validData = courseInfo.course_name && courseInfo.short_name && courseInfo.course_duration && courseInfo.total_fee &&
    courseInfo.student_seats && courseInfo.course_faculty;
    if(validData){
        var course = models.Course({
             course_name: courseInfo.course_name,
             short_name :courseInfo.short_name,
             course_duration: courseInfo.course_duration,
             total_fee: courseInfo.total_fee,
             student_seats: courseInfo.student_seats,
             course_faculty: courseInfo.course_faculty,
             created: Date.now(),
             userId: req.params.collegeId
        });
        course.save(function(err, response){
            if(err){
                res.send("error on posting course.")
            }else{
                res.send('success');
            }
        })
    }else{
        res.send('Please fill all field.')
    }
    
}
// end

//posting course information
exports.postCollegeCoursesInfo = function(req, res){
    if(req.body.courseBody){
       models.CourseInfo.findOne({userId: req.params.collegeId}, function(err, resp){
           if(!resp){
            var course = models.CourseInfo({
                courseBody: req.body.courseBody,
                created: Date.now(),
                userId: req.params.collegeId
            });
            course.save(function(err, response){
                if(err){
                    res.send("error on posting courses info.")
                }else{
                    res.send('success');
                }
            })
           }else{
               models.CourseInfo.findOneAndUpdate({userId: req.params.collegeId}, {
                    courseBody: req.body.courseBody,
                    created: Date.now(),
                    userId: req.params.collegeId
               }, function(err, response){
                if(err){
                    res.send("error on updating courses info.")
                }else{
                    res.send('success');
                }
               })
           }
       })
    }else{
        res.send('Please write something on editor.')
    }
    
}
// end

// getting college courses, courses info
exports.getCollegeCourses = function(req, res){
    models.Course.find({userId: req.params.collegeId}, function(err, response){
        if(err){
            res.send('error on fetching courses')
        }else{
            models.CourseInfo.findOne({userId: req.params.collegeId}, function(err, courseInfo){
                if(err){
                    res.send('error on fetching courses Info')
                }else{
                    res.send({courses: response, courseInfo: courseInfo});
                }
            });
        }
    });
  }
  // end


  //posting admission information
exports.postCollegeAdmissionInfo = function(req, res){
    if(req.body.admissionBody){
       models.AdmissionInfo.findOne({userId: req.params.collegeId}, function(err, resp){
           if(!resp){
            var admission = models.AdmissionInfo({
                admissionBody: req.body.admissionBody,
                created: Date.now(),
                userId: req.params.collegeId
            });
            admission.save(function(err, response){
                if(err){
                    res.send("error on posting admission info.")
                }else{
                    res.send('success');
                }
            })
           }else{
               models.AdmissionInfo.findOneAndUpdate({userId: req.params.collegeId}, {
                    admissionBody: req.body.admissionBody,
                    created: Date.now(),
                    userId: req.params.collegeId
               }, function(err, response){
                if(err){
                    res.send("error on updating admission info.")
                }else{
                    res.send('success');
                }
               })
           }
       })
    }else{
        res.send('Please write something on editor.')
    }
    
}
// end

//posting scholarship info
exports.postCollegeScholarshipInfo = function(req, res){
    if(req.body.scholarshipBody){
       models.ScholarshipInfo.findOne({userId: req.params.collegeId}, function(err, resp){
           if(!resp){
            var scholarship = models.ScholarshipInfo({
                scholarshipBody: req.body.scholarshipBody,
                created: Date.now(),
                userId: req.params.collegeId
            });
            scholarship.save(function(err, response){
                if(err){
                    res.send("error on posting scholarship info.")
                }else{
                    res.send('success');
                }
            })
           }else{
               models.ScholarshipInfo.findOneAndUpdate({userId: req.params.collegeId}, {
                   scholarshipBody: req.body.scholarshipBody,
                    created: Date.now(),
                    userId: req.params.collegeId
               }, function(err, response){
                if(err){
                    res.send("error on updating scholarship info.")
                }else{
                    res.send('success');
                }
               })
           }
       })
    }else{
        res.send('Please write something on editor.')
    }
    
}
// end

// getting college admission info
exports.getCollegeAdmissionInfo = function(req, res){
    models.AdmissionInfo.findOne({userId: req.params.collegeId}, function(err, response){
        if(err){
            res.send('error on fetching admission Info')
        }else{
            res.send(response);
        }
    });
  }
  // end
  // getting college about info
exports.getCollegeScholarshipInfo = function(req, res){
    models.ScholarshipInfo.findOne({userId: req.params.collegeId}, function(err, response){
        if(err){
            res.send('error on fetching scholarship Info')
        }else{
            res.send(response);
        }
    });
  }
  // end

  //posting college scholarships
exports.postCollegeScholarship = function(req, res){
    var courseInfo = req.body;
    var validData = courseInfo.scholarship_name && courseInfo.can_apply;
    if(validData){
        var course = models.Scholarship({
            scholarship_name: courseInfo.scholarship_name,
            can_apply :courseInfo.can_apply,
             created: Date.now(),
             userId: req.params.collegeId
        });
        course.save(function(err, response){
            if(err){
                res.send("error on posting scholarship.")
            }else{
                res.send('success');
            }
        })
    }else{
        res.send('Please fill all field.')
    }
    
}
// end
//posting college admission
exports.postCollegeAdmission = function(req, res){
    var courseInfo = req.body;
    var validData = courseInfo.admission_name && courseInfo.open_date && courseInfo.close_date 
    if(validData){
        var course = models.Admission({
            admission_name: courseInfo.admission_name,
            open_date :courseInfo.open_date,
            close_date :courseInfo.close_date,
             created: Date.now(),
             userId: req.params.collegeId
        });
        course.save(function(err, response){
            if(err){
                res.send("error on posting admisssion.")
            }else{
                res.send('success');
            }
        })
    }else{
        res.send('Please fill all field.')
    }
    
}
// end
//get college admission
exports.getCollegeAdmission = function(req, res){
    models.Admission.find({userId: req.params.collegeId}, function(err, response){
        if(err){
            res.send('error on fetching admisssion')
        }else{
            res.send(response);
        }
    });
  }
  // end
  //get college scholarship
exports.getCollegeScholarship = function(req, res){
    models.Scholarship.find({userId: req.params.collegeId}, function(err, response){
        if(err){
            res.send('error on fetching scholarship')
        }else{
            res.send(response);
        }
    });
  }
  // end
  //getting all blogs
  exports.getBlogs = function(req, res){
    models.Blog.find({}, 'blog_title blog_body image created views _id slug').sort({created: -1}).populate('author')
    .exec(function(err, response){
        if(err){
            res.send('error on fetching scholarship');
        }else{
           models.Comment.find({blogId: response._id}, function(err, comment){
               if(err){
                   res.send('Error on comment')
               }else{
                 var blogsData = new Array();
                 for(var i = 0;i < response.length; i++){
                    blogsData[i] = {
                        blog_title: response[i].blog_title,
                        blog_body: response[i].blog_body,
                        image: response[i].image,
                        created: response[i].created,
                        _id: response[i]._id,
                        slug: response[i].slug,
                        views: response[i].views,
                        commentCount: comment.length,
                        author_name: response[i].author.name
                    }
                }
                res.send(blogsData);
               }
           });
        }
    });
  }
//   end>

//posting blog
// exports.postCollegeLogo = function(req, res){
//     console.log(req.files);
//     console.log(req.body);
//     if(req.files && req.body.blog_title && req.body.blog_body && req.body.blog_category){
//         req.files.forEach(function (file) {
//             var filename = (new Date).valueOf() + '-' + file.originalname;
//             fs.rename(file.path, './public/uploads/' + filename, function (err) {
//                 var data = models.Blog({
//                     image: filename,
//                     blog_title: req.body.blog_title,
//                     blog_category: req.body.blog_category,
//                     blog_body:req.body.blog_body,
//                     author: req.params.userId,
//                     slug: req.body.blog_title.split(' ').join('-'),
//                     created: Date.now()
//                 })
//                     data.save(function (err, response) {
//                         if (err) {
//                             res.send('File data error. Try again');
//                             console.log(err);
//                         } else {
//                             res.send('success');
//                         }
//                     });
//             })
//         });
//     }else{
//         res.send('All field required to post blog')
//     }
// }
//end
//getting blog by id
exports.getBlog = function(req, res){
    models.Blog.findById(req.params.id).populate('author').exec( function(err, response){
        if(err){
            res.send("error on fetching")
            // console.log(err);
            
        }else{
            res.send(response)
        }
    })
}
// end

exports.postBlogComment = function(req, res){
    const comment_data = req.body;
      if(comment_data.name && comment_data.email && comment_data.comment_body){
        var comments = models.Comment({
            user: {
                name: comment_data.name,
                email: comment_data.email
              },
              blogId: req.params.blogId,
              comment_body: comment_data.comment_body,
              created: Date.now(),
        });
        comments.save(function(err, response){
            if(err){
                res.send('Error on posting comment')
            }else{
                res.send('Posted comment.')
            }
        })
      }else{
        res.send('All field required')
      }
 }

 exports.getComments = function(req, res){
     models.Comment.find({blogId: req.params.blogId}, function(err, response){
         if(err){
             res.send('Error on getting comments')
         }else{
             res.send(response)
         }
     })
 }

 exports.editComment = function(req, res){
     models.Comment.findById(function(err, response){
         if(err){
             res.send('error on editing')
         }else{
             res.send(response)
         }
     })
 }

 exports.updateComment = function(req, res){
     models.Comment.findByIdAndUpdate(req.params.id,  function(err, response){
         if(err){
             res.send('Error on updating')
       }else{
         res.send('Comment updated')
     }
    })
 }
 exports.deleteComment = function(req, res){
    models.Comment.findByIdAndDelete(req.params.id,  function(err, response){
        if(err){
            res.send('Error on deleting')
      }else{
        res.send('Comment deleted')
    }
   })
}


//filtering cources
exports.getCourse = function(req, res){
    models.Course.find({short_name: req.params.course}).populate('userId').exec(function(err, response){
        if(err){
            res.send('Error')
        }else{
            res.send(response)
        }
    })
}
//end
