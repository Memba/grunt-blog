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
        path = require('path'),
        MD = 'md',
        LF = '\n',
        COLON = ':',
        SPACE = ' ',
        DOT = '.',
        SLASH = '/',
        BACKSLASH = '\\',
        ROOT = DOT + SLASH;

    /**
     * Adds Date.format function
     * https://npmjs.org/package/date-format-lite
     */
    require("date-format-lite");

    /**
     * Generate a random uuid.
     *
     * USAGE: Math.uuid(length, radix)
     *   length - the desired number of characters
     *   radix  - the number of allowable values for each character.
     *
     * EXAMPLES:
     *   // No arguments  - returns RFC4122, version 4 ID
     *   >>> Math.uuid()
     *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
     *
     *   // One argument - returns ID of the specified length
     *   >>> Math.uuid(15)     // 15 character ID (default base=62)
     *   "VcydxgltxrVZSTV"
     *
     *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
     *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
     *   "01001010"
     *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
     *   "47473046"
     *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
     *   "098F4D35"
     * Source: http://www.broofa.com/Tools/Math.uuid.js - Copyright (c) 2010 Robert Kieffer
     * @param len
     * @param radix
     * @returns {string}
     */
    exports.uuid = function (len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
            uuid = [], i;
            radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random()*16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    };

    /**
     * Returns an object containing metadata properties defined as key: value\n pairs at the beginning of the markdown file
     * Important Note: the following code should remain consistent with the code in memba.markdown.js
     * See: https://github.com/Memba/Memba-Widgets/blob/master/src/js/memba.markdown.js
     * @param stream
     */
    exports.getMetaData = function(stream) {
        var buf = stream.trim().replace(/\r\n/gm, LF).replace(/\r/gm, LF),
            metaData = {},
            posLFLF = buf.indexOf(LF + LF);
        //key value pairs need to be separated from markdown by two line feeds \n\n
        if (posLFLF>0) {
            var hasMetaData = false,
                rawMetaData = buf.substr(0, posLFLF).trim(),
                lines = rawMetaData.split(LF).length,
                //key value pairs are in the form key: value\n
                regex = /^(?:\s*)(\w+)(?:\s*)\:(?:\s*)([^\r\n]+)(?:\s*)$/gm,//TODO: improve but also update memba.markdown.js
                matches = [];
            if(regex.test(rawMetaData)) {
                matches = rawMetaData.match(regex);
                hasMetaData = (matches.length === lines);
            }
            if(hasMetaData) {
                matches.forEach(function(match) {
                    try {
                        var posCOL = match.indexOf(COLON);
                        metaData[match.substr(0,posCOL).trim()] = match.substr(posCOL+1).trim();
                    } catch (err) { }
                });
            }
        }
        return metaData;
    };

    /**
     * Returns MarkDown only without carriage returns
     * @param stream
     * @returns {string}
     */
    exports.getMarkDown = function(stream) {
        var buf = stream.trim().replace(/\r\n/gm, LF).replace(/\r/gm, LF),
            posLFLF = buf.indexOf(LF + LF);
        //key value pairs need to be separated from markdown by two line feeds \n\n
        if (posLFLF>0) {
            return buf.substr(posLFLF + 2).trim();
        } else {
            return buf;
        }
    };

    /**
     * Validate options
     * @param options
     * @returns {{informations: Array, warnings: Array, errors: Array}}
     */
    exports.validateOptions = function(options) {
        var validation = {
            informations: [],
            warnings: [],
            errors: []
        };
        if (!options.home) {
            validation.errors.push('Missing option home. Without home, links cannot work.');
        }
        if (!options.route) {
            validation.errors.push('Missing option route. Without route, links cannot work.');
        }
        if (!options.index) {
            validation.errors.push('Missing option index. Without index, there is no RSS feed .');
        }
        if (!options.newsRoot) {
            validation.warnings.push('Missing option newsRoot. New posts shall be skipped.');
        }
        if (options.newsRoot && !grunt.file.isDir(options.newsRoot)) {
            validation.warnings.push('Directory newsRoot [' + options.newsRoot + '] does not exist. New posts cannot be processed.');
        }
        if (!options.postsRoot) {
            validation.errors.push('Missing option postsRoot. An index cannot be built.');
        }
        if (options.postsRoot && !grunt.file.isDir(options.postsRoot)) {
            validation.errors.push('Directory postsRoot [' + options.postsRoot + '] does not exist. An index cannot be built.');
        }
        if (!options.title) {
            validation.errors.push('Missing option title. Required for an RSS channel.');
        }
        if (!options.link) {
            validation.errors.push('Missing option link. Required for an RSS channel.');
        }
        if (!options.description) {
            validation.errors.push('Missing option description. Required for an RSS channel.');
        }
        if (!options.generator) {
            validation.warnings.push('Missing option generator. Please keep the link to http://blogengine.memba.com');
        }
        if (!options.managingEditor) {
            validation.errors.push('Missing option managingEditor. We need one in case you forget the author in markdown files');
        }
        if (!options.pubDate) {
            validation.errors.push('Missing option pubDate. We need one in case you forget the pubDate in markdown files');
        }
        if (!options.lastBuildDate) {
            validation.warnings.push('Missing option lastBuildDate. Why don\'t you keep today by default?');
        }
        return validation;
    };

    /**
     * Validate metaData
     * @param metaData
     * @param options
     * @returns {{informations: Array, warnings: Array, errors: Array}}
     */
    exports.validateMetaData = function(metaData, options) {
        var validation = {
            informations: [],
            warnings: [],
            errors: []
        };
        if (!metaData.title) {
            if(options) {
                metaData.title = 'A generated title (' + exports.uuid(4,36) + ')';
                validation.informations.push('Missing title key:value in the md file. A title has been generated.');
            } else {
                validation.errors.push('Missing title key:value in the md file. Required for an RSS item.');
            }
        }
        if(!metaData.slug) {
            metaData.slug = exports.getSlug(metaData.title);
            //TODO: check that file name matches slug
        }
        if (!metaData.description) {
            if(options) {
                metaData.description = 'A generated description.';
                validation.informations.push('Missing title key:value in the md file. A description has been generated.');
            } else {
                validation.errors.push('Missing title key:value in the md file. Required for an RSS item.');
            }
        }
        if (!metaData.author) {
            if(options) {
                metaData.author = options.managingEditor;
                validation.informations.push('Missing author key:value in the md file. An author has been generated from option managingEditor.');
            } else {
                validation.warnings.push('Missing author key:value in the md file. We need one to display.');
            }
        }
        if (!metaData.category) {
            if(options) {
                metaData.category = options.category;
                validation.informations.push('Missing category key:value in the md file. A category has been generated from option category.');
            } else {
                validation.errors.push('Missing category key:value in the md file. We need one to index categories.');
            }
        }
        if (!metaData.pubDate) {
            if(options) {
                metaData.pubDate = options.pubDate;
                validation.informations.push('Missing pubDate key:value in the md file. A pubDate has been generated from option pubDate.');
            } else {
                validation.errors.push('Missing pubDate key:value in the md file. We need one to index posts.');
            }
        }
        if (!metaData.guid) { //TODO: check valid guid
            if(options) {
                metaData.guid = exports.uuid();
                validation.informations.push('Missing guid key:value in the md file. A guid has been generated.');
            } else {
                validation.errors.push('Missing guid key:value in the md file. We need one to keep track of comments and likes in case you change your title.');
            }
        }
        if (!metaData.link && !options) {
            validation.errors.push('Missing link key:value in the md file. Required for an RSS item.');
        } else {
            if (options) {
                metaData.link = options.route + new Date(metaData.pubDate).format('YYYY/MM') + SLASH + metaData.slug;
            } else {
                validation.informations.push('Using recorded link: ' + metaData.link);
            }
        }
        //TODO: Important: comments, enclosures, source
        return validation;
    };

    /**
     * Process image (and video) enclosures
     * @param directory
     * @param markDown
     * @param options
     * @returns {Array}
     */
    exports.processEnclosures = function(directory, markDown, metaData, options) {
        var ret = { markDown: markDown, src: [], dest: []};
        var rx1 = /(!\[[^\]]*\]\()([^\)\"\s]*)([\s]*\"[^\"]*\")?(\))/g;
        var tags = markDown.match(rx1);
        if (tags && tags.length > 0) {
            var rx2 = new RegExp(rx1.source); //remove global modifier
            var index = 0;
            for (var i=0; i<tags.length; i++) {
                var srcTag = tags[i],
                    matches = rx2.exec(srcTag),
                    srcPath = matches[2],
                    pos = srcPath.lastIndexOf(DOT);
                // Identifies 5 capturing groups:
                // For example, let's take tag = '![Local image](blue-ball.png "Memba Logo")'
                // matches[0] = '![Local image](blue-ball.png "Memba Logo")'
                // matches[1] = '![Local image]('
                // matches[2] = 'blue-ball.png'
                // matches[3] = ' "Memba Logo"' or undefined if there is no optional title
                // matches[4] = ')'
                if ((srcPath.length < 7 || (srcPath.substr(0, 7) !== 'http://' && srcPath.substr(0, 8) !== 'https://')) //local image
                    && pos > 0 && pos < srcPath.length - 1 //known extension
                    && ret.src.indexOf(srcPath) === -1) //not a duplicate
                {
                    var istr = ('000' + (i + 1)),
                        destPath = path.join(options.postsRoot, new Date(metaData.pubDate).format('YYYY/MM'), metaData.slug + '-' + istr.substr(istr.length - 3, 3) + srcPath.substr(pos)),
                        destUrl = exports.getTargetUrl(destPath, options),
                        destTag = srcTag.replace(rx2, '$1' + destUrl + '$3$4'),
                        rx3 = srcTag.replace('[', '\\[').replace(']', '\\]').replace('(', '\\(').replace(')', '\\)');
                    ret.src.push(path.join(directory, srcPath));
                    ret.dest.push(destPath);
                    ret.markDown = ret.markDown.replace(new RegExp(rx3, 'gm'), destTag);
                    if (!metaData.enclosure) { //use the first image as enclosure
                        metaData.enclosure = destUrl;
                    }
                } else if (srcPath.substr(0, 7) === 'http://' || srcPath.substr(0, 8) === 'https://') { //remote image
                    if (!metaData.enclosure) { //use the first image as enclosure
                        metaData.enclosure = srcPath; //TODO videos
                    }
                }
            }
        }
        return ret;
    };


    /**
     * Reassemble updated metaData and markDown
     * @param metaData
     * @param markDown
     * @returns {*}
     */
    exports.assemble = function(metaData, markDown) {
        var stream = '';
        for (var prop in metaData) {
            if (metaData.hasOwnProperty(prop)) {
                stream += prop + COLON + SPACE + metaData[prop] + LF;
            }
        }
        if (stream.length > 0) {
            stream += LF;
        }
        stream += markDown;
        //See: http://gruntjs.com/api/grunt.util#grunt.util.normalizelf
        return grunt.util.normalizelf(stream); //TODO: Is this a good idea?
    };

    /**
     * Returns the directory of a path
     * @param path
     * @returns {string}
     */
    exports.getDirectory = function(path) {
        if (grunt.file.isDir(path)) {
            return path;
        } else {
            var pos = Math.max(path.lastIndexOf(SLASH), path.lastIndexOf(BACKSLASH));
            if (pos > 0) {
                var ret = path.substr(0, pos);
                if (grunt.file.isDir(ret)) {
                    return ret;
                }
            }
        }
        return undefined;
    };

    /**
     * Get the target path to write to
     * @param metaData
     * @param options
     * @returns {string}
     */
    exports.getTargetPath = function(metaData, options) {
        //TODO: we could consider externalizing the 'YYYY/MM' section of the path as an option to offer more opportunity to structure directories and files
        return path.join(options.postsRoot, new Date(metaData.pubDate).format('YYYY/MM'), metaData.slug + DOT + MD);
    };

    /**
     * Get the target Url from a target path
     * @param path
     * @param options
     * @returns {string}
     */
    exports.getTargetUrl = function(path, options) {
        //TODO: use options to check path root
        return ROOT + path.replace(/\\/gm, SLASH);
    };

    /**
     * Source: https://raw.github.com/pid/speakingurl/master/lib/index.js
     * @param input
     * @param opts
     * @returns {string}
     */
    exports.getSlug = function getSlug(input, opts) {

        var maintainCase = (typeof opts === 'object' && opts.maintainCase) || false;
        var titleCase = (typeof opts === 'object' && opts.titleCase) ? opts.titleCase : false;
        var customReplacements = (typeof opts === 'object' && typeof opts.custom === 'object' && opts.custom) ? opts.custom : {};
        var separator = (typeof opts === 'object' && opts.separator) || '-';
        var truncate = (typeof opts === 'object' && +opts.truncate > 1 && opts.truncate) || false;
        var uricFlag = (typeof opts === 'object' && opts.uric) || false;
        var uricNoSlashFlag = (typeof opts === 'object' && opts.uricNoSlash) || false;
        var markFlag = (typeof opts === 'object' && opts.mark) || false;
        var symbol = (typeof opts === 'object' && opts.lang && symbolMap[opts.lang]) ? symbolMap[opts.lang] : (typeof opts === 'object' && (opts.lang === false || opts.lang === true) ? {} : symbolMap.en);
        var uricChars = [';', '?', ':', '@', '&', '=', '+', '$', ',', '/'];
        var uricNoSlashChars = [';', '?', ':', '@', '&', '=', '+', '$', ','];
        var markChars = ['.', '!', '~', '*', '\'', '(', ')'];
        var result = '';
        var lucky;
        var allowedChars = separator;
        var i;
        var ch;
        var l;
        var lastCharWasSymbol;

        if (titleCase && typeof titleCase.length === "number" && Array.prototype.toString.call(titleCase)) {

            // custom config is an Array, rewrite to object format
            titleCase.forEach(function(v) {
                customReplacements[v + ""] = v + "";
            });
        }

        if (typeof input !== 'string') {
            return '';
        }

        if (typeof opts === 'string') {
            separator = opts;
        } else if (typeof opts === 'object') {

            if (uricFlag) {
                allowedChars += uricChars.join('');
            }

            if (uricNoSlashFlag) {
                allowedChars += uricNoSlashChars.join('');
            }

            if (markFlag) {
                allowedChars += markChars.join('');
            }
        }

        // custom replacements
        Object.keys(customReplacements).forEach(function(v) {

            var r;

            if (v.length > 1) {
                r = new RegExp('\\b' + escapeChars(v) + '\\b', 'gi');
            } else {
                r = new RegExp(escapeChars(v), 'gi');
            }

            input = input.replace(r, customReplacements[v]);
        });

        if (titleCase) {
            input = input.replace(/(\w)(\S*)/g, function(_, i, r) {
                var j = i.toUpperCase() + (r !== null ? r : "");
                return (Object.keys(customReplacements).indexOf(j.toLowerCase()) < 0) ? j : j.toLowerCase();
            });
        }

        // escape all necessary chars
        allowedChars = escapeChars(allowedChars);

        // trim whitespaces
        input = input.replace(/(^\s+|\s+$)/g, '');

        lastCharWasSymbol = false;
        for (i = 0, l = input.length; i < l; i++) {

            ch = input[i];

            if (charMap[ch]) {

                // process diactrics chars
                ch = lastCharWasSymbol && charMap[ch].match(/[A-Za-z0-9]/) ? ' ' + charMap[ch] : charMap[ch];

                lastCharWasSymbol = false;
            } else if (

            // process symbol chars
                symbol[ch] && !(uricFlag && uricChars.join('').indexOf(ch) !== -1) && !(uricNoSlashFlag && uricNoSlashChars.join('').indexOf(ch) !== -1) && !(markFlag && markChars.join('').indexOf(ch) !== -1)) {

                ch = lastCharWasSymbol || result.substr(-1).match(/[A-Za-z0-9]/) ? separator + symbol[ch] : symbol[ch];
                ch += input[i + 1] !== void 0 && input[i + 1].match(/[A-Za-z0-9]/) ? separator : '';

                lastCharWasSymbol = true;
            } else {

                // process latin chars
                if (lastCharWasSymbol && (/[A-Za-z0-9]/.test(ch) || result.substr(-1).match(/A-Za-z0-9]/))) {
                    ch = ' ' + ch;
                }
                lastCharWasSymbol = false;
            }

            // add allowed chars
            result += ch.replace(new RegExp('[^\\w\\s' + allowedChars + '_-]', 'g'), separator);
        }

        // eliminate duplicate separators
        // add separator
        // trim separators from start and end
        result = result.replace(/\s+/g, separator)
            .replace(new RegExp('\\' + separator + '+', 'g'), separator)
            .replace(new RegExp('(^\\' + separator + '+|\\' + separator + '+$)', 'g'), '');

        if (truncate && result.length > truncate) {

            lucky = result.charAt(truncate) === separator;
            result = result.slice(0, truncate);

            if (!lucky) {
                result = result.slice(0, result.lastIndexOf(separator));
            }
        }

        if (!maintainCase && !titleCase && !titleCase.length) {
            result = result.toLowerCase();
        }

        return result;
    };

    /**
     * escapeChars
     * @param input
     * @returns {XML|string|void|*}
     */
    var escapeChars = function escapeChars(input) {
        return input.replace(/[-\\^$*+?.()|[\]{}\/]/g, '\\$&');
    };

    /**
     * charMap
     * @type {Object}
     */
    var charMap = {
        // latin
        'À': 'A',
        'Á': 'A',
        'Â': 'A',
        'Ã': 'A',
        'Ä': 'Ae',
        'Å': 'A',
        'Æ': 'AE',
        'Ç': 'C',
        'È': 'E',
        'É': 'E',
        'Ê': 'E',
        'Ë': 'E',
        'Ì': 'I',
        'Í': 'I',
        'Î': 'I',
        'Ï': 'I',
        'Ð': 'D',
        'Ñ': 'N',
        'Ò': 'O',
        'Ó': 'O',
        'Ô': 'O',
        'Õ': 'O',
        'Ö': 'Oe',
        'Ő': 'O',
        'Ø': 'O',
        'Ù': 'U',
        'Ú': 'U',
        'Û': 'U',
        'Ü': 'Ue',
        'Ű': 'U',
        'Ý': 'Y',
        'Þ': 'TH',
        'ß': 'ss',
        'à': 'a',
        'á': 'a',
        'â': 'a',
        'ã': 'a',
        'ä': 'ae',
        'å': 'a',
        'æ': 'ae',
        'ç': 'c',
        'è': 'e',
        'é': 'e',
        'ê': 'e',
        'ë': 'e',
        'ì': 'i',
        'í': 'i',
        'î': 'i',
        'ï': 'i',
        'ð': 'd',
        'ñ': 'n',
        'ò': 'o',
        'ó': 'o',
        'ô': 'o',
        'õ': 'o',
        'ö': 'oe',
        'ő': 'o',
        'ø': 'o',
        'ù': 'u',
        'ú': 'u',
        'û': 'u',
        'ü': 'ue',
        'ű': 'u',
        'ý': 'y',
        'þ': 'th',
        'ÿ': 'y',
        'ẞ': 'SS',
        // greek
        'α': 'a',
        'β': 'b',
        'γ': 'g',
        'δ': 'd',
        'ε': 'e',
        'ζ': 'z',
        'η': 'h',
        'θ': '8',
        'ι': 'i',
        'κ': 'k',
        'λ': 'l',
        'μ': 'm',
        'ν': 'n',
        'ξ': '3',
        'ο': 'o',
        'π': 'p',
        'ρ': 'r',
        'σ': 's',
        'τ': 't',
        'υ': 'y',
        'φ': 'f',
        'χ': 'x',
        'ψ': 'ps',
        'ω': 'w',
        'ά': 'a',
        'έ': 'e',
        'ί': 'i',
        'ό': 'o',
        'ύ': 'y',
        'ή': 'h',
        'ώ': 'w',
        'ς': 's',
        'ϊ': 'i',
        'ΰ': 'y',
        'ϋ': 'y',
        'ΐ': 'i',
        'Α': 'A',
        'Β': 'B',
        'Γ': 'G',
        'Δ': 'D',
        'Ε': 'E',
        'Ζ': 'Z',
        'Η': 'H',
        'Θ': '8',
        'Ι': 'I',
        'Κ': 'K',
        'Λ': 'L',
        'Μ': 'M',
        'Ν': 'N',
        'Ξ': '3',
        'Ο': 'O',
        'Π': 'P',
        'Ρ': 'R',
        'Σ': 'S',
        'Τ': 'T',
        'Υ': 'Y',
        'Φ': 'F',
        'Χ': 'X',
        'Ψ': 'PS',
        'Ω': 'W',
        'Ά': 'A',
        'Έ': 'E',
        'Ί': 'I',
        'Ό': 'O',
        'Ύ': 'Y',
        'Ή': 'H',
        'Ώ': 'W',
        'Ϊ': 'I',
        'Ϋ': 'Y',
        // turkish
        'ş': 's',
        'Ş': 'S',
        'ı': 'i',
        'İ': 'I',
        // 'ç': 'c', // duplicate
        // 'Ç': 'C', // duplicate
        // 'ü': 'ue', // duplicate
        // 'Ü': 'Ue', // duplicate
        // 'ö': 'oe', // duplicate
        // 'Ö': 'Oe', // duplicate
        'ğ': 'g',
        'Ğ': 'G',
        // macedonian
        'Ќ': 'Kj',
        'ќ': 'kj',
        'Љ': 'Lj',
        'љ': 'lj',
        'Њ': 'Nj',
        'њ': 'nj',
        'Тс': 'Ts',
        'тс': 'ts',
        // russian
        'а': 'a',
        'б': 'b',
        'в': 'v',
        'г': 'g',
        'д': 'd',
        'е': 'e',
        'ё': 'yo',
        'ж': 'zh',
        'з': 'z',
        'и': 'i',
        'й': 'j',
        'к': 'k',
        'л': 'l',
        'м': 'm',
        'н': 'n',
        'о': 'o',
        'п': 'p',
        'р': 'r',
        'с': 's',
        'т': 't',
        'у': 'u',
        'ф': 'f',
        'х': 'h',
        'ц': 'c',
        'ч': 'ch',
        'ш': 'sh',
        'щ': 'sh',
        'ъ': '',
        'ы': 'y',
        'ь': '',
        'э': 'e',
        'ю': 'yu',
        'я': 'ya',
        'А': 'A',
        'Б': 'B',
        'В': 'V',
        'Г': 'G',
        'Д': 'D',
        'Е': 'E',
        'Ё': 'Yo',
        'Ж': 'Zh',
        'З': 'Z',
        'И': 'I',
        'Й': 'J',
        'К': 'K',
        'Л': 'L',
        'М': 'M',
        'Н': 'N',
        'О': 'O',
        'П': 'P',
        'Р': 'R',
        'С': 'S',
        'Т': 'T',
        'У': 'U',
        'Ф': 'F',
        'Х': 'H',
        'Ц': 'C',
        'Ч': 'Ch',
        'Ш': 'Sh',
        'Щ': 'Sh',
        'Ъ': '',
        'Ы': 'Y',
        'Ь': '',
        'Э': 'E',
        'Ю': 'Yu',
        'Я': 'Ya',
        // ukranian
        'Є': 'Ye',
        'І': 'I',
        'Ї': 'Yi',
        'Ґ': 'G',
        'є': 'ye',
        'і': 'i',
        'ї': 'yi',
        'ґ': 'g',
        // czech
        'č': 'c',
        'ď': 'd',
        'ě': 'e',
        'ň': 'n',
        'ř': 'r',
        'š': 's',
        'ť': 't',
        'ů': 'u',
        'ž': 'z',
        'Č': 'C',
        'Ď': 'D',
        'Ě': 'E',
        'Ň': 'N',
        'Ř': 'R',
        'Š': 'S',
        'Ť': 'T',
        'Ů': 'U',
        'Ž': 'Z',
        // polish
        'ą': 'a',
        'ć': 'c',
        'ę': 'e',
        'ł': 'l',
        'ń': 'n',
        // 'ó': 'o', // duplicate
        'ś': 's',
        'ź': 'z',
        'ż': 'z',
        'Ą': 'A',
        'Ć': 'C',
        'Ę': 'E',
        'Ł': 'L',
        'Ń': 'N',
        'Ś': 'S',
        'Ź': 'Z',
        'Ż': 'Z',
        // latvian
        'ā': 'a',
        // 'č': 'c', // duplicate
        'ē': 'e',
        'ģ': 'g',
        'ī': 'i',
        'ķ': 'k',
        'ļ': 'l',
        'ņ': 'n',
        // 'š': 's', // duplicate
        'ū': 'u',
        // 'ž': 'z', // duplicate
        'Ā': 'A',
        // 'Č': 'C', // duplicate
        'Ē': 'E',
        'Ģ': 'G',
        'Ī': 'I',
        'Ķ': 'k',
        'Ļ': 'L',
        'Ņ': 'N',
        // 'Š': 'S', // duplicate
        'Ū': 'U',
        // 'Ž': 'Z', // duplicate
        // Arabic
        'ا': 'a',
        'أ': 'a',
        'إ': 'i',
        'آ': 'aa',
        'ؤ': 'u',
        'ئ': 'e',
        'ء': 'a',
        'ب': 'b',
        'ت': 't',
        'ث': 'th',
        'ج': 'j',
        'ح': 'h',
        'خ': 'kh',
        'د': 'd',
        'ذ': 'th',
        'ر': 'r',
        'ز': 'z',
        'س': 's',
        'ش': 'sh',
        'ص': 's',
        'ض': 'dh',
        'ط': 't',
        'ظ': 'z',
        'ع': 'a',
        'غ': 'gh',
        'ف': 'f',
        'ق': 'q',
        'ك': 'k',
        'ل': 'l',
        'م': 'm',
        'ن': 'n',
        'ه': 'h',
        'و': 'w',
        'ي': 'y',
        'ى': 'a',
        'ة': 'h',
        'ﻻ': 'la',
        'ﻷ': 'laa',
        'ﻹ': 'lai',
        'ﻵ': 'laa',
        // Arabic diactrics
        'َ': 'a',
        'ً': 'an',
        'ِ': 'e',
        'ٍ': 'en',
        'ُ': 'u',
        'ٌ': 'on',
        'ْ': '',

        // Arabic numbers
        '٠': '0',
        '١': '1',
        '٢': '2',
        '٣': '3',
        '٤': '4',
        '٥': '5',
        '٦': '6',
        '٧': '7',
        '٨': '8',
        '٩': '9',
        // symbols
        '“': '"',
        '”': '"',
        '‘': '\'',
        '’': '\'',
        '∂': 'd',
        'ƒ': 'f',
        '™': '(TM)',
        '©': '(C)',
        'œ': 'oe',
        'Œ': 'OE',
        '®': '(R)',
        '†': '+',
        '℠': '(SM)',
        '…': '...',
        '˚': 'o',
        'º': 'o',
        'ª': 'a',
        '•': '*',
        // currency
        '$': 'USD',
        '€': 'EUR',
        '₢': 'BRN',
        '₣': 'FRF',
        '£': 'GBP',
        '₤': 'ITL',
        '₦': 'NGN',
        '₧': 'ESP',
        '₩': 'KRW',
        '₪': 'ILS',
        '₫': 'VND',
        '₭': 'LAK',
        '₮': 'MNT',
        '₯': 'GRD',
        '₱': 'ARS',
        '₲': 'PYG',
        '₳': 'ARA',
        '₴': 'UAH',
        '₵': 'GHS',
        '¢': 'cent',
        '¥': 'CNY',
        '元': 'CNY',
        '円': 'YEN',
        '﷼': 'IRR',
        '₠': 'EWE',
        '฿': 'THB',
        '₨': 'INR',
        '₹': 'INR',
        '₰': 'PF'
    };

    /**
     * symbolMap language specific symbol translations
     * @type {Object}
     */
    var symbolMap = {

        'ar': {
            '∆': 'delta',
            '∞': 'la-nihaya',
            '♥': 'hob',
            '&': 'wa',
            '|': 'aw',
            '<': 'aqal-men',
            '>': 'akbar-men',
            '∑': 'majmou',
            '¤': 'omla'
        },

        'de': {
            '∆': 'delta',
            '∞': 'unendlich',
            '♥': 'Liebe',
            '&': 'und',
            '|': 'oder',
            '<': 'kleiner als',
            '>': 'groesser als',
            '∑': 'Summe von',
            '¤': 'Waehrung'
        },

        'en': {
            '∆': 'delta',
            '∞': 'infinity',
            '♥': 'love',
            '&': 'and',
            '|': 'or',
            '<': 'less than',
            '>': 'greater than',
            '∑': 'sum',
            '¤': 'currency'
        },

        'es': {
            '∆': 'delta',
            '∞': 'infinito',
            '♥': 'amor',
            '&': 'y',
            '|': 'u',
            '<': 'menos que',
            '>': 'mas que',
            '∑': 'suma de los',
            '¤': 'moneda'
        },

        'fr': {
            '∆': 'delta',
            '∞': 'infiniment',
            '♥': 'Amour',
            '&': 'et',
            '|': 'ou',
            '<': 'moins que',
            '>': 'superieure a',
            '∑': 'somme des',
            '¤': 'monnaie'
        },

        'pt': {
            '∆': 'delta',
            '∞': 'infinito',
            '♥': 'amor',
            '&': 'e',
            '|': 'ou',
            '<': 'menor que',
            '>': 'maior que',
            '∑': 'soma',
            '¤': 'moeda'
        },

        'ru': {
            '∆': 'delta',
            '∞': 'beskonechno',
            '♥': 'lubov',
            '&': 'i',
            '|': 'ili',
            '<': 'menshe',
            '>': 'bolshe',
            '∑': 'summa',
            '¤': 'valjuta'
        }
    };

    return exports;
};