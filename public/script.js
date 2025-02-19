$(document).ready(function () {
    $(".toggle-panel").click(function () {
        $(".main").toggleClass("open");
        $(".panel-header").toggleClass("close");
        $(this).toggleClass("active");
    });

    $(".header-burger").click(function () {
        $(".header-burger").toggleClass("active");
        $(".panel-menu").toggleClass("active");
        $(".panel-shadow").toggleClass("active");
    });

    // var showPass = document.getElementById("show-password");
    // showPass.addEventListener("click", function () {
    //     var passInput = document.getElementById("password");
    //     if (passInput.type == "password") {
    //         passInput.type = "text";
    //         showPass.querySelector("i").className = "fa-regular fa-eye-slash";
    //     }
    //     else {
    //         passInput.type = "password";
    //         showPass.querySelector("i").className = "fa-regular fa-eye";
    //     }
    // });
});