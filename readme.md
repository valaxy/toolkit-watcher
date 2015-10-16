> This is under development

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
        ...  
    }]
}
```

# Next Features
- Track only root file
- compile be depended files
