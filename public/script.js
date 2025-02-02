$(".toggle-panel").click(function () {
    $(".main").toggleClass("open");
    $(".panel-header").toggleClass("close");
    $(this).toggleClass("active");
});

$(".header-burger").click(function () {
    $(".header-burger").toggleClass("active");
    $(".panel-menu").toggleClass("active");
    $(".panel-shadow").toggleClass("active");
})