/*
 * grunt-blog
 * https://github.com/jlchereau/grunt-blog
 *
 * Copyright (c) 2013 Jacques L. Chereau
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function(grunt) {

    // Internal lib.
    var log = require('./lib/log').init(grunt);
    var util = require('./lib/util').init(grunt);
    var rss = require('./lib/rss').init(grunt);


    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    // api: http://gruntjs.com/api/grunt

    /**
     * grunt.registerMultiTask
     */
    grunt.registerMultiTask('blog', 'A grunt plugin to generate an RSS index of Markdown files for a Memba Blog.', function() {

        // Merge task-specific and/or target-specific options with these defaults.
        var d = new Date(),
            options = this.options({
                //configuration
                home: 'http://localhost:63342/Blog/src/www/index.html',
                route: '#/blog/',
                index: 'index.rss',

                //directories to process
                newsRoot: 'new',
                archiveRoot: 'archive',

                //RRS channel: http://www.w3schools.com/rss/rss_channel.asp
                category: 'Web Development',
                //cloud: undefined,
                copyright: 'Copyright (c) 2013-2014 Memba. All rights reserved.',
                description: 'A simple blog engine built around 4 components: (1) markdown content files, (2) a twitter bootstrap layout, (3) an RSS index built by a Grunt task and (4) Javascript widgets to display the markdown files as blog posts and the RSS feed as categorized and chronological indexes. Contrary to Jekyll and other static web site generators, what you write is what you publish.',
                docs: 'http://cyber.law.harvard.edu/rss/',
                generator: 'http://blogengine.memba.com',
                image: undefined, //TODO from Flickr
                language: 'en-US',
                lastBuildDate: d.toISOString(),
                link: 'http://blogengine.memba.com',
                managingEditor: 'Memba',
                pubDate: d.toISOString(),
                rating: undefined,
                //skipDays: undefined,
                //skipHours: undefined,
                //textInput: undefined,
                title: 'Memba Blog Engine',
                ttl: '1440', //24 hours
                webMaster: 'Memba'
            });


        /**
         * Displaying a title for our task
         */
        log.h1('Blog task');

        /**
         * Checking and validating options...
         */
        log.h2('Checking and validating options...');
        log.debug(options);
        log.startProgress();
        var validation = util.validateOptions(options);
        log.endProgress(validation);

        /**
         * Processing new posts...
         */
        log.h2('Processing new posts...');
        var news = grunt.file.expand({ filter: 'isFile'}, options.newsRoot + '/**/*.md');
        log.debug(news);
        news.forEach(function(path) {
            if (grunt.file.isFile(path)) {
                var stream = grunt.file.read(path),
                    metaData = util.getMetaData(stream),
                    markDown = util.getMarkDown(stream);
                log.startProgress('Processing ' + path);
                validation = util.validateMetaData(metaData, options);
                log.endProgress(validation);
                //Copy file to destination
                var buffer = util.assemble (metaData, markDown),
                    target = util.getTargetPath(metaData, options);
                if (grunt.file.exists(target)) {
                    log.warn('File already exists: ' + target);
                } else {
                    grunt.file.write(target, buffer);
                }
            }
        });

        /**
         * Reading and validating archives...
         */
        log.h2('Reading and validating archives...');
        var items = [],
            archive = grunt.file.expand({ filter: 'isFile'}, options.archiveRoot + '/**/*.md');
        log.debug(archive);
        archive.forEach(function(path) {
            if (grunt.file.isFile(path)) {
                var stream = grunt.file.read(path),
                    metaData = util.getMetaData(stream);
                log.startProgress('Processing ' + path);
                validation = util.validateMetaData(metaData, options);
                log.endProgress(validation);
                items.push(metaData);
            }
        });

        /**
         * Building the RSS Index ...
         */
        log.h2('Building the RSS Index ...');
        var index = rss.startFeed(),
            indexRss = rss.getFilePath(options);
        index += rss.startChannel(options);
        items.forEach(function(item) {
            index += rss.addItem(item);
        });
        index += rss.endChannel();
        index += rss.endFeed();
        grunt.file.write(indexRss, index);
    });
};
