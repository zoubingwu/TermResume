import help from './../files/help'

export default {
  cd(argv) {
    if (argv.length === 0) {
      return
    }
    const filename = argv[0]
    const entry = this._terminal.getEntry(filename)
    if (!entry) {
      return `bash: cd: ${filename}: No such file or directory`
    } else if (entry.type !== 'dir') {
      return `bash: cd: ${filename}: Not a directory.`
    } else {
      this._terminal.cwd += `/${entry.name}`
      this._terminal.$currentDir = entry
      return
    }
  },
  cat(argv) {
    if (argv.length === 0) {
      return
    }
    const filename = argv[0]
    const currentFiles = this._terminal.$currentDir.files
    const match = currentFiles.filter(item => item.name === filename)[0]
    if (match && match.content) {
      return `${match.content}`
    } else {
      return `bash: cat: ${filename}: No such file`
    }
  },
  ls(argv) {
    const currentFiles = this._terminal.$currentDir.files

    if (currentFiles.length === 0) {
      return
    }
    let result = ''
    currentFiles.forEach(item => {
      if (item.type === 'dir') {
        result += `<span class="stdout-text dir">${item.name}</span>`
      } else {
        result += `<span class="stdout-text file">${item.name}</span>`
      }
    })
    return result
  },
  pwd(argv) {
    return this._terminal.cwd
  },
  help() {
    return help
  }
}