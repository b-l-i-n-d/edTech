/* eslint-disable no-param-reassign */

const paginate = (schema) => {
	schema.statics.paginate = async function (filter, options, searchValue) {
		let sort = '';
		if (options.sortBy) {
			const sortingCriteria = [];
			options.sortBy.split(',').forEach((sortOption) => {
				const [key, order] = sortOption.split(':');
				sortingCriteria.push((order === 'desc' ? '-' : '') + key);
			});
			sort = sortingCriteria.join(' ');
		}

		const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
		const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
		const skip = (page - 1) * limit;

		const textSearchFilter = searchValue && { $text: { $search: searchValue } };
		const combinedFilter = { ...filter, ...textSearchFilter };

		const countPromise = this.countDocuments(combinedFilter).exec();
		let docsPromise =
			sort.length > 0
				? this.find(combinedFilter).sort(sort).skip(skip).limit(limit)
				: this.find(combinedFilter).skip(skip).limit(limit);

		if (options.populate) {
			options.populate.split(',').forEach((populateOption) => {
				const [path, select] = populateOption.split(':');
				const populateOptions = {
					path,
					select: select || '',
				};
				docsPromise = docsPromise.populate(populateOptions);
			});
		}

		docsPromise = docsPromise.exec();

		return Promise.all([countPromise, docsPromise]).then((values) => {
			const [totalResults, results] = values;
			const totalPages = Math.ceil(totalResults / limit);
			const result = {
				results,
				page,
				limit,
				totalPages,
				totalResults,
			};
			return Promise.resolve(result);
		});
	};
};

export default paginate;
