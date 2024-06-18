
BACKEND_IP_PORT = localStorage.getItem('backend-ip-port');



const profileImg = document.getElementById("profile-img");
const email = document.getElementById("email");
const dropBox = document.getElementById("drop-down-box");
const userEditBtn = document.getElementById('user-edit-btn')
const passwordEditBtn = document.getElementById('password-edit-btn');

const profileImage = document.getElementById('profile-image');
const imageEditBtn = document.getElementById('image-edit-btn');
const preview = document.getElementById("preview");

const nicknameInput = document.getElementById("nickname-edit");
const helperText = document.getElementById("helper-text");

const editBtn = document.getElementById("edit-btn");
const deleteBtn = document.getElementById("delete-btn");
const editCompleteBtn = document.getElementById("edit-complete-btn");

const modalBack = document.getElementById("modal-back");
const modal = document.getElementById("modal");
const modalCancel = document.getElementById("modal-cancel");
const modalDelete = document.getElementById("modal-delete");

const userId = localStorage.getItem("user-id");


let originNickname;
let isCorrectNickname = false;



profileImg.addEventListener("click", () => {
    dropBox.style.visibility = "visible";
});

document.addEventListener('click', (event) => {
    const clickedElement = event.target;

    if (clickedElement !== profileImg) {
        dropBox.style.visibility = "hidden";
    }
});

userEditBtn.addEventListener('click', (event) => {
    window.location.href=`/users/${userId}`;
});

passwordEditBtn.addEventListener('click', (event) => {
    window.location.href=`/users/${userId}/password`;
});

nicknameInput.addEventListener("input", async (event) => {
    const value = nicknameInput.value;

    if (!value) {
        helperText.style.visibility = "visible";
        helperText.textContent = "*닉네임을 입력해주세요.";   
        helperText.style.color = "#FF0000";
        isCorrectNickname = false;
        editBtn.style.backgroundColor = "#8a9f8f";

    } else if (value.search(/\s/) != -1) { 
        helperText.style.visibility = "visible";
        helperText.textContent = "*띄어쓰기를 업애주세요.";
        helperText.style.color = "#FF0000";
        isCorrectNickname = false;
        editBtn.style.backgroundColor = "#8a9f8f";

    } else if (value.length > 11) { 
        helperText.style.visibility = "visible";
        helperText.textContent = "*닉네임은 최대 10자 까지 작성 가능합니다.";
        helperText.style.color = "#FF0000";
        isCorrectNickname = false;
        editBtn.style.backgroundColor = "#8a9f8f";

    } else {
        const flag = {'flag' : false};

        if (value !== originNickname) { 
            await validateDuplicateNickname(value, flag);
        } else {
            flag['flag'] = true;
        }
    
        if (!flag['flag']) {
            helperText.style.visibility = "visible";
            helperText.textContent = "*중복된 닉네임 입니다.";
            helperText.style.color = "#FF0000";
            editBtn.style.backgroundColor = "#8a9f8f";
            isCorrectNickname = false;
        
        } else {
            isCorrectNickname = true;
            editBtn.style.backgroundColor = "#748578";
            helperText.style.visibility = "visible";
            helperText.textContent = "*사용가능한 닉네임입니다.";
            helperText.style.color = "#0040FF";
        }
    }
});



editBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    
    if (isCorrectNickname) {
        executeToast();

        setTimeout(async () => {
            editBtn.disabled = 'true';

            const obj = {
                nickname : nicknameInput.value,
                image: preview.src
            }
                
            await fetch(`${BACKEND_IP_PORT}/users/${userId}`, createFetchOption('PATCH', obj))
                .then(response => {
                    if (response.status === 401) {
                        alert("로그아웃 되었습니다 !");
                        window.location.href = "/users/sign-in";
                    }

                    editBtn.disabled = 'false';

                    if (response.status === 204) {
                        window.location.href = `/users/${userId}`;
                        window.opener.location.reload();

                    } else {
                        alert('회원정보 수정 실패');
                        window.location.href = `/users/${userId}`;
                    }
                    editBtn.disabled = 'false';
                })
                .catch(error => {
                    console.error('fetch error:', error);
                });
            
        }, 2000);        

    }

})

deleteBtn.addEventListener('click', (event) => {
    event.preventDefault()
    modalBack.style.visibility = "visible";
    modal.style.visibility = "visible";
});



modalCancel.addEventListener('click', (event) => {
    event.preventDefault()
    const modalBack = document.getElementById("modal-back");
    modalBack.style.visibility = "hidden";
    
    const modal = document.getElementById("modal");
    modal.style.visibility = "hidden";
});

modalDelete.addEventListener('click', async (event) => {
    event.preventDefault()
    
    await fetch(`${BACKEND_IP_PORT}/users/${userId}`, {
        method: 'DELETE', 
        credentials: 'include', 
        headers: {
            'Authorization': accessToken,
            'Content-Type': 'application/json'
        }})
        .then(response => {
            if (response.status === 204) {
                alert('회원탈퇴 되었습니다 !');
                window.close(); 
                window.opener.location.replace('/users/sign-in');
            } else {
                alert('회원탈퇴 실패!');
                window.location.href = `/users/${userId}`;

            }
        });
    
    });






init();


async function init() {
    
    await fetch(`${BACKEND_IP_PORT}/users/${userId}`, createFetchOption('GET'))
        .then(response => {
            if (response.status === 401) {
                alert("로그아웃 되었습니다 !");
                window.location.href = "/users/sign-in";
            }
            
            if (response.status === 200) {
                return response.json();
            }
        })
        .then(userJson => {
            email.textContent = userJson.result.email;
            originNickname = userJson.result.nickname;
            profileImg.src = userJson.result.image;
            preview.src = userJson.result.image;
            nicknameInput.value = userJson.result.nickname;
        });    
}


function addImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById("preview");
        
    if (file) { 
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
        }
        
        reader.readAsDataURL(file); 
        
    } else {
        preview.src = "";
    }
}


async function validateDuplicateNickname(nickname, flag) {
    await fetch(`${BACKEND_IP_PORT}/users/nickname?nickname=${nickname}`, createFetchOption('GET'))
            .then(isDuplicated => isDuplicated.json())
            .then(isDuplicatedJson => {
                if(isDuplicatedJson.result === true) {
                    flag['flag'] = true;
                }
    });
}


function executeToast() {
    editCompleteBtn.style.opacity = "1";
}

function createFetchOption(method, data = null) {
    let fetchOption;

    if (data === null) {
        fetchOption = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'user-id' : userId
            },
            credentials: 'include',
        };    
    } else {
        fetchOption = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'user-id' : userId
            },
            credentials: 'include',
            body: JSON.stringify(data)
        };    
    }

    return fetchOption;
}
