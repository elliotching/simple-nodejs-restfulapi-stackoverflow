// Using query builder
Person.find({ occupation: /host/ })
    .where("name.last").equals("Ghost")
    .where("age").gt(17).lt(66)
    .where("likes").in(["vaporizing", "talking"]) // column of 'likes' only get for those "vaporizing" and "talking"
    .limit(10)
    .sort("-occupation")
    .select("name occupation")
    .exec(callback);
