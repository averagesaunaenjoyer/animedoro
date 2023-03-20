let timer2 = null;

onmessage = function(e) {
  switch(e.data.type) {
    case 'start':
      timer2 = e.data.timer;
      setInterval(function() {
        postMessage({ type: 'tick' });
      }, 1000);
      break;
    case 'stop':
      clearInterval(timer2);
      timer2 = null;
      break;
    case 'reset':
      clearInterval(timer2);
      timer2 = null;
      postMessage({ type: 'reset' });
      break;
  }
}
