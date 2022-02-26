const username_input = document.getElementById('username');
const password_input = document.getElementById('password');
const login_btn = document.getElementById('login_btn')
const login = () => {
    const username = username_input.value;
    const password = password_input.value;
    if (username.length === 0 || password.length === 0) {
        document.getElementById("loginError").style.display = "block"
    } else {
        document.getElementById("loginError").style.display = "none"
        fetch('/login',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({username, password})
        }).then(response => {
            if (response.ok) {
                location.reload()
            }
            else {
                document.getElementById("loginError").innerText = "Invalid Login"
                document.getElementById("loginError").style.display = "block"
            }
        })
    }
}
login_btn.addEventListener('click', () => {
    console.log("ahh")
    login();
})
