# Catalyst Count

Catalyst Count is a Django-based application designed to handle user registration, login, and the chunked upload of files. The application uses Django Rest Framework, django-allauth for authentication, and django-chunked-upload for handling large file uploads. The uploaded data is saved in the CatalystCount model, and the application provides APIs to query this data.

## Features

1. *User Registration and Login*
   - User registration and login using Django Rest Framework and django-allauth.
   - Token and session authentication.

2. *Chunked File Upload*
   - Handle large file uploads using django-chunked-upload.
   - Save uploaded data into the CatalystCount model.

3. *Data Querying*
   - APIs to query data in the CatalystCount model.

## Installation

### Prerequisites

- Python 3.8+
- PostgreSQL


## Usage

### User Registration and Login
- Use the endpoints provided by django-allauth to register and log in users.

### Chunked File Upload
- Use the chunked upload endpoint to upload large files. The data will be saved in the CatalystCount model.

### Query Data
- Use the provided API endpoints to query data in the CatalystCount model.

## API Endpoints

### Authentication
- *Register*: /auth/registration/
- *Login*: /auth/login/
- *Logout*: /auth/logout/

### Chunked Upload
- *Upload*: /chunked_upload/

### Catalyst Count
- *Query Data*: /api/catalyst_count/

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements
- [Django](https://www.djangoproject.com/)
- [Django Rest Framework](https://www.django-rest-framework.org/)
- [django-allauth](https://django-allauth.readthedocs.io/en/latest/)
- [django-chunked-upload](https://github.com/juliomalegria/django-chunked-upload)