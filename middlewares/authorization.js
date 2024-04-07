function validateUser(req, res, next) {
    if (req.body.role === 'admin') {
      next(); 
    } else {
      res.status(403).json({ message: 'Unauthorized' }); 
    }
  }
  
  module.exports = { validateUser };
  