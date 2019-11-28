var mongoose = require('mongoose');
const searchable = require('mongoose-regex-search');
var textSearch = require('mongoose-text-search');
// mongoose.connect(url, option, callback);
const url = 'mongodb://localhost:27017/collegeinit';
    mongoose.connect(url, {
        useNewUrlParser: true
    }).then(function (err) {
        console.log("connected db");
    });
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

// user schema
var user = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: Number,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    slug: String,
    created: Date,
    // later updated
    established: String,
    board: String,
    optional_contact: Number,
    website: String,
    facebook_link: String,
    background_image: String,
    logo: String,
    location: {
        lat: String,
        lng: String
    }
});
user.plugin(textSearch);
user.plugin(searchable);
user.index({name: 'text', board: 'text'});
user.plugin(uniqueValidator);
exports.User = mongoose.model('User', user);
// end
// admin schema
var admin = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
user.plugin(uniqueValidator);
exports.Admin = mongoose.model('Admin', admin);
// end
// notice and news
var notice = new Schema({
    noticeTitle: {
        type: String,
        require: true
    },
    noticeBody: {
        type: String,
        require: true
    },
    created: Date,
    userId: {
        type: String,
        ref: 'User'
    }
})
exports.Notice = mongoose.model('Notice', notice);
// end
// about schema
var about = new Schema({
    aboutBody: {
        type: String,
        require: true
    },
    created: Date,
    userId: {
        type: String,
        ref: 'User'
    }
})
exports.About = mongoose.model('About', about);
// end

// course schema
var course = new Schema({
    course_name: {
        type: String,
        require: true
    },
    short_name: {
        type: String,
        required: true
    },
    course_duration: {
        type: Number,
        required: true
    },
    total_fee: {
        type: Number,
        required: true
    },
    student_seats: {
        type: Number,
        required: true
    },
    course_faculty: {
        type: String,
        require: true
    },
    created: Date,
    userId: {
        type: String,
        ref: 'User'
    }
})
course.plugin(textSearch);
course.plugin(searchable);
course.index({course_name: 'text', short_name: 'text'});
 const Gg = exports.Course = mongoose.model('Course', course)
//  Gg.search('purbanchal', (error, results) => { console.log(results);
//   });
// var schema = new Schema({
//     name: String,
//     email: String,
//     profile: {
//       something: String,
//       somethingElse: String
//     }
//   });
//   schema.index({name: 'text', 'profile.something': 'text'});
// schema.index({'$**': 'text'});
// end

// course information
var course_info = new Schema({
    courseBody: {
        type: String,
        require: true
    },
    created: Date,
    userId: {
        type: String,
        ref: 'User'
    }
})
exports.CourseInfo = mongoose.model('CourseInfo', course_info);
// end

// admission schemas
var admission = new Schema({
    admission_name: {
        type: String,
        require: true
    },
    open_date: {
        type: Date,
        required: true
    },
    close_date: {
        type: Date,
        required: true
    },
    reopen: {type: Boolean, default: false},
    created: Date,
    userId: {
        type: String,
        ref: 'User'
    }
})
exports.Admission = mongoose.model('Admission', admission);
// end
//admission info
var admission_info = new Schema({
    admissionBody: {
        type: String,
        require: true
    },
    created: Date,
    userId: {
        type: String,
        ref: 'User'
    }
})
exports.AdmissionInfo = mongoose.model('AdmissionInfo', admission_info);
// end

// scholarship schema
var scholarship = new Schema({
    scholarship_name: {
        type: String,
        require: true
    },
    can_apply: {
        type: String,
        required: true
    },
    created: Date,
    userId: {
        type: String,
        ref: 'User'
    }
})
exports.Scholarship = mongoose.model('Scholarship', scholarship);
// end?

//scholarship info
var scholarship_info = new Schema({
    scholarshipBody: {
        type: String,
        require: true
    },
    created: Date,
    userId: {
        type: String,
        ref: 'User'
    }
})
exports.ScholarshipInfo = mongoose.model('ScholarshipInfo', scholarship_info);
// end


//gallery schema
var gallery = new Schema({
    userId: {
        type: String,
        ref: 'User'
    },
    image: String,
    created: Date
});
exports.Gallery = mongoose.model('Gallery', gallery);
// end

//blog schema
var blog = new Schema({
    image:{
        type: String,
        required: true
    },
    blog_title:{
        type: String,
        required: true
    },
    blog_category:{
        type: String,
        required: true
    },
    blog_body:{
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true,
        ref: 'NormalUser'
    },
    views: {
       type: Number,
       default: 0
    },
    slug:{
       type: String, 
       required: true
    },
    created: Date
});
exports.Blog = mongoose.model('Blog', blog);
//end

// normal user
var user = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    slug: String,
    created: Date,
});
user.plugin(uniqueValidator);
exports.NormalUser = mongoose.model('NormalUser', user);
// end

// normal user
var comment = new Schema({
    user: {
      name: {
          type: String,
          required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
     }
    },
    blogId: {
        type: String,
        ref: 'Blog'  
    },
    comment_body: { type: String, required: true},
    created: Date,
});
comment.plugin(uniqueValidator);
exports.Comment = mongoose.model('Comment', comment);
// end

    