

Example:

```typescript
const casper = new Casper("http://localhost:65093");

for (let i = 0; i < 1000; i++) {
	casper.search("flipkart",{
		query: {
			input: "men polo",
			strict: true,
		},
		filter: {
			$and: [
				{
					$eq: {
						crawled_at: "2021-02-10"
					}
				}
			]
		},
		pagination: {
			limit: 1
		}
	}).then((res) => {
		console.log(res);
	}).catch(error => {
		console.log("reject",error);
	});
}
```