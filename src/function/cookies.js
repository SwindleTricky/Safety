export function setCookie(name, value) {
    var d = new Date();
    // d.setTime(d.getTime() + (5 * 60 * 60 * 1000)); // 5 hour in milliseconds
    d.setTime(d.getTime() + (1 * 1 * 30 * 1000)); // 5 hour in milliseconds
    // d.setTime(d.getTime() + (5000));
    // var expires = "expires=" + d.toUTCString();
    // document.cookie = name + "=" + value + "; " + expires + "; path=/";
    document.cookie = name + "=" + value + "; ";
};


export function deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
};

export function getCookie(cname) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${cname}=`);
    if (parts.length === 2) return parts.pop().split(';')[0];
    return "";
  }