const form = document.getElementById("sign_in_form");
const forget_password_link = document.getElementById("forget_password_link");
const submitButton = document.getElementById("sign-in-button");


submitButton.addEventListener("click", ()=>{
    form.setAttribute("action", "/sign-in");
    form.submit();
});

forget_password_link.addEventListener("click", (event)=>{
    event.preventDefault();
    form.setAttribute("action", "/send-passcode");
    form.submit();
});