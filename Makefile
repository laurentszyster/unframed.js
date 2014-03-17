# just make it ugly ,-)
ugly: unframed-min.js unframed.js

# the minified sources
unframed-min.js: 
	uglifyjs \
		./src/unframed_application.js \
		./src/unframed_localStorage.js \
		./src/unframed_xhr.js \
		-o unframed-min.js \
		-c -m -e

# all the beautified sources
unframed.js: 
	uglifyjs \
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

all: deps ugly