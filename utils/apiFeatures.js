class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludedFields = ['sort', 'page', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering (e.g., price[gt]=2000 → { price: { $gt: 2000 } })
    let mongoQuery = {};
    Object.keys(queryObj).forEach((key) => {
      if (key.includes('[')) {
        const [field, operator] = key.split('[');
        const op = operator.replace(']', '');
        if (!mongoQuery[field]) mongoQuery[field] = {};
        mongoQuery[field][`$${op}`] = queryObj[key];
      } else {
        mongoQuery[key] = queryObj[key];
      }
    });

    // Convert numeric values from strings to numbers
    Object.keys(mongoQuery).forEach((key) => {
      if (typeof mongoQuery[key] === 'object') {
        Object.keys(mongoQuery[key]).forEach((opKey) => {
          const val = mongoQuery[key][opKey];
          mongoQuery[key][opKey] = isNaN(val) ? val : Number(val);
        });
      } else {
        mongoQuery[key] = isNaN(mongoQuery[key])
          ? mongoQuery[key]
          : Number(mongoQuery[key]);
      }
    });
    this.query = this.query.find(mongoQuery);

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      console.log(this.queryStr.fields);
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
