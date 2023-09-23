const confirmLinkButton = document.getElementById("confirm_button");

confirmLinkButton.addEventListener("click", () => {
    const linkTextBox = document.getElementById("video_link");
    const link = linkTextBox.value;
    window.open(link,"_blank");
});

