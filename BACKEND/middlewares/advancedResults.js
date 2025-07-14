const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Query kopyası
  const reqQuery = { ...req.query };

  // Kaldırılacak alanlar
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Kaldırma işlemi
  removeFields.forEach(param => delete reqQuery[param]);

  // Query string'i JSON'a çevirme
  let queryStr = JSON.stringify(reqQuery);

  // Operatörler ($gt, $gte vb.)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Temel query
  query = model.find(JSON.parse(queryStr));

  // Select
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Query çalıştırma
  const results = await query;

  // Pagination sonucu
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };

  next();
};

module.exports = advancedResults;