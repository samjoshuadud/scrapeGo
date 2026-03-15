
## scrapeGo
- A manhwa reading app built with Go and React.

---

## 📂 Project Structure

The project is structured into two main directories:

- `/goScrape`: The Go backend server.
- `/scrapeGoClient`: The Vite + React frontend client.

---

## 🛠 Prerequisites

Ensure you have the following installed on your machine:
- [Go](https://go.dev/doc/install) (v1.25.0 or higher)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

---

## 🚀 Backend Setup (Go)

The backend exposes a REST API on port `8080` by default.

1. **Navigate to the backend directory:**
   ```bash
   cd goScrape
   ```

2. **Install Go Modules:**
   ```bash
   go mod download
   ```

3. **Configure Environment Variables (Optional):**
   - Create a `.env` file in the root of the `goScrape` directory.
   - You can set the port by defining `PORT` (defaults to `8080`).

4. **Run the Server:**
   ```bash
   go run cmd/server/main.go
   ```

The backend server should now be running at `http://localhost:8080`.

### Backend API Endpoints
- `GET /api/manhwas?page={page}`: Fetch a paginated list of manhwas.
- `GET /api/search?q={query}`: Search for manhwas by title.
- `GET /api/{slug}`: Get detailed info and chapters for a specific manhwa.
- `GET /api/chapter?manga={manga}&chapter={chapter}`: Fetch image pages for a specific chapter.

---

## 💻 Frontend Setup (Vite + React)

The frontend is a TypeScript React application styled with Tailwind CSS v4.

1. **Navigate to the frontend directory:**
   ```bash
   cd scrapeGoClient
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   *(Note: The project uses React 19 and Vite 8).*

3. **Configure Environment Variables (Optional):**
   - Create a `.env` file in the root of the `scrapeGoClient` directory (you can copy from `.env.example` if it exists).
   - Set `VITE_API_URL` to point to your backend API if it's running on a different domain. By default, development proxying will handle requests, but you can explicitly define it as follows:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```
   *(Note: In production with separate domains, make sure your hosting provider has the `VITE_API_URL` environment variable configured).*

To launch the site, run both the backend and frontend development servers.
