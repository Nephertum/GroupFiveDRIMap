const username_input = document.getElementById('username');
const password_input = document.getElementById('password');
const login_btn = document.getElementById('login_btn')
const login = () => {
    const username = username_input.value;
    const password = password_input.value;
    fetch('/login',{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({username, password})
    }).then(response => {
        if (response.ok) {
            window.location.href= 'http://127.0.0.1:3000/login'
        }
    })
}
login_btn.addEventListener('click', () => {
    console.log("ahh")
    login();
})
