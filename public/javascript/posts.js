
/**
 * Variable
*/
const BACKEND_IP_PORT = localStorage.getItem('backend-ip-port');

const profileImg = document.getElementById("profile-img");
const dropBox = document.getElementById("drop-down-box");
const userEditBtn = document.getElementById('user-edit-btn');
const passwordEditBtn = document.getElementById('password-edit-btn');


function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        // 쿠키 이름과 일치하는 경우
        if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(name.length + 1); // 값만 반환
        }
    }
    return null; // 쿠키를 찾지 못한 경우
}

var userId = localStorage.getItem("user-id");

if(userId === null) {
    localStorage.setItem("user-id", getCookie('user-id')); // oauth유저는 쿠키에 담아서 보내기 때문
    userId = localStorage.getItem("user-id");
}




init();




async function init() {
    
    await fetch(`${BACKEND_IP_PORT}/users/${userId}`, createFetchOption('GET'))
        .then(response => {
            if(response.status === 401) {
                alert("로그아웃 되었습니다 !");
                window.location.href = "/users/sign-in";
            }
            
            if(response.status !== 200) {
                console.log(response.status);
            }
            
            if(response.status === 200) {
                return response.json(); // 바디 스트림은 단 한 번만 소비 될 수 있음 => 조심 
            }
        })
        .then(userJson => {
            profileImg.src = userJson.result.image;
        })
        .catch(error => {
            console.log(error);
        });

    await fetch(`${BACKEND_IP_PORT}/posts`, createFetchOption('GET'))
        .then(response => {
            if(response.status === 401) {
                alert("로그아웃 되었습니다 !");
                window.location.href = "/users/sign-in";
            }

            if(response.status !== 200) {
                console.log(response.status);
            }

            if(response.status === 200) {
                return response.json();
            }

        }).then(async(postsJson) => {
            const temp = postsJson.result.slice();
            const topPosts = postsJson.result.sort((a, b) => b.viewCount - a.viewCount).slice(0, 3);
            
            await temp.forEach(async(post) => {
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

                time.textContent = post.createdAt.replace('T', ' ');
                
                await fetch(`${BACKEND_IP_PORT}/users/${post.userId}`, createFetchOption('GET'))
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

            await topPosts.forEach(async(post) => {
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
    
                time.textContent = post.createdAt.replace('T', ' ');
                    
                await fetch(`${BACKEND_IP_PORT}/users/${post.userId}`, createFetchOption('GET'))
                    .then(response => {
                        if(response.status === 401) {
                            alert("로그아웃 되었습니다 !");
                            window.location.href = "/users/sign-in";
                        }
                
                        if(response.status !== 200) {
                            console.log(response.status);
                        }
                
                        if(response.status === 200) {
                            return response.json();
                        }
                    })
                    .then(userJson => {
                        profileImage.src = userJson.result.image;
                        writer.textContent = userJson.result.nickname;
                    })
                    .catch(error => {
                        console.log(error);
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
        })
        .catch(error => {
            console.log(error);
        });
}



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

function makeShortNumber(number) {
    if (number >= 1000) {
        return (number / 1000).toFixed(0) + 'K';
            
    } else {
        return number.toString();
    }
}