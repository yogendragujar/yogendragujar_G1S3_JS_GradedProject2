const loginDetails = [
    {
        userName: "Rajesh",
        password: "admin123"
    },
    {
        userName: "Suhas",
        password: "user123"
    },
    {
        userName: "Monika",
        password: "admin123"
    }
];

localStorage.setItem('Users', JSON.stringify(loginDetails));

document.getElementById("submitForm").addEventListener('click', function () {
    console.log("Button clicked");
    // let uName = document.loginForm.username.value;
    // let password = document.loginForm.password.value;
    let uName = document.getElementById("userName").value;
    let password = document.getElementById("password").value;
    let result = validate(uName, password);
    // console.log(result);
    if (result) {
        // alert("User Name and password matched");
        document.querySelector('form').setAttribute('action', 'resume.html');
        // if(window.onbeforeunload){
        //     alert("Back Button Clicked");
        // }



    } else {
        document.querySelector('form').setAttribute('action', '#');
        let invalidPage = `
            <body>
                <h2>Invalid User Name Or Password</h2>
            </body>
        `
        document.querySelector('body').innerHTML = invalidPage;
    }

    
});

function validate(user, password) {
    let userKeys = Object.keys(localStorage);
    var flag = false;
    for (let key of userKeys) {
        if (key == "Users") {
            let userObject = JSON.parse(localStorage.getItem("Users"));
            for (const jsonElement in userObject) {
                if (userObject[jsonElement].userName === user && userObject[jsonElement].password === password) {
                    flag = true;
                }
            }
            break;
        }
    }
    return flag;
};

