let $ = require('jquery')

var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

$('#calculate').on('click', () => {
  let num1 = $('#num1').val()
  let num2 = $('#num2').val()

/* const ps = require('python-shell')

  let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    args: [num1, num2]
  };



  ps.PythonShell.run('sample.py', options, function(err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    myConsole.log('results: %j', results);
    $('#answer').html(results[0]);
  });

  */

  const { spawn } = require('child_process');
  const ls = spawn('./sample', [num1, num2]);

  ls.stdout.on('data', (data) => {
    myConsole.log(`${data}`);
    $('#answer').html(`${data}`);
  });

  ls.stderr.on('data', (data) => {
    myConsole.log(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
    myConsole.log(`child process exited with code ${code}`);
  });
})
