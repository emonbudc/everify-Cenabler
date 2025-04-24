// Disable right-click enabling
window.removeEventListener('contextmenu', e => e.stopPropagation(), true);
document.removeEventListener('contextmenu', e => e.stopPropagation(), true);

// Disable text selection
document.onselectstart = () => false;
document.body.style.userSelect = 'none';
document.body.onselectstart = () => false;
document.body.oncopy = () => false;
document.body.onpaste = () => false;

// Disable input copy/paste
document.querySelectorAll('input, textarea').forEach(el => {
    el.oncopy = () => false;
    el.onpaste = () => false;
    el.oncut = () => false;
    el.onselectstart = () => false;
    el.style.userSelect = 'none';
});

// Add styled console output for disabling
function printDisableStyledConsoleOutput() {
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

  console.clear();
  console.log(bal);
  console.log("============================================================");
  console.log("         BDRIS BYPASS >>>>>>>>>>>>> Disabled!!");
  console.log("============================================================");
  console.log("ALL RESTRICTIONS HAVE BEEN RESTORED.");
  console.log("============================================================");
}

// Call the function to print styled console output
printDisableStyledConsoleOutput();