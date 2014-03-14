ugly: 
	uglifyjs \
		./src/unframed_ie8.js \
		./src/unframed_application.js \
		./src/unframed_localStorage.js \
		./src/unframed_xhr.js \
		-o unframed-min.js \
		-c -m -e

beauty: 
	uglifyjs \
		./src/unframed_ie8.js \
		./src/unframed_application.js \
		./src/unframed_localStorage.js \
		./src/unframed_xhr.js \
		-o unframed.js \
		-e -b

clean:
	rm unframed-min.js
	rm unframed.js

all: ugly beauty 