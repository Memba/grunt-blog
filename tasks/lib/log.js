/*
 * grunt-blog
 * http://blogdev.memba.com
 *
 * Copyright (c) 2013-2014 Memba. All rights reserved
 * Licensed under the MIT license.
 */

"use strict";

exports.init = function(grunt) {
    var exports = {},
        H2 = '= ',
        TAB = '  ',
        LF = grunt.util.linefeed,
        PROGRESS = '>',
        OK = 'OK',
        prog = '';

    exports.h1 = function(msg) {
        //console.log(msg);
        grunt.log.subhead(msg);
    };

    exports.h2 = function(msg) {
        //console.log(H2 + msg);
        grunt.log.writeln(H2 + msg);
    };

    exports.info = function(msg) {
        //console.info(TAB + msg);
        grunt.log.writeln(TAB + msg);
    };

    exports.startProgress = function(msg) {
        prog = TAB + (msg || 'Progress >');
        grunt.log.write(prog);
    };

    exports.progress = function() {
        if(prog.indexOf(OK) !== prog.length-2) {
            prog += PROGRESS;
            grunt.log.write(PROGRESS);
        }
    };

    exports.endProgress = function() {
        prog += OK;
        //console.log(prog);
        grunt.log.ok();
    };

    exports.warn = function(msg) {
        //console.warn(TAB + msg);
        grunt.fail.warn(TAB + msg);
    };

    exports.error = function(msg) {
        //console.error(TAB + msg);
        grunt.fail.error(TAB + msg);
    };

    exports.debug = function(obj) {
        if(typeof obj === 'string') {
            //console.info(TAB + obj);
            grunt.log.debug(TAB + obj);
        } else {
            //console.dir(obj);
            grunt.log.writeflags(obj, 'debug');
        }
    };

    exports.linefeed = function() {
        grunt.log.write(LF);
    };

    return exports;
};