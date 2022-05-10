window.addEventListener('DOMContentLoaded', () => {
    let mobMenu = document.querySelector('.header__menu-button');

    mobMenu.addEventListener('click', (event) => {
        event.currentTarget.classList.toggle('header__menu-button_active');
        document.querySelector('.div__body').classList.toggle('body-lock');
        document.querySelector('body').classList.toggle('body-lock');
        document.querySelector('.header__navigate').classList.toggle('header__navigate_active');
    });
});