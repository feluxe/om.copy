
//TODO [x] Check if it works properly.
//TODO [x] Make this a npm Plugin.
//TODO [x] Make Github repository out of it.
//TODO [] Write test.
//TODO [] Comment all the things.

/***********************************************************************************************************************
 * omCopy
 * *********************************************************************************************************************
 * Define a path to copy. (str: glob)
 * Define a destination path (str: none glob)
 * Define filters. (arr: glob)
 *
 */
"use strict";

// Load Modules.
var fs = require('fs-extra');
var path = require('path');
var glob = require("multi-glob").glob;

function om() {}

om.copy = function(source, destination, exclude){
    /**
     * Make Paths Task
     *
     * Convert Glob input to real path arr.
     * Put Each Input array into Obj.
     * Return Obj.
     *
     * @param source
     * @param exclude
     * @returns {Promise}
     */
    var makePathsTask = function(source, exclude){

        // Convert glob input into paths.
        var makePathsFromGlob = function (input) {
            return new Promise(function(resolve, reject) {
                glob(input, function (err, paths) {
                    if (err) reject(err);
                    resolve(paths);
                });
            });
        };

        // Normalize paths
        var normalizePaths = function(input){
            return new Promise(function(resolve) {
                var output = [];
                var i = 0;
                if(input.length === 0){
                    resolve(output);
                } else {
                    input.forEach(function (curInput) {
                        i++;
                        output.push(path.normalize(curInput));
                        if (i >= input.length) {
                            resolve(output);
                        }
                    });
                }
            });
        };

        // Filter source arr with exclude array.
        var filterExcludeFromSource = function (source, exclude) {
            return source.filter(function (val) {
                return exclude.indexOf(val) == -1;
            });
        };

        /**
         * Make Paths Task Constructor
         */
        return new Promise(function(resolve, reject) {
            Promise.all([
                makePathsFromGlob(source),
                makePathsFromGlob(exclude)
            ]).then(function(paths){
                return Promise.all([
                    normalizePaths(paths[0]),
                    normalizePaths(paths[1])
                ]).then(function(result){
                    return result;
                })
            }).then(function(paths){
                resolve(filterExcludeFromSource(paths[0], paths[1]))
            }).catch(function(err){
                reject(err);
            });
        });
    };
    /**
     * Copy Task.
     *
     * If source file Exist => compare src/dest. Copy if size not the same.
     * If src file not Exist => Make dir and copy.
     *
     * @param srcPaths
     * @param source
     * @param destination
     */
    var copyTask = function(srcPaths, source, destination) {

        var makeDestPath = function(curSrc, source, destination, callback){
            var newDest = path.normalize(curSrc.replace(source, destination));
            callback(newDest);
        };

        /**
         * CopyTask Function Constructor
         */
        source = path.dirname(source);
        source = path.normalize(source);
        destination = path.normalize(destination);

        return new Promise(function (resolve) {

            for (var i = 0; i <= srcPaths.length - 1; i++) {
                var curSrc = srcPaths[i];
                makeDestPath(curSrc, source, destination, function(curDest){
                    if (fs.statSync(curSrc).isFile()) {
                        fs.ensureFileSync(curDest);
                        if(fs.statSync(curSrc).size != fs.statSync(curDest).size){
                            fs.copySync(curSrc, curDest, {clobber:true});
                            console.log('NEW: ' + curDest);
                        }
                    } else {
                        fs.ensureDirSync(curDest);
                    }
                });
                if(i >= srcPaths.length -1){
                    console.log('DONE...');
                    resolve();
                }
            }
        });
    };
    /**
     * Module Constructor
     */
    return new Promise(function(resolve, reject){
        makePathsTask(source, exclude)
            .then(function (srcPaths) {
                copyTask(srcPaths, source, destination)
                    .then(function(msg){
                        resolve(msg);
                    }).catch(function(err){
                    reject(err);
                });
            });
    });
};

module.exports = om;





