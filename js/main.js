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
            var cmd = ipt.split(' ')[0];
            this.history.push(ipt);
            document.getElementById('cursor').remove();
            document.getElementById('stdout').removeAttribute('id');
            var output = document.createElement('div');
            if (cmd && cmd.length) {
                if (cmd in this.commands) {
                    output.innerHTML = this.commands[cmd]();
                }
            }
            document.body.appendChild(output);
            var inputTemplate =
                `
            <div>
                <span>bing@<a href="https://zou.buzz" target="_blank" class="link">zou.buzz</a>:~ $ </span>
                <span class="command" id="stdout"></span><span id="cursor">&nbsp;</span>
            </div>
            `;
            document.body.innerHTML += inputTemplate;

        },
        resetID: function(id) {
            var element = document.getElementById(id);

            if (element) {
                element.removeAttribute('id');
            }
        },
        commands: {
            open: function(){

            },
            ls: function() {

            },
            cd: function() {

            },
            help: function() {
                var helpInfo = `
                Hey there, Welcome to my website! I'm a front-end developer and <br>
                I'm always trying to build awesome stuff.<br><br>
                You can navigate either by clicking on anything that underlines <br>
                when you put your mouse over it, or by typing commands in the terminal.<br>
                Type the name of a link to view it. Use "cd" to change into a directory, or use<br>
                "ls" to list the contents of that directory. The contents of a file can be viewed<br>
                using "open".
                <br><br>
                Commands are:<br>
                open  cd  ls  clear  help
                <br><br>
                If you need help, type "help".
                <br><br>
                You can contact me at <a href="mailto:zoubingwu@gmail.com" class="href">zoubingwu@gmail.com</a> or check me out on Github <a href="https://github.com/shadeofgod" class="href">@shadeofgod</a>.
                <br>
                `;
                return helpInfo;
            },
            profile: function(){

            }
        }

    }


    var term = Object.create(ttys);
    term.init();
})();
