BACKEND_IP_PORT = localStorage.getItem('backend-ip-port');

const profileImg = document.getElementById("profile-img");
const dropBox = document.getElementById("drop-down-box");
const userEditBtn = document.getElementById('user-edit-btn');
const passwordEditBtn = document.getElementById('password-edit-btn');
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");


init();



async function init() {
    var userId = 0;

    const result = {
        id: 0
    }

    await validateJwt(result); 
    userId = result.id; 
        
    userEditBtn.addEventListener('click', (event) => {
        window.open(`/users/${userId}`, "계정 업데이트", "width=620,height=600,top=0,left=0");
    });

    passwordEditBtn.addEventListener('click', (event) => {
        window.open(`/users/${userId}/password`, "비밀번호 수정", "width=620,height=600,top=0,left=0");
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


    await fetch(`${BACKEND_IP_PORT}/users/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': accessToken,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if(response.status === 200)
            return response.json();
    })
    .then(userJson => {
        profileImg.src = userJson.result.image;
    });







    await fetch(`${BACKEND_IP_PORT}/posts`, {
        method: 'GET',
        headers: {
            'Authorization': accessToken,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if(response.status === 200) {
            return response.json();
        }
    })
    .then(postsJson => {
            const temp = postsJson.result.slice();
            const topPosts = postsJson.result.sort((a, b) => b.viewCount - a.viewCount).slice(0, 3);
            
            temp.forEach(post => {
                const postBox = document.createElement('div');
                postBox.classList.add('post-box');
                    
                const upPost = document.createElement('div');
                upPost.classList.add('up-post');
                    
                const postTitle = document.createElement('div');
                postTitle.classList.add('post-title');
                    
                const postLogBox = document.createElement('div');
                postLogBox.classList.add('post-log-box');
                    
                const like = document.createElement('div');
                like.classList.add('like');

                const comment = document.createElement('div');
                comment.classList.add('comment');

                const hits = document.createElement('div');
                hits.classList.add('hits');

                const time = document.createElement('div');
                time.classList.add('time');

                const line = document.createElement('hr');
                line.classList.add('line1');

                const downPost = document.createElement('div');
                downPost.classList.add('down-post');

                const profileImage = document.createElement('img');
                profileImage.classList.add('profile-image');

                const writer = document.createElement('div');
                writer.classList.add('writer');

                postBox.id = post.id;

                if (post.title.length > 26) {
                    postTitle.textContent = post.title.slice(0, 27) + "...";
                } else {
                    postTitle.textContent = post.title;
                }

                like.textContent = `좋아요 ${makeShortNumber(post.likeCount)}`;
                comment.textContent = `댓글 ${makeShortNumber(post.commentCount)}`;
                hits.textContent = `조회수 ${makeShortNumber(post.viewCount)}`;

                time.textContent = post.createdAt;
                
                fetch(`${BACKEND_IP_PORT}/users/${post.userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': accessToken,
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(userJson => {
                    profileImage.src = userJson.result.image;
                    writer.textContent = userJson.result.nickname;
                })

                postLogBox.appendChild(like);
                postLogBox.appendChild(comment);
                postLogBox.appendChild(hits);
                postLogBox.appendChild(time);
                    
                upPost.appendChild(postTitle);
                upPost.appendChild(postLogBox);
            
                downPost.appendChild(profileImage);
                downPost.appendChild(writer);
                    
                postBox.appendChild(upPost);
                postBox.appendChild(line);
                postBox.appendChild(downPost);
                    
                document.getElementById("left-post-box-content").appendChild(postBox);

                postBox.addEventListener('click', () => {
                    window.location.href = `/posts/${postBox.id}`;
                });
            });

            topPosts.forEach(post => {
                const postBox = document.createElement('div');
                postBox.classList.add('post-box');
                    
                const upPost = document.createElement('div');
                upPost.classList.add('up-post');
                    
                const postTitle = document.createElement('div');
                postTitle.classList.add('post-title');
                    
                const postLogBox = document.createElement('div');
                postLogBox.classList.add('post-log-box');
                    
                const like = document.createElement('div');
                like.classList.add('like');
    
                const comment = document.createElement('div');
                comment.classList.add('comment');
    
                const hits = document.createElement('div');
                hits.classList.add('hits');
    
                const time = document.createElement('div');
                time.classList.add('time');
    
                const line = document.createElement('hr');
                line.classList.add('line1');
    
                const downPost = document.createElement('div');
                downPost.classList.add('down-post');
    
                const profileImage = document.createElement('img');
                profileImage.classList.add('profile-image');
    
                const writer = document.createElement('div');
                writer.classList.add('writer');
    
                postBox.id = post.id;
    
                if (post.title.length > 26) {
                    postTitle.textContent = post.title.slice(0, 27) + "...";
                } else {
                    postTitle.textContent = post.title;
                }
    
                like.textContent = `좋아요 ${makeShortNumber(post.likeCount)}`;
                comment.textContent = `댓글 ${makeShortNumber(post.commentCount)}`;
                hits.textContent = `조회수 ${makeShortNumber(post.viewCount)}`;
    
                time.textContent = post.createdAt;
                    
                fetch(`${BACKEND_IP_PORT}/users/${post.userId}`, {
                    method: 'GET',
                    headers: {
                    'Authorization': accessToken,
                    'Content-Type': 'application/json'
                    }
                })
                .then(userData => userData.json())
                .then(userJson => {
                    profileImage.src = userJson.result.image;
                    writer.textContent = userJson.result.nickname;
                });
    
                postLogBox.appendChild(like);
                postLogBox.appendChild(comment);
                postLogBox.appendChild(hits);
                postLogBox.appendChild(time);
                    
                upPost.appendChild(postTitle);
                upPost.appendChild(postLogBox);
            
                downPost.appendChild(profileImage);
                downPost.appendChild(writer);
                    
                postBox.appendChild(upPost);
                postBox.appendChild(line);
                postBox.appendChild(downPost);
                    
                document.getElementById("right-post-box-content").appendChild(postBox);
    
                postBox.addEventListener('click', () => {
                    window.location.href = `/posts/${postBox.id}`;
                });
            });
        });
}


function makeShortNumber(number) {
    if (number >= 1000) {
        return (number / 1000).toFixed(0) + 'K';
            
    } else {
        return number.toString();
    }
}


async function validateJwt(result) {

    const headers = new Headers();
    headers.append('Authorization', accessToken);
    headers.append('Content-Type', 'application/json');

    await fetch(`${BACKEND_IP_PORT}/auth`, {
        method: 'GET',
        credentials: 'include',
        headers: headers
    })
    .then(async (response) => {
        if(response.status !== 200) { 
            const headers = new Headers();
            headers.append('Authorization', refreshToken);
            headers.append('Content-Type', 'application/json');

            return await fetch(`${BACKEND_IP_PORT}/auth/refresh-token`, {
                method: 'POST',
                credentials: 'include',
                headers: headers
            })
            
            .then(async(response) => {
                if (response.status === 200) {    
                    const newAccessToken = response.headers.get('Authorization');
                    const newRefreshToken = response.headers.get('RefreshToken');
                    
                    localStorage.setItem('accessToken', newAccessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    return await fetch(`${BACKEND_IP_PORT}/auth`, {
                        method: 'GET',
                            headers: {
                            'Authorization': newAccessToken,
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        return response.json();
                    })
                } else {
                    alert('로그아웃 되었습니다 !');
                    window.location.href = `/users/sign-in`;
                }
                
            })            
        } else {
            return response.json();
        }
    })
    .then(json => {
        result.id = json.result;
    })
    .catch(error => {
        console.log(error);
    });
}
