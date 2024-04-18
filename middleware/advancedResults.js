const advancedResults = model => async (req, res, next) => {
  let query

  const reqQuery = { ...req.query }

  const removeFields = ["sort", "page", "limit"]

  removeFields.forEach(param => delete reqQuery[param])

  let queryStr = JSON.stringify(reqQuery)

  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

  query = model.find(JSON.parse(queryStr))

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ")
    query = query.sort(sortBy)
  } else {
    query = query.sort({ "year": "desc", name: -1 })
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 4
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await model.countDocuments(JSON.parse(queryStr))

  query = query.skip(startIndex).limit(limit)

  // Executing query
  const results = await query

  // Pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  }

  next()
}

module.exports = advancedResults
