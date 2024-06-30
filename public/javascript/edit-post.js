BACKEND_IP_PORT = localStorage.getItem('backend-ip-port');


const profileImg = document.getElementById("profile-img");
const dropBox = document.getElementById("drop-down-box");
const userEditBtn = document.getElementById('user-edit-btn');
const passwordEditBtn = document.getElementById('password-edit-btn');
const backBtn = document.getElementById("back-btn")

const titleInput = document.getElementById("title-input");
const title = document.getElementById("title-input");
const postInput = document.getElementById("post-input");
const imageInput = document.getElementById("image-selection");
const image = document.getElementById("image");
const fileName = document.getElementById("file-name");
const helperText = document.getElementById("helper-text");
const editBtn = document.getElementById("edit-btn");

const currentUrl = window.location.href;
const urlParams = currentUrl.split('/');
const postId = urlParams[urlParams.length - 2];

const postPreviewTitle = document.getElementById("post-preview-title");
const postPreviewImage = document.getElementById("post-preview-image");
const postPreviewContent = document.getElementById("post-preview-content");

const userId = localStorage.getItem("user-id");



backBtn.addEventListener('click', () => {
    window.location.href=`/posts/${postId}`;
}) 

profileImg.addEventListener("click", () => {
    dropBox.style.visibility = "visible";
});

userEditBtn.addEventListener('click', (event) => {
    window.open(`/users/${userId}`, "계정 업데이트", "width=620,height=600,top=0,left=0");
});

passwordEditBtn.addEventListener('click', (event) => {
    window.open(`/users/${userId}/password`, "비밀번호 수정", "width=620,height=600,top=0,left=0");
})


document.addEventListener('click', (event) => {
    const clickedElement = event.target;

    if (clickedElement !== profileImg) {
        dropBox.style.visibility = "hidden";
    }
});

titleInput.addEventListener("input", () => {
    const title = titleInput.value;
    const post = postInput.value;
    postPreviewTitle.textContent = titleInput.value; 

    if (title.length > 26) {
        titleInput.value = title.slice(0, 26);
        postPreviewTitle.textContent = titleInput.value; 
    }

    if (title && post) {
        editBtn.style.backgroundColor = '#a3fcb8';
        helperText.style.visibility = "hidden";
    } else {
        editBtn.style.backgroundColor = '#8a9f8f';        
    }
});

postInput.addEventListener('input', () => {
    const title = titleInput.value;
    const post = postInput.value;
    postPreviewContent.textContent = postInput.value;

    if (title && post) {
        editBtn.style.backgroundColor = '#a3fcb8';
        helperText.style.visibility = "hidden";
    } else {
        editBtn.style.backgroundColor = '#8a9f8f';       
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
            console.log(error);
        })



        let writerId;

    await fetch(`${BACKEND_IP_PORT}/posts/${postId}`, createFetchOption('GET'))
        .then(response => {
            if (response.status === 401) {
                alert("로그아웃 되었습니다 !");
                window.location.href = "/users/sign-in";
            }

            if (response.status === 200) {
                return response.json();
            }
        })
        .then(postJson => {
            titleInput.value = postJson.post.title;
            postInput.value = postJson.post.content;
            fileName.textContent = postJson.post.imageName;
            image.src = postJson.post.image;

            postPreviewTitle.textContent = postJson.post.title;
            postPreviewContent.textContent = postJson.post.content;
            postPreviewImage.src = postJson.post.image;

            writerId = postJson.post.userId;
    });


    editBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        const title = titleInput.value;
        const post = postInput.value;
        const imageName = fileName.textContent;

        if (!title || !post) {
            helperText.textContent = "*제목, 내용을 모두 작성해주세요.";
            helperText.style.visibility = "visible";

        } else { 

            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('title', title);
            formData.append('content', post);
            formData.append('imageName', imageName);

            if (imageInput.files.length > 0) {
                formData.append('post-image', imageInput.files[0]);
            } else {
                formData.append('post-image', null); 
            }

            const data = {
                method: 'PATCH',
                headers: {
                    'user-id' : userId
                },
                body: formData,
                credentials: 'include',
            }
        
            await fetch(`${BACKEND_IP_PORT}/posts/${postId}`, data)
                .then(response => {
                    if(response.status === 401) {
                        alert("로그아웃 되었습니다 !");
                        window.location.href = "/users/sign-in";
                    }

                    if (response.status === 204) {
                        alert('게시글이 수정되었습니다!');
                        window.location.href = `/posts/${postId}`;

                    } else {
                        alert('게시글 수정 실패!');
                        window.location.href = `/posts/${postId}`;

                    }
              })
              .catch(error => {
                console.error('fetch error:', error);
              });   
        }
    });
}




function addImage(event) {
    const file = event.target.files[0]; 
    
    if (file) { 
        const reader = new FileReader();
        
        reader.onload = function(e) {
            image.src = e.target.result;
            fileName.textContent = imageInput.value.split('\\').pop();
            postPreviewImage.src = e.target.result;
        }
        reader.readAsDataURL(file); 
        
        return;
    } 
    
    postPreviewImage.src = "";
    image.src = "";
    fileName.textContent = "";
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

    