const express = require('express'),
router = express.Router();

// define the home page route
router.get('/', function (req, res) {
    let query = req.query;
    res.render('Expense/Index', {
        layout: 'kendo',
        title: "List of expenses",
        sessionData: req.session,
        nav_name: '" Expense"',
        filter_groups: query.filter_groups ? query.filter_groups.filters : {}
    });
});

module.exports = router;