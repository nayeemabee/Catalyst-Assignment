# Catalyst Count

Catalyst Count is a Django-based application designed to handle user registration, login, and the chunked upload of files. The application uses Django Rest Framework, django-allauth for authentication, and django-chunked-upload for handling large file uploads. The uploaded data is saved in the Company database, and the application provides APIs to query this data.

## Features

1. *User Registration and Login*
   - User registration and login using Django Rest Framework and django-allauth.
   - Token and session authentication.

2. *Chunked File Upload*
   - Handle large file uploads using django-chunked-upload.
   - Save uploaded data into the Company database.

3. *Data Querying*
   - APIs to query data in the Company and User database.

## Installation

### Prerequisites

- Python 3.8+
- PostgreSQL


## Usage

### User Registration and Login
- Use the endpoints provided by django-allauth to register and log in users.

### Chunked File Upload
- Use the chunked upload endpoint to upload large files. The data will be saved in the Company database.

### Query Data
- Use the provided API endpoints to query data in the Company database.

## API Endpoints

### Authentication
- *Register*: /api/user/register/
- *Login*: /api/user/login/
- *Logout*: /api/user/logout/

### Accunts
- *Auth Accounts*: /accounts/

### Chunked Upload
- *Upload*: /api/upload/
- *Upload-Complete*: /api/upload-complete/

### Catalyst Count
- *Query Data*: /api/companies/

### Users
- *Users*: /api/active-users/

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements
- [Django](https://www.djangoproject.com/)
- [Django Rest Framework](https://www.django-rest-framework.org/)
- [django-allauth](https://django-allauth.readthedocs.io/en/latest/)
- [django-chunked-upload](https://github.com/juliomalegria/django-chunked-upload)