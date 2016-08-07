pull.js
============

Install:
`npm install pull`

Chunked file loader

```javascript
var pull = require('pull')
pull
.on('pull',function(next) {
	//...
	next()
})
.init()
```

License
===
MIT
