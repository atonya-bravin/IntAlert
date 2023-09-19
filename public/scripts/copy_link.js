const copy_link = document.getElementById('copy_link');
copy_link.addEventListener('click', (event) => {
    event.preventDefault();
    console.log("clicked");
    const textToCopy = "localhost:3000";
    navigator.clipboard.writeText(textToCopy).then(()=>{
        console.log("Copied text to clipboard");
    }).catch((error)=>{
        console.log("Failed to copy text to clipboard" + error.message);
    });
    copy_link.textContent="Text copied!";
    copy_link.classList.add('disabled-span');
});