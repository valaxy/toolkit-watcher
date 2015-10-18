> This is under development

[![Build Status](https://travis-ci.org/valaxy/toolkit-watcher.svg?branch=master)](https://travis-ci.org/valaxy/toolkit-watcher)
[![Dependency Status](https://david-dm.org/valaxy/toolkit-watcher.svg)](https://david-dm.org/valaxy/toolkit-watcher)

Inspired by WebStorm Watchers.

Only test in Windows, but theoretically work in other platforms

Check demo/.toolkit/watcher.js to see how to use

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

# Next Features
- Track only root file
- compile be depended files
- Specify current workplace path
- Normalize path, all use linux '/' nor windows '\'
