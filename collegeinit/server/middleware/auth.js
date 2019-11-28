exports.checkLogin = function(req, res, next){
    if(req.session.loginStatus == true){
        next();
    }else{
        res.render('error');
    }
}