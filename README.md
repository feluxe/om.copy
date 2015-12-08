# om.copy
###### node.js npm copy task. glob sytle path selection. filter/excludes. Copy non identical files only.

* Select source [glob style](https://www.npmjs.com/package/glob). (use string for a single glob path definition.)
* Define excludes [multi glob style](https://www.npmjs.com/package/multi-glob). (use array for multiple glob path definitions.)
* Define destination path. (use str for plain output path. No glob.)
* Copy different files only. (Compares files size.)

###### Example:
```javascript
// Load module.
var om = require('om.copy');

// Source path.
// Str with Glob style paths selection.
var source = 'app/**';

// Filter.
// Arr with Glob style paths selection:
var exclude = [
    'app/js/**',
    'app/css/**'
];

// Destination Path str. (no glob).
var destination =  'dist/';

// Execute.
om.copy(source, destination, exclude)
```

###### ES6 Promise integrated:
```javascript
om.copy(source, destination, exclude).then(function(){
    // Do Stuff when copy finished... 
}).catch(err){
    // track Errors.
});
```