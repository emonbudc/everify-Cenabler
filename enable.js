function printStyledConsoleOutput() {
    const bal = (`
        ▄▄▄▄   ▓█████▄  ██▀███   ██▓  ██████ 
       ▓█████▄ ▒██▀ ██▌▓██ ▒ ██▒▓██▒▒██    ▒ 
       ▒██▒ ▄██░██   █▌▓██ ░▄█ ▒▒██▒░ ▓██▄   
       ▒██░█▀  ░▓█▄   ▌▒██▀▀█▄  ░██░  ▒   ██▒
       ░▓█  ▀█▓░▒████▓ ░██▓ ▒██▒░██░▒██████▒▒
       ░▒▓███▀▒ ▒▒▓  ▒ ░ ▒▓ ░▒▓░░▓  ▒ ▒▓▒ ▒ ░
       ▒░▒   ░  ░ ▒  ▒   ░▒ ░ ▒░ ▒ ░░ ░▒  ░ ░
        ░    ░  ░ ░  ░   ░░   ░  ▒ ░░  ░  ░  
        ░         ░       ░      ░        ░  
             ░  ░                            
    `);
// Remove right-click disabling
    window.addEventListener('contextmenu', e => e.stopPropagation(), true);
    document.addEventListener('contextmenu', e => e.stopPropagation(), true);

    // Allow text selection
    document.onselectstart = null;
    document.body.style.userSelect = 'auto';
    document.body.onselectstart = null;
    document.body.oncopy = null;
    document.body.onpaste = null;

    // Allow input copy/paste
    document.querySelectorAll('input, textarea').forEach(el => {
        el.oncopy = null;
        el.onpaste = null;
        el.oncut = null;
        el.onselectstart = null;
        el.style.userSelect = 'auto';
    });
  console.clear();
  console.log(bal);
  console.log("============================================================");
  console.log("         BYPASS >>>>>>>>>>>>> Injected!!");
  console.log("============================================================");
}


printStyledConsoleOutput();
