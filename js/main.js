(function() {
    if (typeof Object.create !== 'function') {
        Object.create = function(o) {
            function F() {};
            F.prototype = o;
            return new F();
        }
    }

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(s) {
            return this.indexOf(s) == 0;
        }
    }

    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
            if (typeof this !== "function") {
                throw new TypeError(
                    "Function.prototype.bind - what is trying to be bound is not callable"
                );
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function() {},
                fBound = function() {
                    return fToBind.apply(
                        this instanceof fNOP && oThis ? this : oThis || window,
                        aArgs.concat(Array.prototype.slice.call(arguments))
                    );
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }

    var ttys = {
        init: function() {
            this.history = [];
            this.historyIndex = -1;
            this.showTime();
            this.cursorBlinker();
            this.begin();
        },
        showTime: function() {
            var time = document.getElementById('time');
            var t = new Date();
            time.innerHTML = `Last Login: ${t} on ttys000`;
        },

        begin: function() {
            window.onkeydown = function(e) {
                var key = (e.which) ? e.which : e.keyCode;
                // console.log(key);
                if (key === 13 || key === 46 || key === 38 || key === 37 || key ===
                    39 ||
                    key === 40 || e.ctrlKey) {
                    e.preventDefault();
                }

                this.specialKeysHandler(key, e);
            }.bind(this);

            window.onkeypress = function(e) {
                this.input((e.which) ? e.which : e.keyCode)
            }.bind(this);


        },

        input: function(key) {
            var stdout = document.getElementById('stdout');

            if (!stdout || key < 0x20 || key > 0x7E || key === 13 || key === 9) {
                return;
            }

            stdout.innerHTML += String.fromCharCode(key);

        },

        output: function() {

        },

        cursorBlinker: function() {
            var cursor = document.getElementById('cursor');
            cursor.className = cursor.className ? '' : 'blink';
            setTimeout(this.cursorBlinker.bind(this), 500);
        },

        specialKeysHandler: function(key, e) {

            var stdout = document.getElementById('stdout');
            if (!stdout) return;

            if (key === 8 || key === 46) { // Backspace/delete.
                stdout.innerHTML = stdout.innerHTML.replace(/.$/, '');
            } else if (key === 13) { // enter
                this.returnHandler(stdout.innerHTML)
            } else if (key === 38) { // Up arrow.
                if (this.historyIndex < this.history.length - 1) {
                    stdout.innerHTML = this.history[++this.historyIndex];
                }
            } else if (key === 40) { // Down arrow.
                if (this.historyIndex <= 0) {
                    if (this.historyIndex === 0) {
                        this.historyIndex--;
                    }
                    stdout.innerHTML = '';
                } else if (this.history.length) {
                    stdout.innerHTML = this.history[--this.historyIndex];
                }
            } else if (key === 37 || key === 39) { // left and right arrow
                // TODO
            }
        },

        returnHandler: function() {
            var ipt = document.getElementById('stdout').innerHTML;
            var path = document.getElementsByClassName('path')[document.getElementsByClassName('path').length-1].innerHTML;
            var cmd = ipt.split(' ')[0].toLowerCase();
            var args = ipt.split(' ')[1] ? ipt.split(' ')[1].toLowerCase() : '';
            this.history.push(ipt);
            document.getElementById('cursor').remove();
            document.getElementById('stdout').removeAttribute('id');
            var output = document.createElement('div');
            output.className = 'out'
            if (cmd && cmd.length) {
                if (cmd in this.commands) {
                    output.innerHTML = this.commands[cmd](args);
                    if (cmd === 'cd' && (args == 'projects' || args == '~')) {
                        path = args;
                    }
                } else {
                    try {
                        output.innerHTML = eval(ipt);
                    } catch (e) {
                        output.innerHTML = `-bash: ${cmd}: command not found`;
                    }
                }
            }
            if(output.innerHTML !== '') document.body.appendChild(output);
            var inputTemplate =
            `<div>
                <span><span class="name">bing</span>@<a href="https://zou.buzz" target="_blank" class="link">zou.buzz</a>:<span class="path">${path}</span> $ </span>
                <span class="command" id="stdout"></span><span id="cursor">&nbsp;</span>
            </div>`;
            document.body.innerHTML += inputTemplate;

        },
        resetID: function(id) {
            var element = document.getElementById(id);

            if (element) {
                element.removeAttribute('id');
            }
        },
        commands: {
            open: function(args){
                var args = args || '';
                if(args == 'readme') {
                    return `Hey there, my name is bing and welcome to my website! I'm a front-end
developer and I'm always seeking to build awesome stuff.

If you ever need help, type "help".

You can contact me via <a href="mailto:zoubingwu@gmail.com" class="href">gmail</a> or check me out on Github.com<a href="https://github.com/shadeofgod" target="_blank" class="href">/shadeofgod</a>.`
                } else if (args == 'resume'){
                    return `123`
                } else {
                    return `-bash: open ${args}: No such file or directory`
                }
            },
            ls: function() {
                var path = document.getElementsByClassName('path')[document.getElementsByClassName('path').length-1].innerHTML;
                console.log(path)
                if( path === '~') {
                    return `<span class="cv">README</span><span class="cv">resume</span><span class="cv">projects</span>`;
                } else if (path === 'projects') {
                    return `<a href="https://zou.buzz" class="href">Blog</a> - My personal blog
<a href="https://github.com/shadeofgod" class="href">Github</a> - I have various projects hosted on my Github including this website.
<a href="https://github.com/shadeofgod/gobang" class="href">Gobang</a> - A Gobang game with artificial intelligence written by JavaScript.
<a href="https://github.com/shadeofgod/waterfall.js" class="href">Waterfalljs</a> - A waterfall layout library.
<a href="https://github.com/shadeofgod/photo-gallery" class="href">PhotoGallery</a> - Photo gallery application by react.
<a href="https://github.com/shadeofgod/2048" class="href">2048</a> - 2048 game with fully mobile support.
<a href="https://github.com/shadeofgod/boomjs" class="href">Boomjs</a> - Funny jQuery pluggin makes your dom explode.
<a href="https://github.com/shadeofgod/anime.js" class="href">Animejs</a> - a small frame animation library for JavaScript.
<a href="https://github.com/shadeofgod/demos" class="href">Demos</a> - some intersting effects and demos.
<a href="https://github.com/shadeofgod/ife/blob/master/2017/baidu_nuomi_fe/phantomjs2/task.js" class="href">phantomjs</a> - light baidu search spider by phantomjs.`;
                }
            },
            cd: function(args) {
                var args = args || '';
                if (args === 'projects' || args === '~') {
                    return '';
                } else {
                    return `-bash: open ${args}: No such directory`
                }
            },
            help: function() {
                return `You can navigate either by clicking on anything that underlines
when you put your mouse over it, or by typing commands in the terminal.
Type the name of a link to view it. Use "profile" to change the theme and
text color, use "cd" to change into a directory or use "ls" to list the
contents of that directory. The contents of a file can be viewed using "open".

Commands are(case insensitive):
open  cd  ls  profile  clear  help  tree`;
            },
            profile: function(){
                return `TODO`
            },
            clear: function(){
                document.body.innerHTML = '';
                return '';
            },
            tree: function(){
                return `~
|——README
|——resume
|——<a href="https://github.com/shadeofgod" class="link">projects</a>
|  |——<a href="https://zou.buzz" class="href">Blog</a>
|  |——<a href="https://github.com/shadeofgod" class="href">Github</a>
|  |——<a href="https://github.com/shadeofgod/gobang" class="href">Gobang</a>
|  |——<a href="https://github.com/shadeofgod/waterfall.js" class="href">Waterfalljs</a>
|  |——<a href="https://github.com/shadeofgod/photo-gallery" class="href">PhotoGallery</a>
|  |——<a href="https://github.com/shadeofgod/2048" class="href">2048</a>
|  |——<a href="https://github.com/shadeofgod/boomjs" class="href">Boomjs</a>
|  |——<a href="https://github.com/shadeofgod/anime.js" class="href">Animejs</a>
|  |——<a href="https://github.com/shadeofgod/demos" class="href">Demos</a>
|  |——<a href="https://github.com/shadeofgod/ife/blob/master/2017/baidu_nuomi_fe/phantomjs2/task.js" class="href">phantomjs</a>`
            }
        }

    }


    var term = Object.create(ttys);
    term.init();
})();
