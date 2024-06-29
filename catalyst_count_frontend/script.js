const loginUrl = 'http://localhost:8000/api/user/login/';
// const logout = 'http://localhost:8000/api/user/logout/';
const users = 'http://localhost:8000/api/active-users/';
const uploadUrl = 'http://localhost:8000/api/upload/';
const completeUrl = 'http://localhost:8000/api/upload-complete/';
const companies = 'http://localhost:8000/api/companies/';



// Function to login user
document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    console.log(loginForm)
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            console.log(username, password)

            fetch(loginUrl, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
            })
            .then(response => response.json())
            .then(data => {

                if (data.token) {
                    // debugger
                    localStorage.setItem('token', data.token);
                    localStorage.setItem("loggedIn", true);
                    console.log(localStorage.getItem('token'));
                    window.location.href = 'home.html';
                } else {
                    alert('Invalid credentials');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    }

    // Check if the user is logged in on the homepage
    if (window.location.pathname.includes("home.html")) {
        if (!localStorage.getItem("loggedIn")) {
            window.location.href = "login.html";
        }
    }
});


// function to logout user
function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("token");
    window.location.href = "login.html";
}


// function to calculate MD5 
async function calculateMD5(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(e) {
            const spark = new SparkMD5.ArrayBuffer();
            spark.append(e.target.result);
            const md5Hash = spark.end();
            resolve(md5Hash);
        };

        reader.onerror = function(e) {
            reject(e);
        };

        reader.readAsArrayBuffer(file);
    });
}

// function to split file into chunks
async function splitFileIntoChunks(file, chunkSize) {
    const chunks = [];
    let offset = 0;

    while (offset < file.size) {
        const chunk = file.slice(offset, offset + chunkSize);
        chunks.push(chunk);
        offset += chunkSize;
    }

    return chunks;
}

// Function to upload file
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file.');
        return;
    }

    try {
        const md5Hash = await calculateMD5(file);

        console.log(md5Hash);


        const chunkSize = 10 * 1024 * 1024; // 10MB
        let offset = 0;
        let chunkNumber = 1;

        const token = localStorage.getItem("token");

        function uploadChunk() {
            const chunk = file.slice(offset, offset + chunkSize);
            const uploadId = null;

            const formData = new FormData();
            formData.append('file', chunk);
            formData.append('upload_id', uploadId);
            formData.append('chunk_number', chunkNumber);

            fetch(uploadUrl, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + token,
                },
                body: formData

            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error uploading chunk');
                }
                return response.json(); // Assuming response is JSON
            })
            .then(response => {
                offset += chunkSize;
                chunkNumber += 1;
                console.log(response);
            
                if (offset < file.size) {
                    uploadChunk();
                } else {
                    completeUpload(response.upload_id);
                }
            })
            .catch(error => {
                console.error('Error uploading chunk:', error);
                alert('Error uploading chunk');
            });
            
        }

        function completeUpload(uploadId) {
            $.ajax({
                url: completeUrl,
                type: 'POST',
                data: { upload_id: uploadId, md5: md5Hash },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Token ' + token);
                },
                success: function (response) {
                    alert('Upload complete');
                },
                error: function () {
                    alert('Error completing upload');
                }
            });
        }

        uploadChunk();

    } catch (error) {
        console.error('Error while uploading a file', error);
    }
}