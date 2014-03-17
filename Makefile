# just make it ugly.
ugly: unframed-min.js 

# the minified sources without IE8 shims
unframed-min.js: 
	uglifyjs \
		./src/unframed_application.js \
		./src/unframed_localStorage.js \
		./src/unframed_xhr.js \
		-o unframed-min.js \
		-c -m -e

# the minified sources with IE8 shims
unframed-ie-min.js: 
	uglifyjs \
		./src/unframed_ie8.js \
		./src/unframed_application.js \
		./src/unframed_localStorage.js \
		./src/unframed_xhr.js \
		-o unframed-ie-min.js \
		-c -m -e

# all the beautified sources
unframed.js: 
	uglifyjs \
		./src/unframed_ie8.js \
		./src/unframed_application.js \
		./src/unframed_localStorage.js \
		./src/unframed_xhr.js \
		-o unframed.js \
		-e -b

# dependencies as a flat list of (git or other source repository) clones.

deps/es5-shim:
	git clone https://github.com/es-shims/es5-shim deps/es5-shim

deps: deps/es5-shim

# clean the dependencies and the build targets
clean:
	rm deps/es5-shim -rf
	rm unframed.js
	rm unframed-min.js
	rm unframed-ie-min.js

all: deps unframed-min.js unframed-ie-min.js unframed.js