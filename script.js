const  sheet = document.getElementById('profile-sheet');
const  profileDisplay = document.getElementById('profile-display');

function openSheet(e) {
    sheet.showModal();
}
function closeSheet() {
    sheet.close();
}
sheet.addEventListener('click', (e) => {
    if (e.target === sheet) {
        sheet.close();
    }
});

function updateProfile(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profileDisplay.style.backgroundImage = `url(${e.target.result})`;
            profileDisplay.style.backgroundColor = 'transparent';
        };
        reader.readAsDataURL(input.files[0]);
    }
}
