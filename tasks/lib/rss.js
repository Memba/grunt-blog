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
        TAB = '  ',
        LF = '\n',
        MODULE = 'rss.js: ';

    exports.getFilePath = function(options) {
        return path.join(options.archiveRoot, options.index);
    };

    exports.startFeed = function() {
        grunt.verbose.debug (MODULE + 'Start Feed');
        return '<?xml version="1.0" encoding="UTF-8" ?>' + LF +
               '<rss version="2.0">' + LF ;
    };

    exports.startChannel = function (options) {
        grunt.verbose.debug (MODULE + 'Start Channel');
        var channel = TAB + '<channel>' + LF;
        //mandatory values by RSS specification (title, link, description)
        channel += TAB + TAB + '<title>' + options.title + '</title>' + LF;
        channel += TAB + TAB + '<link>' + options.link + '</link>' + LF;
        channel += TAB + TAB + '<description><![CDATA[' + options.description + ']]></description>' + LF;
        //mandatory values by our own specs
        channel += TAB + TAB + '<generator>' + options.generator + '</generator>' + LF;
        channel += TAB + TAB + '<pubDate>' + options.pubDate + '</pubDate>' + LF;
        channel += TAB + TAB + '<lastBuildDate>' + options.lastBuildDate + '</lastBuildDate>' + LF; //TODO: Date Format?
        //optional values
        //See http://www.w3schools.com/rss/rss_channel.asp
        if (options.category) {
            channel += TAB + TAB + '<category>' + options.category + '</category>' + LF;
        }
        if (options.copyright) {
            channel += TAB + TAB + '<copyright>' + options.copyright + '</copyright>' + LF;
        }
        if (options.docs) {
            channel += TAB + TAB + '<docs>' + options.docs + '</docs>' + LF;
        }
        if (options.image) {
            channel += TAB + TAB + '<image>' + LF;
            channel += TAB + TAB + TAB + '<url>' + options.image + '</url>' + LF;
            channel += TAB + TAB + TAB + '<title>' + options.title + '</title>' + LF;
            channel += TAB + TAB + TAB + '<link>' + options.imageUrl + '</link>' + LF;
            channel += TAB + TAB + '</image>' + LF;
        }
        if (options.language) {
            channel += TAB + TAB + '<language>' + options.language + '</language>' + LF;
        }
        if (options.managingEditor) {
            channel += TAB + TAB + '<managingEditor>' + options.managingEditor + '</managingEditor>' + LF;
        }
        if (options.rating) {
            channel += TAB + TAB + '<rating>' + options.rating + '</rating>' + LF;
        }
        if (options.ttl) {
            channel += TAB + TAB + '<ttl>' + options.ttl + '</ttl>' + LF;
        }
        if (options.webMaster) {
            channel += TAB + TAB + '<webMaster>' + options.webMaster + '</webMaster>' + LF;
        }
        //cloud, skipDays, skipHours, textInput not handled here (format is too complex)
        return channel;
    };

    exports.addItem = function(data) {
        grunt.verbose.debug (MODULE + 'Add Item');
        var item = TAB + TAB + '<item>' + LF;
        //mandatory values by RSS specification (title, link, description)
        item += TAB + TAB + TAB + '<title>' + data.title + '</title>' + LF;
        item += TAB + TAB + TAB + '<link>' + data.link + '</link>' + LF;
        item += TAB + TAB + TAB + '<description><![CDATA[' + data.description + ']]></description>' + LF;
        //mandatory values by our own specs
        item += TAB + TAB + TAB + '<author>' + data.author + '</author>' + LF;
        item += TAB + TAB + TAB + '<category>' + data.category + '</category>' + LF; //TODO: Consider multiple categories
        item += TAB + TAB + TAB + '<pubDate>' + data.pubDate + '</pubDate>' + LF;
        item += TAB + TAB + TAB + '<guid isPermaLink="false">urn:uuid:' + data.guid + '</guid>' + LF;
        //optional values
        //See http://www.w3schools.com/rss/rss_item.asp
        if (data.comments) { //TODO: Consider DisqUs and Facebook comments
            item += TAB + TAB + TAB + '<comments>' + data.comments + '</comments>' + LF;
        }
        if (data.enclosure) { //TODO: Handle enclosures
            //<enclosure url="http://www.w3schools.com/rss/rss.mp3" length="0" type="audio/mpeg" />
            //item += TAB + TAB + TAB + '<author>' + data.author + '</author>' + LF;
        }
        if (data.source) {
            item += TAB + TAB + TAB + '<source>' + data.source + '</source>' + LF;
        }
        item += TAB + TAB + '</item>' + LF;
        return item;
    };

    exports.endChannel = function() {
        grunt.verbose.debug (MODULE + 'End Channel');
        return TAB + '</channel>' + LF;
    };

    exports.endFeed = function() {
        grunt.verbose.debug (MODULE + 'End Feed');
        return '</rss>';
    };

    return exports;
};