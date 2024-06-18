BACKEND_IP_PORT = localStorage.getItem('backend-ip-port');


const profileImg = document.getElementById("profile-img");
const dropBox = document.getElementById("drop-down-box");
const userEditBtn = document.getElementById('user-edit-btn')
const passwordEditBtn = document.getElementById('password-edit-btn');

const passwordInput = document.getElementById("input-password");
const rePasswordInput = document.getElementById("input-password-double");
const passwordHelper = document.getElementById("password-helper-text");
const rePasswordHelper = document.getElementById("re-password-helper-text");
const editBtn = document.getElementById("edit-btn");
const editCompleteBtn = document.getElementById("edit-complete-btn");

const userId = localStorage.getItem("user-id");

let isCorrectPassword = false;
let isCorrectRePassword = false;

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

passwordInput.addEventListener("input", (event) => {
    let value = event.target.value;

    if (!value) { 
        passwordHelper.style.visibility = "visible";
        passwordHelper.textContent = "*비밀번호를 입력해주세요";
        passwordHelper.style.color = "#FF0000";
        editBtn.style.backgroundColor = "#8fce92";
        isCorrectPassword = false;

    } else if(!validatePasswordFormat(value)) { 
        passwordHelper.style.visibility = "visible";
        passwordHelper.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포합해야 합니다.";
        passwordHelper.style.color = "#FF0000";
        editBtn.style.backgroundColor = "#8fce92";
        isCorrectPassword = false;

    } else {
        passwordHelper.style.color = "#0040FF";
        passwordHelper.textContent = "*사용가능한 비밀번호입니다.";
        isCorrectPassword = true;
    }

    validateAll();
});

rePasswordInput.addEventListener("input", (event) => {
    const value = event.target.value;

    if (!value) { 
        rePasswordHelper.style.visibility = "visible";
        rePasswordHelper.style.color = "#FF0000";
        rePasswordHelper.textContent = "*비밀번호를 한번 더 입력해주세요";
        isCorrectRePassword = false;

    } else if(!validatePasswordDouble()) {
        rePasswordHelper.style.visibility = "visible";
        rePasswordHelper.style.color = "#FF0000";
        rePasswordHelper.textContent = "*비밀번호가 다릅니다.";
        isCorrectRePassword = false;

    } else {
        rePasswordHelper.style.color = "#0040FF";
        rePasswordHelper.textContent = "*비밀번호가 일치합니다.";
        isCorrectRePassword = true;
    }

    validateAll();
});




editBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    if (isCorrectPassword && isCorrectRePassword) {
        executeToast();
        
        setTimeout(async () => {
            editBtn.disabled = 'true';

            const obj = {
                password : passwordInput.value,
            }
        
            await fetch(`${BACKEND_IP_PORT}/users/${userId}/password`, createFetchOption('PATCH', obj))
                .then(response => {
                    if (response.status === 401) {
                        alert("로그아웃 되었습니다 !");
                        window.location.href = "/users/sign-in";
                    }
                
                    if (response.status === 204) {
                        editBtn.disabled = 'false';
                        window.close();
                        return response.json();
                    } else {
                        alert('비밀번호 수정 실패');
                        window.location.href = `/users/${userId}/password`;
                    }
                })
                .catch(error => {
                    console.error('fetch error:', error);
                });
            
        }, 2000);
    }
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
            profileImg.src = userJson.result.image;
        })
        .catch(error => {
            console.log(error)
        });
}
    




function validatePasswordFormat(password) {
    const passwordRegax = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
    return passwordRegax.test(password);
}


function validatePasswordDouble() {
    const password = document.getElementById("input-password").value;
    const rePassowrd = document.getElementById("input-password-double").value;

    return password === rePassowrd;
}




function executeToast() {
    editCompleteBtn.style.opacity = "1";
}


function validateAll() {
    if (isCorrectPassword && isCorrectRePassword) {
        editBtn.style.backgroundColor = "#748578"
        editBtn.disabled = false;
    } else {
        editBtn.style.backgroundColor = "#8a9f8f"
        editBtn.disabled = true;
    }
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
