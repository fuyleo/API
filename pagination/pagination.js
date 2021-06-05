function pagination(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page-1) * limit;
        const endIndex = page * limit;

        const data = {}

        if(endIndex < await model.countDocuments().exec()) {
            data.next_page = {
                page: page + 1,
                limit: limit
            }
        }
        if(startIndex > 0 ) {
            data.previous_page = {
                page: page - 1,
                limit: limit
            }
        }
        try {
            data.payload = await model.find().limit(limit).skip(startIndex).exec();
            res.pagination = data;
            next();
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
}

module.exports = pagination;