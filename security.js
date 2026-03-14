// Obfuscator block
function _dC(s) {
    return decodeURIComponent(atob(s.split('').reverse().join('')).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
window._dC = _dC;
