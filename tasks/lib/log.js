/*
 * grunt-blog
 * http://miniblog.memba.com
 *
 * Copyright (c) 2013-2014 Memba. All rights reserved
 * Licensed under the MIT license.
 */

"use strict";

//TODO: write a verbose log file

exports.init = function(grunt) {
    var exports = {},
        H2 = '= ',
        TAB = '  ',
        LF = grunt.util.linefeed,
        PROGRESS = '>',
        OK = 'OK',
        ERRORS = 'ERRORS',
        WARNINGS = 'WARNINGS',
        prog = '';

    exports.h1 = function(msg) {
        //console.log(msg);
        grunt.log.subhead(msg);
    };

    exports.h2 = function(msg) {
        //console.log(H2 + msg);
        grunt.log.writeln(H2 + msg);
    };

    exports.startProgress = function(msg) {
        prog = (msg || 'Status >');
        grunt.log.write(prog);
    };

    exports.progress = function() {
        if(prog.charAt(prog.length-1) === PROGRESS) {
            prog += PROGRESS;
            grunt.log.write(PROGRESS);
        }
    };

    exports.endProgress = function(validation) {
        var severity = '', errors = '', warnings = '', informations = '';
        if (typeof validation === 'object' && (validation.informations || validation.warnings || validation.errors)) {
            if (validation.informations && validation.informations.length > 0) {
                informations = TAB + validation.informations.join(LF + TAB);
            }
            if (validation.warnings && validation.warnings.length > 0) {
                severity = WARNINGS;
                warnings = validation.warnings.join(LF);
            }
            if (validation.errors && validation.errors.length > 0) {
                severity = ERRORS;
                errors = validation.errors.join(LF);
            }
        }
        if (severity === '') {
            prog += OK;
            //console.log(prog);
            grunt.log.ok();
        } else {
            prog += severity;
            //console.log(prog);
            grunt.log.error(severity);
        }
        switch(severity) {
            case ERRORS:
                grunt.log.writeln(errors + LF + warnings);
                grunt.fail.fatal(validation.errors.length.toString());
                break;
            case WARNINGS:
                grunt.log.writeln(warnings);
                grunt.fail.warn(validation.warnings.length.toString());
                break;
            default:
                if (informations.length > 0) {
                    grunt.log.writeln(informations);
                }
        }
    };

    exports.info = function(msg) {
        //console.info(TAB + msg);
        grunt.log.writeln(TAB + msg);
    };

    exports.warn = function(msg) {
        //console.warn(msg);
        grunt.fail.warn(msg);
    };

    exports.error = function(msg) {
        //console.error(msg);
        grunt.fail.fatal(msg);
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