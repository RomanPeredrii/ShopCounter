var express = require('express');
var router = express.Router();

// !! - /* PAGES GET WORK page. */
router.get('/work', (req, res, next) => {
  res.render('work.pug', { title: 'WORK PAGE', logged: true });
});
// !! - /* PAGES GET ADMIN page. */
router.get('/admin', (req, res, next) => {
  res.render('admin.pug', { title: 'ADMIN PAGE', logged: true });
});

module.exports = router;