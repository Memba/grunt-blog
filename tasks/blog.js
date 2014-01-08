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
            archive = [],
            options = this.options({
                //configuration
                indexUrl: 'http://blogengine.memba.com/index.html',
                route: '/#blog/',

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


        log.h1('Blog task');

        /**
         * Checking and validating options...
         */
        log.h2('Checking and validating options...');
        log.startProgress();
        if (!options.indexUrl) {
            log.error('Missing option indexUrl. Without indexUrl, links cannot work.');
        }
        log.progress();
        if (!options.newsRoot) {
            log.linefeed();
            log.error('Missing option newsRoot. New posts shall be skipped.');
        }
        log.progress();
        if (options.newsRoot && !grunt.file.isDir(options.newsRoot)) {
            log.linefeed();
            log.warn('Directory newsRoot [' + options.newsRoot + '] does not exist. New posts cannot be processed.');
        }
        log.progress();
        if (!options.archiveRoot) {
            log.linefeed();
            log.error('Missing option archiveRoot. An index cannot be built.');
        }
        log.progress();
        if (options.archiveRoot && !grunt.file.isDir(options.archiveRoot)) {
            log.linefeed();
            log.error('Directory archiveRoot [' + options.archiveRoot + '] does not exist. An index cannot be built.');
        }
        log.progress();
        if (!options.title) {
            log.linefeed();
            log.error('Missing option title. Required for an RSS channel.');
        }
        log.progress();
        if (!options.link) {
            log.linefeed();
            log.error('Missing option link. Required for an RSS channel.');
        }
        log.progress();
        if (!options.description) {
            log.linefeed();
            log.error('Missing option description. Required for an RSS channel.');
        }
        log.progress();
        if (!options.generator) {
            log.linefeed();
            log.warn('Missing option generator. Please keep the link to http://blogengine.memba.com');
        }
        log.progress();
        if (!options.managingEditor) {
            log.linefeed();
            log.error('Missing option managingEditor. We need one in case you forget the author in markdown files');
        }
        log.progress();
        if (!options.pubDate) {
            log.linefeed();
            log.error('Missing option pubDate. We need one in case you forget the pubDate in markdown files');
        }
        log.progress();
        if (!options.lastBuildDate) {
            log.linefeed();
            log.warn('Missing option lastBuildDate. Why don\'t you keep today by default?');
        }
        log.progress();
        log.endProgress();

        /**
         * Processing new posts...
         */
        log.h2('Processing new posts...');
        var news = grunt.file.expand({ filter: 'isFile'}, options.newsRoot + '/**/*.md');
        log.debug(news);
        news.forEach(function(path) {
            if (grunt.file.isFile(path)) {
                //Important Note: the following code should remain consistent with the code in memba.markdown.js
                //See: https://github.com/Memba/Memba-Widgets/blob/master/src/js/memba.markdown.js
                var stream = grunt.file.read(path),
                    metaData = util.getMetaData(stream),
                    markDown = util.getMarkDown(stream);
                log.startProgress('Processing ' + path);
                if (!metaData.title) {
                    metaData.title = 'A title is required.';
                }
                log.progress();
                if (metaData.link) {
                    //log
                }
                //TODO metaData.link =
                log.progress();
                if (!metaData.description) {
                    metaData.description = 'A description is required.';
                }
                log.progress();
                if (!metaData.author) {
                    metaData.author = options.managingEditor;
                }
                if (!metaData.pubDate) {
                    metaData.pubDate = options.pubDate;
                }
                if (!metaData.category) {
                    metaData.category = options.category;
                }
                //Copy file to destination
                var buffer = util.assemble (metaData, markDown),
                    target = util.getTargetPath(metaData, options);
                if (grunt.file.exists(target)) {
                    log.warn('File already exists: ' + target);
                } else {
                    grunt.file.write(target, buffer);
                }
                log.endProgress();
            }
        });

        /**
         * Reading and validating archives...
         */
        log.h2('Reading and validating archives...');

        /**
         * Building the RSS Index ...
         */
        log.h2('Building the RSS Index ...');


        /*

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            // Concat specified files.
            var src = f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
                // Read file source.
                return grunt.file.read(filepath);
            }).join(grunt.util.normalizelf(options.separator));

            //First step is to create slug name (slugify
            //http://stackoverflow.com/questions/1053902/how-to-convert-a-title-to-a-url-slug-in-jquery
            //https://gist.github.com/bentruyman/1211400
            //http://pid.github.io/speakingurl/

            //Check https://github.com/gruntjs/grunt-contrib-yuidoc/blob/master/tasks/yuidoc.js
            //Also check https://github.com/gruntjs/grunt-contrib-less/blob/master/tasks/less.js

            //See http://gruntjs.com/api/grunt

            //Second is to check file, copy file and update file

            //Third is to read all files and create index.rss

            // Handle options.
            src += options.punctuation;

            // Write the destination file.
            grunt.file.write(f.dest, src);

            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');

        });
        */

    });
};
