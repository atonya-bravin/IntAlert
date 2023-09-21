const popup_container = document.getElementById('popup_container');
const violation_dropdown = document.getElementsByClassName('violation_type');
const pop_up_question = document.getElementById('pop-up-question');
const no_button = document.getElementById('no-button');
const close_button = document.getElementById('close-button');
let activeViolationType = null;

function disableViolationType(){
    for (let i = 0; i<violation_dropdown.length; i++){
        violation_dropdown[i].classList.add("deactivate");
    }
}

function enableViolationType(){
    for (let i = 0; i<violation_dropdown.length; i++){
        violation_dropdown[i].classList.remove("deactivate");
    }
}

function closePopUp(){
    popup_container.classList.remove("show");
    popup_container.classList.add("hide");
    enableViolationType();
    activeViolationType.value = "Choose Violation Type";
}

no_button.addEventListener('click', () => {
    closePopUp();
});

close_button.addEventListener('click', () => {
    closePopUp();
});

for (let i = 0; i<violation_dropdown.length; i++){
    violation_dropdown[i].addEventListener('change', () => {
        popup_container.classList.remove("hide");
        popup_container.classList.add("show");
        const flag = violation_dropdown[i].value;
        const question =`Are you sure you want to flag it as ${flag}?`;
        pop_up_question.textContent = question;
        disableViolationType();
        activeViolationType = violation_dropdown[i];
    });
}
