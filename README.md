Video Demonstrations Link: https://drive.google.com/file/d/1tkLF9FYXGJRx9hTpzciBUUeDvce3rOja/view?usp=sharing

GitHub Link: https://github.com/ZiaSaafir/university-research-opportunity-portal

# University Research Opportunity Portal

A web-based application for discovering, viewing, creating, updating, closing, and deleting university research opportunities. The project uses Django REST Framework for the backend API and HTML, CSS, and JavaScript for the frontend.

## Project Objectives

- Display available university research opportunities.
- View complete details of a selected opportunity.
- Create new research opportunities.
- Update existing opportunity information.
- Change an opportunity's status from Open to Closed.
- Delete research opportunities.
- Search by title, faculty member, or required skills.
- Filter opportunities by research area.
- Validate required fields and display success or error messages.

## Technologies Used

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| Django | Backend web framework |
| Django REST Framework | REST API development |
| SQLite | Database |
| HTML5 | Frontend structure |
| CSS3 | Frontend styling and responsive layout |
| JavaScript | API communication and frontend functionality |
| Postman | API testing |

## Project Structure

```text
research-opportunity-portal/
├── backend/
│   ├── config/
│   ├── opportunities/
│   ├── manage.py
│   ├── db.sqlite3
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── .gitignore
└── README.md
```

## Research Opportunity Information

Each research opportunity includes:

- Title
- Description
- Research area
- Faculty member
- Department
- Required skills
- Available positions
- Application deadline
- Status: Open or Closed

## Installation and Setup

### 1. Prerequisites

Install Python and Git. Postman is recommended for testing the API.

### 2. Open the backend directory

Open a terminal and navigate to the backend folder:

```bash
cd backend
```

### 3. Install dependencies

```bash
python -m pip install -r requirements.txt
```

### 4. Apply database migrations

```bash
python manage.py migrate
```

### 5. Start the Django development server

```bash
python manage.py runserver
```

The backend API will be available at:

http://127.0.0.1:8000/

## Running the Frontend

Keep the Django server running.

Open `frontend/index.html` in a web browser. The frontend sends HTTP requests to the Django API at:

http://127.0.0.1:8000/api/opportunities/

If the frontend cannot connect to the API, verify that Django is running and that the configured CORS settings allow local frontend requests.

## API Endpoints

The API base URL is:

`http://127.0.0.1:8000/api/opportunities/`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/opportunities/` | Retrieve all opportunities |
| POST | `/api/opportunities/` | Create an opportunity |
| GET | `/api/opportunities/<id>/` | Retrieve one opportunity |
| PUT | `/api/opportunities/<id>/` | Update an opportunity |
| DELETE | `/api/opportunities/<id>/` | Delete an opportunity |

Replace `<id>` with the numeric ID of the required opportunity.

### Example: Retrieve All Opportunities

```http
GET http://127.0.0.1:8000/api/opportunities/
```

### Example: Create an Opportunity

```http
POST http://127.0.0.1:8000/api/opportunities/
Content-Type: application/json
```

Example JSON body:

```json
{
  "title": "AI Research Assistant",
  "description": "Research machine learning methods for academic projects.",
  "research_area": "Artificial Intelligence",
  "faculty_name": "Dr. Ahmed",
  "department": "Computer Science",
  "required_skills": "Python, Machine Learning",
  "available_positions": 3,
  "application_deadline": "2027-01-31",
  "status": "Open"
}
```

Use a valid future deadline when testing, and ensure the field names and status choices match the backend serializer.

## Testing

Test the API using Postman and verify:

1. Retrieve all opportunities.
2. Create an opportunity.
3. Retrieve an opportunity by ID.
4. Update opportunity information.
5. Change its status from Open to Closed.
6. Delete an opportunity.
7. Confirm that requesting a deleted or nonexistent ID returns an appropriate error.
8. Submit invalid or missing data and verify validation errors.

Also test the frontend search, research-area filter, details view, form submission, edit, close, and delete functions.

## Design Notes

The frontend uses standard HTML, CSS, and JavaScript. Django REST Framework provides the API, and SQLite stores opportunity records.

Authentication is not included because it is outside the stated project requirements.

## Development Notes

This project is intended for academic demonstration and local development. Before deploying it publicly, configure production security settings, restrict CORS origins, use an appropriate production database configuration, and configure a production web server.

by

**Ziaullah**

University Research Opportunity Portal — Academic Project
