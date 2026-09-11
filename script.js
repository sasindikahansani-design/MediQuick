 /* =====================================================
   MEDIQUICK PHARMACY
   LOGIN + REGISTER + SESSION SYSTEM
   ===================================================== */


/* =====================================================
   PAGE LOAD
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* REGISTER */

    const registerForm =
        document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            registerUser
        );

    }


    /* LOGIN */

    const loginForm =
        document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            loginUser
        );

    }


    /* Protect Home */

    protectHomePage();


    /* Protect Staff */

    protectStaffPage();


    /* Show User */

    displayLoggedUser();

});


/* =====================================================
   REGISTER
   ===================================================== */

function registerUser(event) {

    event.preventDefault();


    const fullName =
        document.getElementById("fullName")
        .value.trim();


    const email =
        document.getElementById("email")
        .value.trim();


    const username =
        document.getElementById("username")
        .value.trim();


    const password =
        document.getElementById("password")
        .value;


    const confirmPassword =
        document.getElementById("confirmPassword")
        .value;


    const message =
        document.getElementById(
            "registerMessage"
        );


    /* Password check */

    if (password !== confirmPassword) {

        message.style.color = "red";

        message.textContent =
            "Passwords do not match.";

        return;
    }


    /* Password length */

    if (password.length < 4) {

        message.style.color = "red";

        message.textContent =
            "Password must contain at least 4 characters.";

        return;
    }


    /* Existing user */

    const existingUser =
        JSON.parse(
            localStorage.getItem(
                "mediquickRegisteredUser"
            )
        );


    if (
        existingUser &&
        existingUser.username.toLowerCase() ===
        username.toLowerCase()
    ) {

        message.style.color = "red";

        message.textContent =
            "This username is already registered.";

        return;
    }


    /* Create user */

    const newUser = {

        fullName: fullName,

        email: email,

        username: username,

        password: password,

        role: "customer"

    };


    /* Save */

    localStorage.setItem(

        "mediquickRegisteredUser",

        JSON.stringify(newUser)

    );


    /* Important:
       Registration does NOT login user */

    localStorage.removeItem(
        "mediquickLoggedUser"
    );


    message.style.color = "green";

    message.textContent =
        "Registration successful! Please login.";


    /* Go to Login */

    setTimeout(function () {

        window.location.href =
            "login.html";

    }, 1200);

}


/* =====================================================
   LOGIN
   ===================================================== */

function loginUser(event) {

    event.preventDefault();


    const username =
        document.getElementById(
            "loginUsername"
        ).value.trim();


    const password =
        document.getElementById(
            "loginPassword"
        ).value;


    const message =
        document.getElementById(
            "loginMessage"
        );


    let user = null;


    /* ================================================
       ADMIN
       ================================================ */

    if (
        username === "admin" &&
        password === "admin123"
    ) {

        user = {

            username: "admin",

            fullName: "System Administrator",

            role: "admin"

        };

    }


    /* ================================================
       STAFF
       ================================================ */

    else if (
        username === "staff" &&
        password === "staff123"
    ) {

        user = {

            username: "staff",

            fullName: "Pharmacy Staff",

            role: "staff"

        };

    }


    /* ================================================
       REGISTERED CUSTOMER
       ================================================ */

    else {

        const registeredUser =
            JSON.parse(
                localStorage.getItem(
                    "mediquickRegisteredUser"
                )
            );


        if (
            registeredUser &&
            registeredUser.username === username &&
            registeredUser.password === password
        ) {

            user = {

                username:
                    registeredUser.username,

                fullName:
                    registeredUser.fullName,

                email:
                    registeredUser.email,

                role: "customer"

            };

        }

    }


    /* ================================================
       LOGIN RESULT
       ================================================ */

    if (!user) {

        message.style.color = "red";

        message.textContent =
            "Invalid username or password.";

        return;
    }


    /* Save logged user */

    localStorage.setItem(

        "mediquickLoggedUser",

        JSON.stringify(user)

    );


    message.style.color = "green";

    message.textContent =
        "Login successful. Welcome!";


    /* ================================================
       ADMIN / STAFF
       ================================================ */

    if (
        user.role === "admin" ||
        user.role === "staff"
    ) {

        setTimeout(function () {

            window.location.href =
                "staff.html";

        }, 800);

    }


    /* ================================================
       CUSTOMER
       ================================================ */

    else {

        setTimeout(function () {

            window.location.href =
                "index.html";

        }, 800);

    }

}


/* =====================================================
   GET CURRENT USER
   ===================================================== */

function getCurrentUser() {

    const savedUser =
        localStorage.getItem(
            "mediquickLoggedUser"
        );


    if (!savedUser) {

        return null;

    }


    try {

        return JSON.parse(savedUser);

    }

    catch(error) {

        return null;

    }

}


/* =====================================================
   HOME PAGE PROTECTION
   ===================================================== */

function protectHomePage() {

    const page =
        window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


    if (
        page === "index.html" ||
        page === ""
    ) {

        const user =
            getCurrentUser();


        if (!user) {

            window.location.replace(
                "login.html"
            );

        }

    }

}


/* =====================================================
   STAFF PAGE PROTECTION
   ===================================================== */

function protectStaffPage() {

    const page =
        window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


    if (page !== "staff.html") {

        return;

    }


    const user =
        getCurrentUser();


    /* Not logged in */

    if (!user) {

        window.location.replace(
            "login.html"
        );

        return;

    }


    /* Customer cannot access staff */

    if (
        user.role !== "admin" &&
        user.role !== "staff"
    ) {

        alert(
            "Access denied. Staff or Admin access required."
        );

        window.location.replace(
            "index.html"
        );

        return;

    }


    /* Admin-only section */

    const adminSection =
        document.getElementById(
            "adminSection"
        );


    if (adminSection) {

        if (user.role === "admin") {

            adminSection.style.display =
                "block";

        }

        else {

            adminSection.style.display =
                "none";

        }

    }

}


/* =====================================================
   DISPLAY LOGGED USER
   ===================================================== */

function displayLoggedUser() {

    const user =
        getCurrentUser();


    if (!user) {

        return;

    }


    const nameElements =
        document.querySelectorAll(
            ".logged-user-name"
        );


    nameElements.forEach(function(element){

        element.textContent =
            user.fullName ||
            user.username;

    });


    const roleElements =
        document.querySelectorAll(
            ".logged-user-role"
        );


    roleElements.forEach(function(element){

        element.textContent =
            user.role.toUpperCase();

    });

}


/* =====================================================
   LOGOUT
   ===================================================== */

function logoutUser() {

    localStorage.removeItem(
        "mediquickLoggedUser"
    );


    window.location.replace(
        "login.html"
    );

}