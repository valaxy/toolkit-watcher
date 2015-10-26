> This is under development
> Grunt Watcher maybe a better solution with abundant task
> So I'm consider combine both toolkit-watcher with grunt-watcher

[![Build Status](https://travis-ci.org/valaxy/toolkit-watcher.svg?branch=master)](https://travis-ci.org/valaxy/toolkit-watcher)
[![Dependency Status](https://david-dm.org/valaxy/toolkit-watcher.svg)](https://david-dm.org/valaxy/toolkit-watcher)

Inspired by WebStorm Watchers.

Only test in Windows, but theoretically work in other platforms

Check `demo` to see how to use

# Usage
- create a file `.toolbox/watcher.js` in your `<project root>`, which is the watcher config file
- edit config file
- run watcher `node index.js --project <project root>`

# Config File
```javascript
module.exports = {
    tasks: [{ // add tasks as many as you want
        isEnabled: false,
        description: '',
        program: '',
        arguments: [],
        matchOnFileRelativePath: '',
        createOutputFromStdout: false,
        outputPath: ''
    }]
}
```

# TODO / Next Feature
- 有一个bug, 修改相同目录文件时会导致所有相同前缀文件触发change事件
    - 已确认是chokidar的bug
- Track only root file
- √ compile be depended files
- Specify current workplace path
- Normalize path, all use linux '/' nor windows '\'
- add configuration of onUpdate/onAdd/onChange/onDelete
- use a async queue to execute task at the bottom
- add timeout

# Reference
- [Webstorm Watcher](https://www.jetbrains.com/webstorm/help/new-watcher-dialog.html)
- [Grunt Watcher](https://github.com/gruntjs/grunt-contrib-watch)

