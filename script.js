const  sheet = document.getElementById('profile-sheet');
const  profileDisplay = document.getElementById('profile-display');
let cropper; //사진 조절기 담을 공간
let tempImage = ""; //자른 사진 데이터 잠시 보관할 공간

let feeds = JSON.parse(localStorage.getItem('feeds')) || [];
window.onload = function() {
    renderFeeds();
    const savedMyProfile = localStorage.getItem('myCurrentProfile');
    if (savedMyProfile) {
        profileDisplay.style.backgroundImage = savedMyProfile;
        profileDisplay.style.backgroundColor = 'transparent';
    }

    const tempProfileImage = localStorage.getItem('tempProfileImage');
    if (tempProfileImage) {
        openSheet();
        initCropper(tempProfileImage);
    }
};

function openSheet(e) {
    sheet.showModal();
}
//리셋만 하고 자동 저장 안 되게 롤백!!!!
function closeSheet() {
    const cropContainer = document.querySelector('.crop-container');
    if (cropContainer) cropContainer.style.display = 'none';
    document.getElementById('crop-image').src = '';
    document.getElementById('profile-upload').value = '';
    document.getElementById('crop-done-btn').style.display = 'none';

    localStorage.removeItem('tempProfileImage');

    if (cropper) { 
        cropper.destroy();
        cropper = null;
    }
    sheet.close();
}
//배경 클릭 시 저장 없이 그냥 닫힘
sheet.addEventListener('click', (e) => {
    if (e.target === sheet) {
        closeSheet();
    }
});
//사진 변경: 사진 고르자마자 조절창과 [완료]버튼 노출
function updateProfile(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            localStorage.setItem('tempProfileImage', imageData);
            initCropper(imageData);
            };
            reader.readAsDataURL(input.files[0]);
    }
}

function confirmCrop() {
    if (!cropper) return;
    
    const croppedCanvas = cropper.getCroppedCanvas({ width:150, height: 150});
    const finalImage = croppedCanvas.toDataURL();
    const bgValue = `url(${finalImage})`;
    profileDisplay.style.backgroundImage = bgValue;
    profileDisplay.style.backgroundColor = 'transparent';
    localStorage.setItem('myCurrentProfile', bgValue);
    closeSheet();
}


//사용자가 완료 버튼 눌렀을 때만 프로필 저장 함수
function confirmCrop() {
    if (!cropper) return;
    //격자대로 사진 자르기
    const croppedCanvas = cropper.getCroppedCanvas({ width:150, height: 150});
    const finalImage = croppedCanvas.toDataURL();
    //프로필에 최종 적용
    const bgValue = `url(${finalImage})`;
    profileDisplay.style.backgroundImage = bgValue;
    profileDisplay.style.backgroundColor = 'transparent';
    localStorage.setItem('myCurrentProfile', bgValue);
    localStorage.removeItem('tempProfileImage');
    closeSheet();
}

//사진 삭제
function deletePhoto() {
    profileDisplay.style.backgroundImage = 'none';
    profileDisplay.style.backgroundColor = 'lightgray';
    localStorage.removeItem('myCurrentProfile');
    localStorage.removeItem('tempProfileImage');
    closeSheet();
}

function renderFeeds() {
    const feedList = document.getElementById('feed-list');
    feedList.innerHTML = '';
    feeds.forEach(feed => { 
        const feedDiv = document.createElement('div');
        feedDiv.className = 'feed';

        const profileDiv = document.createElement('div');
        profileDiv.className = 'feed-profile';

        if(feed.profile) {
            profileDiv.style.backgroundImage = feed.profile;
        }

        const contentDiv = document.createElement('div');
        contentDiv.className = 'feed-content';
        contentDiv.textContent = feed.text;

        feedDiv.appendChild(profileDiv);
        feedDiv.appendChild(contentDiv);
        feedList.appendChild(feedDiv);
    });
}

const postBtn = document.getElementById('post-btn');
const textarea = document.querySelector('textarea');
postBtn.disabled = true;
const feedList = document.getElementById('feed-list');

postBtn.addEventListener('click', () => {
    const content = textarea.value.trim();
    if(content === "") return;

    const newFeed = {
        text: content,
        profile: profileDisplay.style.backgroundImage
    };

    feeds.unshift(newFeed);
    localStorage.setItem('feeds', JSON.stringify(feeds));
    renderFeeds();

    const feedDiv = document.createElement('div');
    feedDiv.className = 'feed';

    const profileDiv = document.createElement('div');
    profileDiv.className = 'feed-profile';
    profileDiv.style.backgroundImage = profileDisplay.style.backgroundImage;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'feed-content';
    contentDiv.textContent = content;

    feedDiv.appendChild(profileDiv);
    feedDiv.appendChild(contentDiv);
    textarea.value = '';
    postBtn.disabled = true;
});

function initCropper(imageSrc) {

    const cropContainer = document.querySelector('.crop-container');
    const cropImage = document.getElementById('crop-image');

    cropContainer.style.display = 'block';

    cropImage.src = imageSrc;

    document.getElementById('crop-done-btn').style.display = 'block';

    if (cropper) {
        cropper.destroy();
    }

    cropper = new Cropper(cropImage, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        background: false
    });
}

textarea.addEventListener('input', () => {
    if(textarea.value.trim() === "") {
        postBtn.disabled = true;
    } else {
        postBtn.disabled = false;
    }
});

const darkModeBtn = document.getElementById('darkmode-btn');
darkModeBtn.addEventListener('click', () => {
    document.body.style.transition = 'none';
    document.querySelectorAll('textarea').forEach(el => {
        el.style.transition = 'none';
    });

    document.body.classList.toggle('dark');
    if(document.body.classList.contains('dark')) {
        darkModeBtn.style.backgroundColor = '#1e1e1e';
        darkModeBtn.style.color = 'white';
        darkModeBtn.style.border = '1px solid #333';
    } else {
        darkModeBtn.style.backgroundColor = 'white';
        darkModeBtn.style.color = 'black';
        darkModeBtn.style.border = '1px solid #ddd';
    }   

    requestAnimationFrame (() => {
        document.body.style.transition = '';
        document.querySelectorAll('textarea').forEach(el => {
            el.style.transition = '';
        });
    });
});