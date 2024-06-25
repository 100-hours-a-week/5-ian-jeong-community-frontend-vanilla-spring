BACKEND_IP_PORT = localStorage.getItem('backend-ip-port');

const form = document.getElementById('sign-in-form');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const helperText = document.getElementById('helper-text'); 
const signInBtn = document.getElementById('sign-in-btn');
const loading = document.getElementById('loading');
const loadingBackground = document.getElementById('loading-background');
const googleIcon = document.getElementById("google-icon");
const naverIcon = document.getElementById("naver-icon");
const kakaoIcon = document.getElementById("kakao-icon");

localStorage.removeItem('user-id');
allDelCookies();

function allDelCookies (domain, path) {
    // const doc = document;
    domain = domain || document.domain;
    path = path || '/';
  
    const cookies = document.cookie.split('; '); // 배열로 반환
    console.log(cookies);
    const expiration = 'Sat, 01 Jan 1972 00:00:00 GMT';
  
    if (!document.cookie) {
    } else {
      for (i = 0; i < cookies.length; i++) {
        // const uname = cookies[i].split('=')[0];
        // document.cookie = `${uname}=; expires=${expiration}`;
        document.cookie = cookies[i].split('=')[0] + '=; expires=' + expiration;
        // document.cookie = cookies[i].split('=')[0] + '=; expires=' + expiration + '; domain =' + domain;
      }
    }
  };


googleIcon.addEventListener('click', (event) => {
    window.location.href=`${BACKEND_IP_PORT}/oauth2/authorization/google`;
});

naverIcon.addEventListener('click', (event) => {
    window.location.href=`${BACKEND_IP_PORT}/oauth2/authorization/naver`;
});

kakaoIcon.addEventListener('click', (event) => {
    window.location.href=`${BACKEND_IP_PORT}/oauth2/authorization/kakao`;
});

signInBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    if (await validateSignIn()) { 
        loading.style.display = 'block';
        loadingBackground.style.display = 'block';
        signInBtn.disabled = true;
        
        setTimeout(() => {
            signInBtn.style.backgroundColor = '#8a9f8f';
            signInBtn.disabled = false;
            loading.style.display = 'none';
            loadingBackground.style.display = 'none';
            window.location.href = '/posts';
        }, 3000);        
    }
});



async function validateSignIn() {
    const email = emailInput.value;
    const password = passwordInput.value;

	if (!validateEmailFormat(email)) { 
        helperText.style.visibility = 'visible'; 
        helperText.textContent = "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";

        return false;
    }

    if (!password) {
        helperText.style.visibility = 'visible';
        helperText.textContent = "*비밀번호를 입력해주세요.";

        return false;
    }

    if(!validatePasswordFormat(password)) {
        helperText.style.visibility = 'visible';
        helperText.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포합해야 합니다.";

        return false;
    }

    const flag = {'flag' : false};

    await validateAccount(flag, email, password);
    
    if (flag['flag']) {
        document.getElementById('sign-in-btn').style.backgroundColor = '#748578';
        helperText.style.visibility = 'hidden';
        
        return flag['flag'];
    }
    
    helperText.style.visibility = 'visible';
    helperText.textContent = "*비밀번호가 다릅니다.";
    
            
    return flag['flag'];
}


function validateEmailFormat(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	return emailRegex.test(email);
}


function validatePasswordFormat(password) {
    const passwordRegax = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
    return passwordRegax.test(password);
}

async function validateAccount(flag, email, password) {
    console.log('로그인시도!')
    const obj = {
        username : `${email}`,
        password : `${password}`
    }

    const formData = new FormData();
    Object.entries(obj).forEach(([key, value]) => formData.append(key, value));

    const data = {
        method: 'POST',
        body: formData,
        credentials: 'include'
    }
    
    await fetch(`${BACKEND_IP_PORT}/login`, data) 
        .then(response => {
            console.log(`게정 검증결과: ${response.status}`);
            if (response.status === 200) {    
                const id = response.headers.get('user-id')
                localStorage.setItem("user-id", id)
                flag['flag'] = true;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
