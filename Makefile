BOT_BINARY=bot
WEB_BINARY=web

JS_FILES = $(shell find static/src/ -type f -name '*.js')

.PHONY: all
all: bot web

bot: cmd/bot/bot.go
	go build -o ${BOT_BINARY} cmd/bot/bot.go

web: cmd/webserver/web.go static
	go build -o ${WEB_BINARY} cmd/webserver/web.go

npm: static/package.json
	cd static && npm install .

gulp: $(JS_FILES)
	cd static && gulp dist

.PHONY: static
static: npm gulp

.PHONY: clean
clean:
	rm -r ${BOT_BINARY} ${WEB_BINARY} static/dist/
