const deleteBtn = document.getElementById('delete-btn');

if (deleteBtn) {
    deleteBtn.addEventListener('click', e => {
        let id = document.getElementById('article-id').value;
        function success() {
            alert("삭제가 완료되었습니다.");
            location.replace("/articles");
        }
        function fail() {
            alert("삭제 실패했습니다.");
            location.replace("/articles");
        }

        httpRequest("DELETE", "/api/articles/" + id, null, success, fail);
    });
}

const modifyBtn = document.getElementById('modify-btn');

if (modifyBtn) {
    modifyBtn.addEventListener('click', e => {
        let params = new URLSearchParams(location.search);
        let id = params.get('id');

        body = JSON.stringify({
            title: document.getElementById("title").value,
            content: document.getElementById("content").value,
        });

        function success() {
            alert("수정 완료되었습니다.");
            location.replace("/articles/" + id);
        }
        function fail() {
            alert("수정 실패했습니다.");
            location.replace("/articles/" + id);
        }

        httpRequest("PUT", "/api/articles/" + id, body, success, fail);
    });
}

const createBtn = document.getElementById('create-btn');

if (createBtn) {
    createBtn.addEventListener('click', e => {
        body = JSON.stringify({
            title: document.getElementById("title").value,
            content: document.getElementById("content").value,
        });
        function success() {
            alert("등록 완료되었습니다.");
            location.replace("/articles");
        }

        function fail() {
            alert("등록 실패했습니다.");
            location.replace("/articles");
        }

        httpRequest("POST", "/api/articles", body, success, fail)
    });
}

// 쿠키를 가져오는 함수
function getCookie(key) {
    let result = null;
    const cookie = document.cookie.split(";");
    cookie.some(function (item) {
        item = item.replace(" ", "");
        const dic = item.split("=");

        if (key == dic[0]) {
            result = dic[1];
            return true;
        }
    });
    return result;
}

// HTTP 요청을 보내는 함수
function httpRequest(method, url, body, success, fail) {
    fetch(url, {
        method: method,
        headers: {
            // 로컬 스토리지에서 액세스 토큰 값을 가져와 헤더에 추가
            Authorization: "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
        },
        body: body,
    }).then((res) => {
        if (res.status === 200 || res.status === 201) {
            return success();
        }
        const refresh_token = getCookie("refresh_token");
        if (res.status === 401 && refresh_token) {
            fetch("/api/token", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refreshToken: getCookie("refresh_token"),
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                })
                .then((result) => {
                    // 재발급이 성공하면 로컬 스토리지값을 새로운 액세스 토큰으로 교체
                    localStorage.setItem("access_token", result.accessToken);
                    httpRequest(method, url, success, fail);
                })
                .catch((error) => fail());
        } else {
            return fail();
        }
    });
}