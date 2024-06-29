const loginUrl = 'http://localhost:8000/api/user/login/';
// const logout = 'http://localhost:8000/api/user/logout/';
const users = 'http://localhost:8000/api/active-users/';
const uploadUrl = 'http://localhost:8000/api/upload/';
const completeUrl = 'http://localhost:8000/api/upload-complete/';
const companies = 'http://localhost:8000/api/companies/';


// function to get active users
async function fetchUsers(token) {
    try {
        const response = await fetch(users, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const users = await response.json();
        console.log(users)

        const userTable = document.getElementById('userTable');

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.is_active ? 'Yes' : 'No'}</td>
            `;
            userTable.appendChild(row);
        });
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Function to login user
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    console.log(loginForm)
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
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
                        document.addEventListener('DOMContentLoaded', fetchUsers(localStorage.getItem('token')));
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

        reader.onload = function (e) {
            const spark = new SparkMD5.ArrayBuffer();
            spark.append(e.target.result);
            const md5Hash = spark.end();
            resolve(md5Hash);
        };

        reader.onerror = function (e) {
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
    const progressBar = document.getElementById('uploadProgress');

    if (!file) {
        alert('Please select a file.');
        return;
    }

    try {
        let md5Hash;
        const chunkSize = 1 * 1024 * 1024; 
        let offset = 0;
        let chunkNumber = 1;
        const token = localStorage.getItem("token");

        async function uploadChunk() {
            const chunk = file.slice(offset, offset + chunkSize);
            md5Hash = await calculateMD5(chunk);
            let uploadId = null;

            const formData = new FormData();
            formData.append('file', chunk);

            if (uploadId !== null) {
                formData.append('upload_id', uploadId);
            }

            try {
                const response = await fetch(uploadUrl, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Authorization': 'Token ' + token,
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Error uploading chunk');
                }

                const data = await response.json();
                offset += chunkSize;
                chunkNumber += 1;
                uploadId = data.upload_id;

                // Update the progress bar
                const progress = Math.min((offset / file.size) * 100, 100);
                progressBar.value = progress;

                if (offset < file.size) {
                    uploadChunk();
                } else {
                    completeUpload(data.upload_id);
                }
            } catch (error) {
                console.error('Error uploading chunk:', error);
                alert('Error uploading chunk');
            }
        }

        // complete upload 
        async function completeUpload(uploadId) {
            const formData = new FormData();
            formData.append('upload_id', uploadId);
            formData.append('md5', md5Hash);

            try {
                const response = await fetch(completeUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Token ' + token
                    },
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Error completing upload');
                }

                const data = await response.json();
                alert('Upload complete');
            } catch (error) {
                alert(error.message);
            }
        }

        uploadChunk();
    } catch (error) {
        console.error('Error while uploading a file', error);
    }
}