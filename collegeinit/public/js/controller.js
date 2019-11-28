var app = angular.module('collegeinit', ['ngSanitize']);

app.directive('ckEditor', function () {
    return {
        require: '?ngModel',
        link: function ($scope, elm, attr, ngModel) {

            var ck = CKEDITOR.replace(elm[0]);

            ck.on('instanceReady', function () {
                ck.setData(ngModel.$viewValue);
            });

            ck.on('pasteState', function () {
                $scope.$apply(function () {
                    ngModel.$setViewValue(ck.getData());
                });
            });

            ngModel.$render = function (value) {
                ck.setData(ngModel.$modelValue);
            };
        }
    };
})



app.controller('homeController', function($scope, $interval, $timeout, $http){
    //search
         $scope.slogan1 = 'Search college, scholarship and Courses';
         $scope.slogan2 = 'Compare fee structure of any courses';
         $timeout(function(){
            $scope.slogan1 = 'Find, Upload notes of every levels.';
            $scope.slogan2 = 'Read and Write your own blog. Create an account now.'; 
         }, 10000)
         $timeout(function(){
            $scope.slogan1 = 'Every colleges can create their profile and maintain it.';
            $scope.slogan2 = 'Create your free account now and signup first.'; 
         }, 20000)
         $timeout(function(){
            $scope.slogan1 = 'Apply new scholorships and courses';
            $scope.slogan2 = 'Share your blog on facebook'; 
         }, 30000)
         $scope.searchUi = false;
        $scope.searchs = function(){
            $scope.searchUi = true;
            // window.location = ('/search?q='+$scope.search);
            $http.get('/search/data/all?q='+$scope.search).then(function(response){
                $scope.searchResponse = response.data;
                console.log(response.data);
            })
            
        }
    //end
        // getting data of colleges
        $http.get('/get/all/colleges').then(function(res){
             var colleges = res.data; 
             var pu_colleges = colleges.filter(function(college){
                 return college.board == 'Purbanchal University'
             })
             var pou_colleges = colleges.filter(function(college){
                 return college.board == 'Pokhara University' 
             });
             var tu_colleges = colleges.filter(function(college){
                return college.board == 'Tribhuvan University' 
            });
            var hseb = colleges.filter(function(college){
                return college.board == 'HSEB' 
            });
            var ctevt = colleges.filter(function(college){
                return college.board == 'CTEVT' 
            });
            var int_board = colleges.filter(function(college){
                return college.board == 'International Board' 
            });
            var ku_colleges = colleges.filter(function(college){
                return college.board == 'Kathmandu University' 
            });
            $scope.colleges = [
                {
                    collegesData : pu_colleges,
                    title: "Colleges with Purbanchal University",
                    id: 'carousel-1'
                },{
                    collegesData: pou_colleges,
                    title: 'Colleges With Pokhara University',
                    id: 'carousel-2'
                },
                {
                    collegesData: tu_colleges,
                    title: "Colleges with Tribhuvan University",
                    id: 'carousel-3'
                },
                {
                    collegesData : ku_colleges,
                    title: "Colleges With Kathmandu University",
                    id: 'carousel-4'
                },
                {
                    collegesData : int_board,
                    title: "Colleges With International Board",
                    id: 'carousel-5'
                },
                {
                    collegesData : hseb,
                    title: "Colleges With HSEB",
                    id: 'carousel-6'
                },
                {
                    collegesData : ctevt,
                    title: "Colleges With CTEVT",
                    id: 'carousel-7'
                }
            ]
             
        })
        //end
});

app.controller('signupController', function($scope, $interval, $timeout, $http){
    $scope.loading = false;
    $scope.signup_btn = true;
    $scope.signUp = function(user){
        const validData = $scope.user.name && $scope.user.username && $scope.user.password
        //  && $scope.user.contact && $scope.user.email && $scope.user.address;
        if(validData){
           $scope.signup_btn = false;
           $scope.loading = true;
            $http.post('/signup/user/'+user, $scope.user).then(function(response){
                $scope.loading = false;
                $scope.signup_btn = true;
                $scope.messageClass = 'alert-success';
                $scope.user = {}
                $scope.message = response.data;
                $timeout(function(){
                    $scope.message = null
                }, 5000);
            });
        }else{
            $scope.loading = false;
            $scope.signup_btn = true;
            $scope.messageClass = 'alert-danger';
            $scope.message = 'All field required for sign up.';
            $timeout(function(){
                $scope.message = null;
            }, 5000);
        }
    }
});

app.controller('loginController', function($scope, $interval, $timeout, $http){
    $scope.loading = false;
    $scope.signup_btn = true;
    $scope.logIn = function(type){
        const validData =  $scope.user.username && $scope.user.password;
        if(validData){
           $scope.signup_btn = false;
           $scope.loading = true;
            $http.post('/user/login/'+type, $scope.user).then(function(response){
                $scope.loading = false;
                $scope.signup_btn = true;
                if(response.data.loggedIn == true){
                     window.location = ('/home');
                }else{
                    $scope.messageClass = 'alert-danger';
                    $scope.user = {}
                    $scope.message = response.data.message;
                    $timeout(function(){
                        $scope.message = null
                    }, 5000);
                }
            });
        }else{
            $scope.loading = false;
            $scope.signup_btn = true;
            $scope.messageClass = 'alert-danger';
            $scope.message = 'Please provide credentials.';
            $timeout(function(){
                $scope.message = null;
            }, 5000);
        }
    }
});


app.controller('profileController', function($scope, $interval, $timeout, $http){
    function readURL1(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#backPicview').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    
   
    $("#backPic").change(function () {
        readURL(this);
    });

    $("#logo").change(function () {
        readURL1(this);
    });

    // page controller functions
    $scope.admissionPage = false;
    $scope.aboutPage = false;
    $scope.coursesPage = false;
    $scope.scholarshipPage = false;
    $scope.newsPage = true;
    $scope.news = function(){
        $scope.admissionPage = false;
        $scope.aboutPage = false;
        $scope.newsPage = true;
        $scope.coursesPage = false;
        $scope.scholarshipPage = false; 
    }
    $scope.about = function(){
        $scope.admissionPage = false;
        $scope.aboutPage = true;
        $scope.newsPage = false;
        $scope.coursesPage = false;
        $scope.scholarshipPage = false; 
    }
    $scope.courses = function(){
        $scope.admissionPage = false;
        $scope.aboutPage = false;
        $scope.coursesPage = true;
        $scope.newsPage = false;
        $scope.scholarshipPage = false; 
    }
    $scope.admission = function(){
        $scope.admissionPage = true;
        $scope.aboutPage = false;
        $scope.coursesPage = false;
        $scope.newsPage = false;
        $scope.scholarshipPage = false; 
    }
    $scope.scholarship = function(){
        $scope.admissionPage = false;
        $scope.aboutPage = false;
        $scope.coursesPage = false;
        $scope.newsPage = false;
        $scope.scholarshipPage = true; 
    }
    //loading college profile data
        $scope.loadProfile = function(id){
            $scope.signup_btn = true;
            $http.get('/get/single/college/'+id).then(function(response){
                $scope.user  = response.data;
             mapboxgl.accessToken =  'pk.eyJ1Ijoia2FtYWxzaGFoaTg5MTAiLCJhIjoiY2pwNmludXJjMTNmaDNvcDdpdDU0Z3VwOSJ9.TBq2M_d_jOH-RTZsMD6_tA';
            if (!response.data.location || response.data.location.lat==null) {  //if location is null
                var map1 = new mapboxgl.Map({
                    container: 'map1', // container id
                    style: 'mapbox://styles/mapbox/streets-v9',
                    center: [85.32218736312808, 27.692527008783514], // starting position
                    zoom: 12 // starting zoom
                });
                document.getElementById('lng').innerHTML = 85.32218736312808;
                document.getElementById('lat').innerHTML = 27.692527008783514;
                new mapboxgl.Marker()
                    .setLngLat([85.32218736312808, 27.692527008783514])
                    .addTo(map1);
                //     $scope.user.lng = response.data.location.lng; 
                //     $scope.user.lat = response.data.location.lat;
                //     document.getElementById('lng').innerHTML = response.data.location.lng;
                //    document.getElementById('lat').innerHTML = response.data.location.lat;
                 map1.on('click', function (e) {
                   document.getElementById('lng').innerHTML = JSON.stringify(e.lngLat.lng);
                   document.getElementById('lat').innerHTML = JSON.stringify(e.lngLat.lat);
                     $scope.user.lng = JSON.stringify(e.lngLat.lng);
                     $scope.user.lat = JSON.stringify(e.lngLat.lat);
                   new mapboxgl.Marker()
                       .setLngLat([parseFloat($scope.user.lng), parseFloat($scope.user.lat)])
                       .addTo(map);
                    });
            } else {  //if location is not null
                var map = new mapboxgl.Map({
                    container: 'map1', // container id
                    style: 'mapbox://styles/mapbox/streets-v9',
                    center: [parseFloat($scope.user.location.lng), parseFloat($scope.user.location.lat)], // starting position
                    zoom: 12 // starting zoom
                }); 
                new mapboxgl.Marker()
                    .setLngLat([parseFloat($scope.user.location.lng), parseFloat($scope.user.location.lat)])
                    .addTo(map);
                // for map on the given location
                    var map1 = new mapboxgl.Map({
                        container: 'map', // container id
                        style: 'mapbox://styles/mapbox/streets-v9',
                        center: [parseFloat($scope.user.location.lng), parseFloat($scope.user.location.lat)], // starting position
                        zoom: 15 // starting zoom
                    }); 
                    new mapboxgl.Marker()
                        .setLngLat([parseFloat($scope.user.location.lng), parseFloat($scope.user.location.lat)])
                        .addTo(map1);
                // end

                // //map on click
                //     $scope.user.lng = response.data.location.lng; 
                //     $scope.user.lat = response.data.location.lat;
                    document.getElementById('lng').innerHTML = response.data.location.lng;
                    document.getElementById('lat').innerHTML = response.data.location.lat;
                    map.on('click', function (e) {
                    document.getElementById('lng').innerHTML = JSON.stringify(e.lngLat.lng);
                    document.getElementById('lat').innerHTML = JSON.stringify(e.lngLat.lat);
                        $scope.user.lng = JSON.stringify(e.lngLat.lng);
                        $scope.user.lat = JSON.stringify(e.lngLat.lat);
                    new mapboxgl.Marker()
                        .setLngLat([parseFloat($scope.user.lng), parseFloat($scope.user.lat)])
                        .addTo(map);
                        });
                // end
            }
            
               
            
            //posting general info of colleges
              $scope.updateProfileInfo = function(id){
                    var formData = new FormData;
                    for (key in $scope.user) {
                        formData.append(key, $scope.user[key]);
                    }
                    var file = $('#backPic')[0].files[0];
                    if(file){
                        $scope.signup_btn = false;
                        $scope.loading = true;
                        formData.append('image', file);
                        $http.post('/post/college/info/' + id, formData, {
                            transformRequest: angular.identity,
                            headers: {
                                'Content-Type': undefined
                            }
                        }).then(function (res) {
                            if(res.data=='success'){
                                $('#addInfo').modal('hide'); 
                                $http.get('/get/single/college/'+id).then(function(response){
                                    $scope.user = response.data;
                                })                                                     
                                $scope.signup_btn = true;
                                $scope.loading = false;
                            }else{
                                $scope.signup_btn = true;
                                $scope.loading = false;
                                $scope.errorMessage = res.data;
                                $timeout(function(){
                                $scope.errorMessage =  null;
                                }, 4000) 
                            }
                        });
                    }else{
                        $scope.signup_btn = false;
                        $scope.loading = true;
                        $http.post('/post/college/info/' + id, $scope.user).then(function (res) {
                            if(res.data=='success'){
                                $('#addInfo').modal('hide'); 
                                $http.get('/get/single/college/'+id).then(function(response){
                                    $scope.user = response.data;
                                })                                                      
                                $scope.signup_btn = true;
                                $scope.loading = false;
                            }else{
                                $scope.signup_btn = true;
                                $scope.loading = false;
                                $scope.errorMessage = res.data;
                                $timeout(function(){
                                $scope.errorMessage =  null;
                                }, 4000) 
                            }
                        });
                    }
              }
            //   end
           });

    // })
       }
// logo update 
    $scope.updateLogo = function(id){
    var formData = new FormData;
    for (key in $scope.user) {
        formData.append(key, $scope.user[key]);
    }
    var file = $('#logo')[0].files[0];
    if(file){
        $scope.signup_btn = false;
        $scope.loading = true;
        formData.append('image', file);
        $http.post('/post/college/logo/' + id, formData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (res) {
            if(res.data=='success'){
                $('#addLogo').modal('hide'); 
                $http.get('/get/single/college/'+id).then(function(response){
                    $scope.user = response.data;
                })                                                     
                $scope.signup_btn = true;
                $scope.loading = false;
            }else{
                $scope.signup_btn = true;
                $scope.loading = false;
                $scope.errorMessage = res.data;
                $timeout(function(){
                $scope.errorMessage =  null;
                }, 4000) 
            }
        });
    }else{
        $scope.signup_btn = true;
        $scope.loading = false;
        $scope.errorMessage = "Please pick logo.";
        $timeout(function(){
            $scope.errorMessage =  null;
        }, 4000) 
    }
    }
// end
// load notice
   $scope.loadNotice = function(id){
       getAllNotice(id);
   }
// end
// notice publish
function getAllNotice(id){
    $http.get('/get/all/notice/'+id).then(function(response){
        $scope.college_notice = response.data;
    });
}
$scope.publishNotice = function(id){
    if($scope.notice.noticeTitle && $scope.notice.noticeBody){
        $scope.signup_btn = false;
        $scope.loading = true;
        $http.post('/post/college/notice/'+id, $scope.notice).then(function(res){
            if(res.data=='success'){
                $('#addNotice').modal('hide'); 
                getAllNotice(id);                                              
                $scope.signup_btn = true;
                $scope.loading = false;
                $scope.notice = null;
            }else{
                $scope.signup_btn = true;
                $scope.loading = false;
                $scope.errorMessage = res.data;
                $timeout(function(){
                $scope.errorMessage =  null;
                }, 4000) 
            }
        })
    }else{
        $scope.errorMessage = 'Both Field Required.'
        $timeout(function(){
            $scope.errorMessage = null;
        }, 4000)
    }
}
// end?
//delete notice
$scope.deleteNotice = function(id, uid){
    $scope.signup_btn = true;
    $scope.sure = function(){
        $http.delete('/delete/college/notice/'+id).then(function(res){
            if(res.data=='success'){
                $('#deleteNotice').modal('hide'); 
                getAllNotice(uid);                                              
                $scope.signup_btn = true;
                $scope.loading = false;
                $scope.notice = null;
            }else{
                $scope.signup_btn = true;
                $scope.loading = false;
                $scope.errorMessage = res.data;
                $timeout(function(){
                $scope.errorMessage =  null;
                }, 4000) 
            }
        })
    }
}
// end

//function that get about info
function getAllAbout(id){
    $http.get('/get/all/about/'+id).then(function(response){
        $scope.about_college = response.data;
    });
}
// end
$scope.loadAbout = function(id){
    getAllAbout(id);
}
//update about information
$scope.updateAbout = function(id){
        if($scope.about_data.aboutBody){
        $scope.signup_btn = false;
        $scope.loading = true;
        $http.post('/post/college/about/'+id,  $scope.about_data).then(function(res){
            if(res.data=='success'){
                $('#editInfo').modal('hide'); 
                getAllAbout(id);                                              
                $scope.signup_btn = true;
                $scope.loading = false;
                $scope.about_data = null;
            }else{
                $scope.signup_btn = true;
                $scope.loading = false;
                $scope.errorMessage = res.data;
                $timeout(function(){
                $scope.errorMessage =  null;
                }, 4000) 
            }
        })
    }else{
        $scope.errorMessage = 'Please enter something on text editor.'
        $timeout(function(){
            $scope.errorMessage = null;
        }, 4000)
    }
}
//end

//get all courses and info
function getCourseInfo(collegeId){
    $http.get('/get/all/courses/'+collegeId).then(function(response){
        $scope.courseData = response.data;
    });
}
//load course info
$scope.loadCourses = function(id){
    getCourseInfo(id);
}
//end
//end
//update courses info
$scope.updateCourseInfo = function(id){
    if($scope.courseInfo.courseBody){
    $scope.signup_btn = false;
    $scope.loading = true;
    $http.post('/post/college/courseinfo/'+id,  $scope.courseInfo).then(function(res){
        if(res.data=='success'){
            $('#updateCourseInfo').modal('hide'); 
            getCourseInfo(id);                                              
            $scope.signup_btn = true;
            $scope.loading = false;
            $scope.courseInfo = null;
        }else{
            $scope.signup_btn = true;
            $scope.loading = false;
            $scope.errorMessage = res.data;
            $timeout(function(){
            $scope.errorMessage =  null;
            }, 4000) 
        }
    })
}else{
    $scope.errorMessage = 'Please enter something on text editor.'
    $timeout(function(){
        $scope.errorMessage = null;
    }, 4000)
}
}
//end
//add courses
$scope.addCourse = function(id){
    $scope.signup_btn = false;
    $scope.loading = true;
    $http.post('/post/college/course/'+id,  $scope.course).then(function(res){
        if(res.data=='success'){
            $('#editCourse').modal('hide'); 
            getCourseInfo(id);                                              
            $scope.signup_btn = true;
            $scope.loading = false;
            $scope.course = null;
        }else{
            $scope.signup_btn = true;
            $scope.loading = false;
            $scope.errorMessage = res.data;
            $timeout(function(){
            $scope.errorMessage =  null;
            }, 4000) 
        }
    })
}
//end
    //load admission info function
    function getAdmissionInfo(id){
        $http.get('/get/all/admissioninfo/'+id).then(function(response){
            $scope.admission_info = response.data;
        });
    }
    // end
    //load scholarship info function
    function getScholarshipInfo(id){
        $http.get('/get/all/scholarshipinfo/'+id).then(function(response){
            $scope.scholarship_info = response.data;
        });
    }
    // end
    //load scholarship and admission info
    $scope.loadAdmissionInfo = function(id){
        getAdmissionInfo(id);
    }
    $scope.loadScholarshipInfo = function(id){
        getScholarshipInfo(id);
    }
    //end
        //update admission info
        $scope.updateAdmissionInfo = function(id){
            $scope.signup_btn = false;
            $scope.loading = true;
            $http.post('/post/college/admissioninfo/'+id,  $scope.admissionInfo).then(function(res){
                if(res.data=='success'){
                    $('#editInfo').modal('hide'); 
                    getAdmissionInfo(id);                                              
                    $scope.signup_btn = true;
                    $scope.loading = false;
                    $scope.admissionInfo = null;
                }else{
                    $scope.signup_btn = true;
                    $scope.loading = false;
                    $scope.errorMessage = res.data;
                    $timeout(function(){
                    $scope.errorMessage =  null;
                    }, 4000) 
                }
            })
        }
        //end
        //update scholarship info
        $scope.updateScholarshipInfo = function(id){
            $scope.signup_btn = false;
            $scope.loading = true;
            $http.post('/post/college/scholarshipinfo/'+id,  $scope.scholarshipInfo).then(function(res){
                if(res.data=='success'){
                    $('#updateScholarship').modal('hide'); 
                    getScholarshipInfo(id);                                              
                    $scope.signup_btn = true;
                    $scope.loading = false;
                    $scope.scholarshipInfo = null;
                }else{
                    $scope.signup_btn = true;
                    $scope.loading = false;
                    $scope.errorMessage = res.data;
                    $timeout(function(){
                    $scope.errorMessage =  null;
                    }, 4000) 
                }
            })
        }
        //end


                //load admission function
            function getAdmission(id){
                $http.get('/get/all/admission/'+id).then(function(response){
                    $scope.admission = response.data;
                });
            }
            // end
            //load scholarship info function
            function getScholarship(id){
                $http.get('/get/all/scholarship/'+id).then(function(response){
                    $scope.scholarship = response.data;
                });
            }
            // end
            //load scholarship and admission info
            $scope.loadAdmission = function(id){
                getAdmission(id);
            }
            $scope.loadScholarship = function(id){
                getScholarship(id);
            }
            //end

            //add scholarship
        $scope.addScholarship = function(id){
            $scope.signup_btn = false;
            $scope.loading = true;
            $http.post('/post/college/scholarship/'+id,  $scope.scholarship_data).then(function(res){
                if(res.data=='success'){
                    $('#addScholarship').modal('hide'); 
                    getScholarship(id);                                              
                    $scope.signup_btn = true;
                    $scope.loading = false;
                    $scope.scholarship_data = null;
                }else{
                    $scope.signup_btn = true;
                    $scope.loading = false;
                    $scope.errorMessage = res.data;
                    $timeout(function(){
                    $scope.errorMessage =  null;
                    }, 4000) 
                }
            })
        }
        //end
          //add admission
          $scope.addAdmission = function(id){
            $scope.signup_btn = false;
            $scope.loading = true;
            $http.post('/post/college/admission/'+id,  $scope.admission_data).then(function(res){
                if(res.data=='success'){
                    $('#addAdmission').modal('hide'); 
                    getAdmission(id);                                              
                    $scope.signup_btn = true;
                    $scope.loading = false;
                    $scope.admission_data = null;
                }else{
                    $scope.signup_btn = true;
                    $scope.loading = false;
                    $scope.errorMessage = res.data;
                    $timeout(function(){
                    $scope.errorMessage =  null;
                    }, 4000) 
                }
            })
        }
        //end

  
});



app.controller('collegeController', function($scope, $interval, $timeout, $http){
    $scope.getCourses  = function(course){
        $http.get('/get/college/with/faculty/'+course).then(function(resp){
        $scope.collegesData = resp.data;
        console.log(resp.data);
        })
    }
    $scope.all_college = true;
    $scope.compare_fee = false;
    $scope.nearby_college = false;
    $scope.allCollege = function(){
        $scope.all_college = true;
        $scope.compare_fee = false;
        $scope.nearby_college = false;
    }
    $scope.feeCompare = function(){
        $scope.all_college = false;
        $scope.compare_fee = true;
        $scope.nearby_college = false;
    }
    $scope.nearbyCollege = function(){
        $scope.all_college = false;
        $scope.compare_fee = false;
        $scope.nearby_college = true;
    }
    $http.get('/get/all/colleges').then(function(res){
        $scope.colleges = res.data;
        console.log(res.data);
        
    });
})

app.controller('blogController', function($scope, $interval, $timeout, $http){
    $scope.blog_editor = false;
    $scope.write_btn = true;
    $scope.writeBlog = function(){
        $scope.blog_editor = true;
        $scope.write_btn = false;
    }
    $scope.cancelBlog_wr = function(){
        $scope.blog_editor = false;
        $scope.write_btn = true;
    }
    // category of the bLOGposts
    $scope.navElements = [{
        name: 'Education',
        id: 'education'
      },{
        name: 'Motivation',
        id: 'motivation'
      },{
        name: 'Experiences',
        id: 'experience'
      },{
        name: 'Entertaintment',
        id: 'entertaintment'
      },{
        name: 'Bussiness',
        id: 'bussiness'
      },{
        name: 'Careers',
        id: 'careers'
      },{
        name: 'Sports',
        id: 'sports'
      },{
        name: 'Health',
        id: 'health'
      },{
        name: 'Shopping',
        id: 'shopping'
      },{
        name: 'Technology',
        id: 'technology'
      },{
        name: 'Travel',
        id: 'travel'
      },{
        name: 'Relationship',
        id :'relationship'
      },{
        name: 'Addiction',
        id: 'addiction'
      },{
        name: 'Animals',
        id: 'animal'
      },{
        name: 'Family',
        id: 'family'
      },{
        name: 'Hobbies',
        id: 'hobbies'
      },{
        name: 'Others',
        id: 'others'
      }
    ];
    // end
    function getBlogs(){
        $http.get('/get/all/blog').then(function(res){
           $scope.blogDatas = res.data
        });
    }
    $scope.loadBlog  = function(){
        getBlogs();
    }
    $scope.signup_btn = true;
    $scope.postBlog = function(id){
     var formData = new FormData;
    for (key in $scope.blog) {
        formData.append(key, $scope.blog[key]);
    }
    var file = $('#blogImage')[0].files[0];
    var validData = $scope.blog.blog_title && $scope.blog.blog_body && $scope.blog.blog_category && file;
    if(validData){
            if($scope.blog.blog_body.length < 600){
                $scope.errorMessage = "Blog Body must be over 600 char.";
                $timeout(function(){
                $scope.errorMessage =  null;
                }, 4000) 
            }else{
                $scope.signup_btn = false;
                $scope.loading = true;
                formData.append('image', file);
                $http.post('/post/user/blog/' + id, formData, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }).then(function (res) {
                    if(res.data=='success'){
                        $scope.signup_btn = true;
                        $scope.loading = false;
                        $scope.successMessage = "Successfully posted.";
                        $scope.blog = null;
                        $timeout(function(){
                        $scope.successMessage =  null;
                        }, 4000) 
                    }else{
                        $scope.signup_btn = true;
                        $scope.loading = false;
                        $scope.errorMessage = res.data;
                        $timeout(function(){
                        $scope.errorMessage =  null;
                        }, 4000) 
                    }
                });
        }
      
    }else{
        $scope.signup_btn = true;
        $scope.loading = false;
        $scope.errorMessage = "All Field Required";
        $timeout(function(){
            $scope.errorMessage =  null;
        }, 4000) 
    }
        
    }
})



app.controller('blogProfileController', function($scope, $interval, $timeout, $http){
    function getBlog(id){
        $http.get('/get/single/blog/'+id).then(function(res){
           $scope.blogData = res.data
           console.log(res.data);
        });
        $http.get('/get/blog/all/comments/'+id).then(function(res){
            $scope.comments = res.data;
        })
    }

    $scope.loadBlog  = function(id){
        getBlog(id);
    }  

    $scope.postComment = function(blogId){
        $http.post('/post/blog/comment/'+blogId, $scope.comment).then(function(response){
            $scope.message = response.data;
            $scope.comment = {}
            $timeout(function(){
                $scope.message = '';
            }, 3000);
            getBlog(blogId);
        })
    }
})