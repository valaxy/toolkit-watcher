> This is under development

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
- 有一个非常严重的bug, 就是如果把文件编译到相同目录会导致源文件触发change事件, 原因不明, 使用babel编译jsx时遇到
    - 猜测也许是正则表达式被重复命中?
    - 已确认是chokidar的bug
- Track only root file
- √ compile be depended files
- Specify current workplace path
- Normalize path, all use linux '/' nor windows '\'
- add configuration of onUpdate/onAdd/onChange/onDelete
- use a async queue to execute task at the bottom
- add timeout