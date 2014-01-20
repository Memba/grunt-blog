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
    grunt.registerMultiTask('blog', 'A grunt plugin to organize markdown content and generate indexes for Memba Mini Blog Engine.', function() {

        // Merge task-specific and/or target-specific options with these defaults.
        var d = new Date(),
            options = this.options({

                //web site configuration
                home: 'http://miniblog.memba.com',
                route: '#/blog/',
                index: 'index.rss',

                //directories to process
                newsRoot: 'news',
                postsRoot: 'posts',

                //RRS channel and items
                //See: http://www.w3schools.com/rss/rss_channel.asp
                category: 'Web Development',
                //cloud: undefined,
                copyright: 'Copyright (c) 2013-2014 Memba. All rights reserved.',
                description: 'A static blog engine which displays live markdown content (What You Write Is What You Publish).',
                docs: 'http://cyber.law.harvard.edu/rss/',
                generator: 'http://miniblog.memba.com',
                image: 'http://miniblog.memba.com/styles/images/logo.png',
                language: 'en-US',
                lastBuildDate: d.toISOString(),
                link: 'http://miniblog.memba.com/posts/index.rss',
                managingEditor: 'Memba',
                pubDate: d.toISOString(),
                rating: undefined,
                //skipDays: undefined,
                //skipHours: undefined,
                //textInput: undefined,
                title: 'Memba Mini Blog Engine',
                ttl: 1440, //24 hours
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
                    directory = util.getDirectory(path),
                    metaData = util.getMetaData(stream),
                    markDown = util.getMarkDown(stream);
                log.startProgress('Processing ' + path);
                validation = util.validateMetaData(metaData, options);
                //Process and add enclosures to metaData
                var enclosures = util.processEnclosures(directory, markDown, metaData, options); //TODO: candidate for a callback
                markDown = enclosures.markDown;
                log.endProgress(validation);
                //Copy markdown file to destination
                var buffer = util.assemble (metaData, markDown),
                    target = util.getTargetPath(metaData, options);
                if (grunt.file.exists(target)) {
                    log.warn('File already exists: ' + target);
                } else {
                    grunt.file.write(target, buffer);
                }
                //Copy enclosures
                for(var i=0; i<enclosures.src.length; i++) {
                    if (grunt.file.exists(enclosures.dest[i])) {
                        log.warn('File already exists: ' + enclosures.dest[i]);
                    } else {
                        if (grunt.file.exists(enclosures.src[i])) {
                            grunt.file.copy(enclosures.src[i], enclosures.dest[i]);
                        } else {
                            log.warn('Missing file ' + enclosures.src[i]);
                        }
                    }
                }
            }
        });

        /**
         * Reading and validating existing posts...
         */
        log.h2('Reading and validating existing posts...');
        var items = [],
            posts = grunt.file.expand({ filter: 'isFile'}, options.postsRoot + '/**/*.md');
        log.debug(posts);
        posts.forEach(function(path) {
            //TODO: Process links and identify orphans
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
