let $ = require('jquery')

var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
var path = require("path");

const PY_DIST_FOLDER = 'pythonDist'
const PY_FOLDER = 'pythonCode'
const PY_MODULE = 'sample' // without .py suffix

const guessDistPackaged = () => {
  const fullPath = path.join(__dirname, PY_DIST_FOLDER)
  return require('fs').existsSync(fullPath)
}

const getScriptPath = () => {
  if (!guessDistPackaged()) {
    return path.join(__dirname, PY_FOLDER, PY_MODULE + '.py')
  }
  return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE)
}

$('#calculate').on('click', () => {
  let num1 = $('#num1').val()
  let num2 = $('#num2').val()


  let script = getScriptPath()

  let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    args: [num1, num2]
  };

  if (!guessDistPackaged()) {
    // Executing python code using python-shell when the distribution is not there.
    const ps = require('python-shell')
    ps.PythonShell.run(script, options, function(err, results) {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      myConsole.log('results: %j', results);
      $('#answer').html(results[0]);
    });
  } else {
    // Execute python distribution file when its available
    const {
      spawn
    } = require('child_process');
    const ls = spawn(script, [num1, num2]);

    ls.stdout.on('data', (data) => {
      myConsole.log(`${data}`);
      $('#answer').html(`${data}`);
    });
  }
})
