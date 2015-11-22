'use strict';


module.exports = function (controller, component, application) {

    controller.listArchive = function (req, res) {
        console.log("dsadas");

        let month_ = req.params.month || '01';
        let year_ = req.params.year || '2000';
        let page = req.params.page || 1;

        let number_item = application.getConfig('pagination').frontNumberItem || 10;

        console.log(month_, year_, page);

        let sql = 'select posts.*,users.user_login,users.user_pass,users.user_email,users.user_url,users.user_registered,users.display_name,' +
            'users.user_activation_key,users.user_image_url,users.salt,users.user_status,users.phone ' +
            'from arr_post as posts left outer join arr_user as users on posts.created_by = users.id WHERE' +
            ' "posts"."type" = \'post\' AND "posts"."published" = 1 AND EXTRACT(MONTH FROM posts.created_at ) = ' + month_ + ' AND EXTRACT(YEAR FROM posts.created_at) = ' + year_ +
            ' ORDER BY posts.id ASC OFFSET ' + (page - 1) * number_item + ' LIMIT ' + number_item;

        let sqlCount = 'select count(*) ' +
            'from arr_post as posts WHERE' +
            ' "posts"."type" = \'post\' AND "posts"."published" = 1 AND EXTRACT(MONTH FROM posts.created_at ) = ' + month_ + ' AND EXTRACT(YEAR FROM posts.created_at) = ' + year_;


        application.models.rawQuery(sql)
            .then(function (result) {
                if (result) {
                    // Render view
                    application.models.rawQuery(sqlCount)
                        .then(function (countPost) {
                            let totalPage = Math.ceil(countPost[0][0].count / number_item) || 1;
                            res.frontend.render('archives', {
                                posts: result[0],
                                archives_date: year_ + ' ' + month_,
                                month : month_,
                                totalPage: totalPage,
                                currentPage: page,
                                route: '/blog/archives/' + year_ + '/' + month_ + '/page-{page}'
                            });
                        })

                } else {
                    // Redirect to 404 if post not exist
                    res.frontend.render('_404');
                }
            }).catch(function (err) {
                res.send("error");
                console.log(err.stack);
            });


    }
};