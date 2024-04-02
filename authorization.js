function addAuthorization(req, res, next) {
  if (req.user){
    req.auth = {
      user: req.user.username,
      usermgmt: (req.user.role == 'FullAdmin' || req.user.role == 'UserAdmin') ? true : false,
      petmgmt: (req.user.role == 'FullAdmin' || req.user.role == 'PetAdmin') ? true : false,
    }
  }
  next();
}

module.exports = addAuthorization;