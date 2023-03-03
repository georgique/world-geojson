module.exports = (grunt) => {
    grunt.initConfig({
        vars: {
            srcPath: './',
            buildPath: '<%= vars.srcPath %>dist/'
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        src: [
                            '<%= vars.srcPath %>areas/**',
                            '<%= vars.srcPath %>countries/**',
                            '<%= vars.srcPath %>states/**',
                        ],
                        dest: '<%= vars.buildPath %>'
                    }
                ]
            }
        },
        shell: {
            "bump-version": {
                command: function() {
                    grunt.task.run('validate-version');

                    var targetVersion = grunt.option('target');
                    return `npm pkg set version=${targetVersion} && echo 'Version bumped to ${targetVersion} successfully.'`;
                }
            },
            "history": {
                // TODO Filter out some commits like Release: * ones
                command: 'git log $(git describe --tags --abbrev=0)..HEAD --format="* %s (%h) by %aN;" --no-merges',
                options: {
                    stdout: false,
                    callback: function (err, stdout, stderr, cb) {
                        grunt.option('history', stdout);
                        cb();
                    }
                }
            },

        }
    });

    grunt.registerTask('validate-version', function() {
        var targetVersion = grunt.option('target');
        if (!/^\d+\.\d+\.\d+$/.test(targetVersion)) {
            grunt.log.error('Target version has to be in x.y.z format.');
            return false;
        }
    });

    grunt.registerTask('write-changelog', function() {

        grunt.task.requires('validate-version');
        grunt.task.requires('shell:history');

        var history = grunt.option('history');
        var changelogPath = grunt.option('changelog') || 'CHANGELOG.md';
        var prefixVersion = grunt.option('version-prefix') || '## v';

        var target = grunt.option('target');
        var escapedTarget = target.replaceAll('.', '\\.');

        var regex = new RegExp(`^(?<title>#*?\\s*?v?\\s*?${escapedTarget}\\s*)(?<currentChangelog>(?:(?:(?!#).)*$)*)`, 'gms');

        var changelog = grunt.file.read(changelogPath);
        if (changelog.match(regex)) {
            changelog = changelog.replace(regex, function(match, p1, p2, offset, string, groups) {
                return [
                    groups.title,
                    history
                ].join('');
            })
        }
        else {
            changelog = changelog.trim() + `\n\n${prefixVersion}${target}\n\n` + history;
        }

        grunt.file.write(changelogPath, changelog);
    });

    grunt.registerTask('update-changelog', ['validate-version', 'shell:history', 'write-changelog']);

    grunt.registerTask('log-date-time', function () {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        grunt.log.ok(dateTime['green']);
    });

    grunt.registerTask('build', ['copy', 'log-date-time']);
    grunt.registerTask('release', ['validate-version', 'shell:bump-version', 'build', 'update-changelog']);
    grunt.registerTask('default', ['build']);

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');
}
