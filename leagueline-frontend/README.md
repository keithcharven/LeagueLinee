# LeagueLine frontend

React + Vite + Tailwind 3 + React Router 6 + TanStack Query + Axios.

    npm install
    cp .env.example .env     # set VITE_GOOGLE_CLIENT_ID; keep VITE_USE_MOCK=true to run without the backend
    npm run dev

Mock mode (default) serves data from `src/services/mockData.js` and shows demo sign-in buttons.
Set `VITE_USE_MOCK=false` to call the Spring Boot API at `VITE_API_URL`.

Expected endpoints are listed in `src/services/leagueService.js` and `authService.js`.
Roles: `TEAM_MANAGER`, `ORGANIZER` (returned by `POST /auth/google` as `user.role`).
