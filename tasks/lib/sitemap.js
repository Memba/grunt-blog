/*
 * grunt-blog
 * http://miniblog.memba.com
 *
 * Copyright (c) 2013-2014 Memba. All rights reserved
 * Licensed under the MIT license.
 */

"use strict";

exports.init = function(grunt) {

    var exports = {},
        path = require('path'),
        TAB = '  ',
        LF = '\n',
        MODULE = 'sitemap.js: ';

    exports.getFilePath = function(options) {
        return path.join(options.homeRoot, options.sitemap);
    };

    exports.startSiteMap = function() {
        grunt.verbose.debug (MODULE + 'Start Site Map');
        return '<?xml version="1.0" encoding="UTF-8" ?>' + LF +
               '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + LF ;
    };

    exports.addHome = function(options) {
        grunt.verbose.debug (MODULE + 'Add Root');
        var item = TAB + '<url>' + LF;
        //mandatory values by sitemap specification (loc)
        item += TAB + TAB + '<loc>' + options.home + '</loc>' + LF;
        //optional values - See http://www.sitemaps.org/protocol.html
        //item += TAB + TAB + '<lastmod>' + data.pubDate + '</lastmod>' + LF;
        //item += TAB + TAB + '<changefreq>' + ???? + '</changefreq>' + LF;
        //item += TAB + TAB + '<priority>' + ????? + '</priority>' + LF;
        item += TAB + '</url>' + LF;
        return item;
    };

    exports.addPost = function(data, options) {
        grunt.verbose.debug (MODULE + 'Add Post');
        var item = TAB + '<url>' + LF;
        //mandatory values by sitemap specification (loc)
        //item += TAB + TAB + '<loc>' + options.home + options.query + encodeURIComponent(data.link.substr(1)) + '</loc>' + LF;
        item += TAB + TAB + '<loc>' + options.home + options.query + data.link.substr(1) + '</loc>' + LF;
        //optional values - See http://www.sitemaps.org/protocol.html
        //item += TAB + TAB + '<lastmod>' + data.pubDate + '</lastmod>' + LF;
        //item += TAB + TAB + '<changefreq>' + ???? + '</changefreq>' + LF;
        //item += TAB + TAB + '<priority>' + ????? + '</priority>' + LF;
        item += TAB + '</url>' + LF;
        return item;
    };

    exports.addPage = function(data, options) {
        grunt.verbose.debug (MODULE + 'Add Post');
        var item = TAB + '<url>' + LF;
        //mandatory values by sitemap specification (loc)
        //item += TAB + TAB + '<loc>' + options.home + options.query + encodeURIComponent(data.link.substr(1)) + '</loc>' + LF;
        item += TAB + TAB + '<loc>' + options.home + options.query + data.link.substr(1) + '</loc>' + LF;
        //optional values - See http://www.sitemaps.org/protocol.html
        //item += TAB + TAB + '<lastmod>' + data.pubDate + '</lastmod>' + LF;
        //item += TAB + TAB + '<changefreq>' + ???? + '</changefreq>' + LF;
        //item += TAB + TAB + '<priority>' + ????? + '</priority>' + LF;
        item += TAB + '</url>' + LF;
        return item;
    };

    exports.endSiteMap = function() {
        grunt.verbose.debug (MODULE + 'End Site Map');
        return '</urlset>';
    };

    return exports;
};