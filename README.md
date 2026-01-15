📚 World of Books – Web Scraping Project

🔍 Project Overview
This project is a full-stack web scraping application built to extract book data from the World of Books website and present it through a modern web interface.

The system demonstrates a complete scraping pipeline:

Scraping data using Playwright
Persisting scraped data into a PostgreSQL database
Serving data through REST APIs
Displaying data using a Next.js frontend
The architecture is designed following industry best practices, where scraping is performed in a controlled environment and production systems serve persisted data for stability and scalability.

🛠️ Tech Stack

Backend
NestJS – Backend framework
Playwright – Web scraping
TypeORM – ORM
PostgreSQL – Database
Node.js
Frontend
Next.js (App Router)
React
TypeScript
Deployment
Backend: Render
Database: Render PostgreSQL
Frontend: Vercel

🧩 System Architecture
Scraper (Playwright)
        ↓
PostgreSQL Database
        ↓
NestJS REST APIs
        ↓
Next.js Frontend


✨ Features
Scrapes book listings including:
Title
Price
Image
Product URL
Stores scraped data in PostgreSQL
REST APIs to fetch products
Dynamic frontend with:
Product listing page
Product detail page
Production-safe design (scraping disabled in live environment)

🚫 Important Note About Scraping in Production
Due to cloud environment limitations and best practices:
Live scraping is disabled in production
Scraping is executed in controlled environments (local or admin-triggered)
Production backend serves pre-scraped data from the database
This approach ensures:
Stability
Performance
Compliance with cloud restrictions
Scalable architecture

🌐 Live Project Links
🔹 Frontend (Live)
https://worldofbooks.vercel.app

🔹 Backend API
https://worldofbooks-backend-welg.onrender.com/products

🔹 GitHub Repository
https://github.com/satishkumarvermas/worldofbooks


⚙️ Running the Project Locally
1️⃣ Clone the Repository
git clone https://github.com/satishkumarvermas/worldofbooks.git
cd worldofbooks


2️⃣ Backend Setup
cd backend
npm install

Create .env file:
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=worldofbooks
PORT=3000

Run backend:
npm run start:dev


3️⃣ Run Scraper Locally
http://localhost:3000/products/scrape

Scraped data will be saved into the local database.

4️⃣ Frontend Setup
cd frontend
npm install

Create .env.local:
NEXT_PUBLIC_API_URL=http://localhost:3000

Run frontend:
npm run dev

Open:
http://localhost:3000


🧪 API Endpoints
Method
Endpoint
Description
GET
/products
Fetch all products
GET
/products/scrape
Trigger scraping (local / controlled only)

🧠 Key Design Decisions
Scraping is decoupled from user requests
Data persistence ensures frontend stability
Production environment optimized for reliability
Clear separation of concerns between layers

📌 Future Enhancements
Scheduled scraping using cron jobs
Pagination & filtering
Detailed product descriptions
Search and category filters
Admin dashboard for scraping control

👨‍💻 Author
Satish Verma📧 
Email: satishverma098123@gmail.com🔗 GitHub: https://github.com/satishkumarvermas

✅ Conclusion
This project demonstrates not only web scraping skills, but also:
Backend architecture
Production-ready deployment
API design
Frontend integration
Real-world engineering decisions
