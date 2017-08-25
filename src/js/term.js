import COMMANDS from './command'
import tree from './tree'

export default class Terminal {
  constructor(element) {
    this.cwd = '~'
    this.commands = COMMANDS
    this.commands._terminal = this
    this.$app = document.querySelector(element) || document.body
  }

  init() {
    this.begin()
    this.history = []
    this.historyIndex = -1
    this.$root = tree
    this.$currentDir = this.$root
  }

  begin(element) {
    this.showTime()
    this.stdin()

    window.onkeydown = e => {
      const key = e.which|| e.keyCode
      if (key === 13 || // enter
        key === 8 ||  // delete
        key === 46 || // backspace
        key === 37 || // left
        key === 38 || // top
        key === 39 || // right
        key === 40 || // down
        e.ctrlKey) {
        e.preventDefault()
        this.specialKeysHandler(key)
      } else {
        return
      }
    }

    window.onkeypress = e => {
      this.inputCommand(e.which || e.keyCode)
    }

    this.enqueue('cat README')
      .then(() => {
        return this.enqueue('help')
      })
  }

  showTime() {
    const time = document.createElement('time')
    const t = new Date()
    time.innerHTML = `Last Login: ${t} on ttys000`
    this.$app.appendChild(time)
  }

  toggleCursor() {
    const stdin = this.$app.querySelector('.stdin')
    const cmd = stdin.querySelector('.command')
    if (cmd.classList.contains('active')) {
      cmd.classList.remove('active')
    } else {
      cmd.classList.add('active')
    }
  }

  stdin() {
    const lastStdin = this.$app.querySelector('.stdin')
    if (lastStdin) {
      this.toggleCursor()
      lastStdin.classList.remove('stdin')
    }
    const div = document.createElement('div')
    const currentPath = this.cwd
    div.classList.add('stdin')
    div.innerHTML = `<span class="name">shadeofgod</span>@<a href="https://shadeofgod.github.io" class="href">github.com</a>: <span class="path">${currentPath}</span> $ <span class="command active"></span>`
    this.$app.appendChild(div)
    this.$input = this.$app.querySelector('.stdin .command')
  }

  stdout(result) {
    const res = result || '';
    if (res) {
      const div = document.createElement('div')
      div.classList.add('stdout')
      div.innerHTML = res
      this.$app.appendChild(div)
    }
    this.stdin()
    this.autoScroller()
  }

  inputCommand(key) {
    const _input = this.$input
    if (!_input || key < 0x20 || key > 0x7E || key === 13 || key === 9) {
      return;
    }
    _input.innerHTML += String.fromCharCode(key);
  }

  specialKeysHandler(key) {
    const _input = this.$input
    switch (key) {
      case 8:
      case 46:
        // backspace and delete
        _input.innerHTML = _input.innerHTML.replace(/.$/, '')
        break
      case 13:
        // enter
        if (_input.innerHTML) {
          this.returnHandler(_input.innerHTML)
        } else {
          this.stdout()
        }
        break
      case 38:
        // up arrow
        if (this.historyIndex < this.history.length - 1) {
          _input.innerHTML = this.history[++this.historyIndex]
        }
        break
      case 40:
        // down arrow
        if (this.historyIndex <= 0) {
          if (this.historyIndex === 0) {
            this.historyIndex--
          }
          _input.innerHTML = ''
        } else if (this.history.length) {
          _input.innerHTML = this.history[--this.historyIndex]
        }
        break
    }
  }

  returnHandler(inputString) {
    this.history.push(inputString)
    const command = inputString.split(' ')[0].toLowerCase()
    const argv = inputString.split(' ').slice(1)
    if (this.commands[command]) {
      const result = this.commands[command](argv)
      this.stdout(result)
    } else {
      this.stdout(`-bash: ${command}: command not found`)
    }
  }

  getEntry(filename) {
    if (filename === '..') {
      // todo
    }
    const entry = this.$currentDir.files.filter(item => item.name === filename)[0]
    return entry
  }

  autoScroller() {
    let scroller = setInterval(() => {
      window.scrollBy(0, 10)
      if (document.body.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
        clearInterval(scroller);
      }
    })
  }

  enqueue(command) {
    return new Promise(resolve => {
      let i = 0
      const typing = setInterval(() => {
        if (i === command.length) {
          clearInterval(typing)
          this.specialKeysHandler(13)
          return resolve()
        }
        let key = command.charCodeAt(i)
        this.inputCommand(key)
        i++
      }, 220)
    })
  }

}