(function() {
    class Terminal  {
        showTime() {
            let time = document.getElementById('time');
            let t = new Date();
            time.innerHTML = `Last Login: ${t} on ttys000`;
        }
        cursorBlinker() {
            let cursor = document.getElementById('cursor');
            cursor.className = cursor.className ? '' : 'blink';
            setTimeout(() => {
                this.cursorBlinker()
            }, 500);
        }
        begin() {
            window.onkeydown = (e) => {
                let key = (e.which) ? e.which : e.keyCode;

                if (key === 13 || key === 46 || key === 38 || key === 37 || key ===
                    39 ||
                    key === 40 || e.ctrlKey) {
                    e.preventDefault();
                }

                this.specialKeysHandler(key, e);
            };

            window.onkeypress = (e) => {
                this.input((e.which) ? e.which : e.keyCode)
            };

        }
        init() {
            this.history = [];
            this.historyIndex = -1;
            this.showTime();
            this.cursorBlinker();
            this.begin();
            this.intro('open README')
                .then(() => {
                    return this.intro('help');
                })
                .then(() => {
                    return this.intro('cd projects');
                })
                .then(() => {
                    return this.intro('ls');
                })
                .then(() => {
                    return this.intro('cd ~');
                })
                .then(() => {
                    return this.intro('open resume');
                })
                .then(() => {
                    return this.intro('tree');
                })
        }
        intro(command) {
            return new Promise((resolve, reject) => {
                let i = 0;
                let autoType = setInterval(() => {
                    if (i == command.length) {
                        clearInterval(autoType);
                        this.specialKeysHandler(13);
                        resolve();
                        return;
                    };
                    document.getElementById('stdout').innerHTML += command[i];
                    i++;
                }, 200)
            })
        }
        input(key) {
            let stdout = document.getElementById('stdout');
            if (!stdout || key < 0x20 || key > 0x7E || key === 13 || key === 9) {
                return;
            }
            stdout.innerHTML += String.fromCharCode(key);
        }
        specialKeysHandler(key, e) {

            let stdout = document.getElementById('stdout');
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
        }

        returnHandler() {
            let ipt = document.getElementById('stdout').innerHTML;
            let path = document.getElementsByClassName('path')[document.getElementsByClassName(
                'path').length - 1].innerHTML;
            let cmd = ipt.split(' ')[0].toLowerCase();
            let args = ipt.split(' ')[1] ? ipt.split(' ')[1].toLowerCase() : '';
            this.history.push(ipt);
            document.getElementById('cursor').remove();
            document.getElementById('stdout').removeAttribute('id');
            let output = document.createElement('div');
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
            if (output.innerHTML !== '') document.body.appendChild(output);
            let inputTemplate =
                `<div>
                <span><span class="name">bing</span>@<a href="https://zou.buzz" target="_blank" class="link">zou.buzz</a>:<span class="path">${path}</span> $ </span>
                <span class="command" id="stdout"></span><span id="cursor">&nbsp;</span>
            </div>`;
            document.body.innerHTML += inputTemplate;
            this.scroll();

        }
        scroll() {
            let scroller = setInterval(() => {
                window.scrollBy(0, 10)
                if (document.body.scrollTop+document.documentElement.clientHeight>=document.documentElement.scrollHeight) {
                    clearInterval(scroller);
                }
            })
        }
        constructor (){

            this.commands = {
                open(args) {
                    if (args == 'readme') {
                        return `Hey there, welcome to my website! I'm a front-end
developer and I'm always seeking to build awesome stuff.

If you ever need help, type "help".

You can contact me via <a href="mailto:zoubingwu@gmail.com" class="href">gmail</a> or check me out on <a href="https://github.com/shadeofgod" target="_blank" class="href">Github.com/shadeofgod</a>.`
                    } else if (args == 'resume') {
                        return `{
    "Name": "zoubingwu",
    "Environment": "macOS/Terminal/Atom/Vscode/Git",
    "Blog": "zou.buzz",
    "Online Resume": "zou.buzz/resume",
    "Skills": {
        "HTML":         "[########___]",
        "CSS":          "[########___]",
        "JavaScript":   "[#########__]",
        "jQuery":       "[########___]",
        "Bootstrap":    "[#######____]",
        "VueJs":        "[####_______]",
        "ReactJs":      "[###________]",
        "NodeJs":       "[###________]",
        "Prob-solving": "[##########_]",
        "Motivation":   "[###########]",
        "Reliability":  "[###########]",
        "Hard-working": "[###########]"
    },
    "CurrentlyLearning":[
        "ECMAScript 6",
        "VueJs",
        "React",
        "webpack"
    ],
    "BookList": {
        "reading": [
            "高性能JavaScript",
        ],
        "Planning": [
            "JavaScript设计模式与开发实践",
            "算法导论",
            "Http权威指南",
            "基于MVC的JavaScript Web富应用开发"
        ],
        "finished": [
            "JavaScript高级程序设计",
            "高性能网站建设指南"
        ]
    },
    "Languages": [
        "Chinese",
        "English",
        "Français"
    ],
    "Hobbies": [
        "Coding",
        "Jogging",
        "Reading"
    ]
}`;
                    } else {
                        return `-bash: open ${args}: No such file or directory`
                    }
                },
                ls() {
                    let path = document.getElementsByClassName('path')[document.getElementsByClassName(
                        'path').length - 1].innerHTML;

                        if (path === '~') {
                            return `<span class="cv">README</span><span class="cv">resume</span><span class="cv">projects</span>`;
                        } else if (path === 'projects') {
                            return `<a href="https://zou.buzz" class="href">Blog</a> - My personal blog.
<a href="https://github.com/shadeofgod" class="href">Github</a> - I have various projects hosted on my Github including this website.
<a href="https://github.com/shadeofgod/gobang" class="href">Gobang</a> - A Gobang game with artificial intelligence written by JavaScript.
<a href="https://github.com/shadeofgod/waterfall.js" class="href">Waterfalljs</a> - A waterfall layout library.
<a href="https://github.com/shadeofgod/photo-gallery" class="href">PhotoGallery</a> - Photo gallery application by react.
<a href="https://github.com/shadeofgod/2048" class="href">2048</a> - 2048 game with fully mobile support.
<a href="https://github.com/shadeofgod/boomjs" class="href">Boomjs</a> - Funny jQuery pluggin makes your dom explode.
<a href="https://github.com/shadeofgod/anime.js" class="href">Animejs</a> - a small frame animation library for JavaScript.
<a href="https://github.com/shadeofgod/demos" class="href">Demos</a> - some interesting effects and demos.
<a href="https://github.com/shadeofgod/ife/blob/master/2017/baidu_nuomi_fe/phantomjs2/task.js" class="href">phantomjs</a> - light baidu search spider by phantomjs.`;
                        }
                    },
                    cd(args) {
                        if (args === 'projects' || args === '~') {
                            return '';
                        } else {
                            return `-bash: open ${args}: No such directory`
                        }
                    },
                    help() {
                        return `You can navigate either by clicking on anything that underlines
when you put your mouse over it, or by typing commands in the terminal.
Use "profile" to change the theme and text color, use "cd" to change into a
directory or use "ls" to list the contents of that directory. The contents
of a file can be viewed using "open".

Commands are(case insensitive):
<span class="cv">open  cd  ls  profile  clear  help  tree</span>`;
                    },
                    profile() {
                        return `TODO`
                    },
                    clear() {
                        document.body.innerHTML = '';
                        return '';
                    },
                    tree() {
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

    }



    let term = new Terminal();
    term.init();
})();
