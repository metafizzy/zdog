bundle:
	node tasks/bundle

uglify:
	npx uglifyjs dist/zdog.dist.js -o dist/zdog.dist.min.js --mangle --comments /^!/

lint:
	npx eslint js/ demos/ tasks/

dist: bundle uglify

version:
	node ./tasks/version
	make dist
	git add -A dist js
