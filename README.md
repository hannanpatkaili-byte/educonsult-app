# EduConsultApp

Mobile app for: Courses + Blog + Consultation + Digital Prescription.
Connects to your live PHP backend at `https://drhannanime.com/myapp-api/api`
(see `src/api/client.js` if you need to change this URL).

## Getting an APK (no computer needed)

### 1. Push this code to GitHub
1. Create a new GitHub repo (e.g. `educonsult-app`).
2. Upload this whole folder (minus `node_modules`, which is already excluded) via
   GitHub's web "Add file -> Upload files", same way as the backend.

### 2. Connect to Expo (expo.dev)
1. Sign in at expo.dev with the same account you created earlier.
2. Create a new project, and link it to your GitHub repo (Expo supports importing
   straight from GitHub — look for "Import from GitHub" / "Create a build" from
   the dashboard).
3. If asked for a project ID, run is not needed from your side — Expo's dashboard
   build flow handles this when importing from GitHub.

### 3. Trigger an EAS Build
From the Expo dashboard (expo.dev), start a new **Android build**:
- Build profile: `preview` (this makes an installable `.apk` file directly,
  easiest for testing on your own phone)
- Expo builds it on their servers — takes a few minutes.
- When done, you get a direct download link for the `.apk`.

### 4. Install on your phone
Download the `.apk` link on your phone, open it, allow "install from unknown
sources" if asked, and install. The app is now on your phone!

## Project structure
- `src/api/` — functions that call your backend (auth, courses, blog, consultations, prescriptions)
- `src/context/AuthContext.js` — keeps track of the logged-in user across the app
- `src/screens/` — all the screens, organized by feature
- `src/navigation/AppNavigator.js` — bottom tabs (Courses, Blog, Consult, Rx, Profile) + the
  screens inside each tab

## Changing the backend URL
If you ever move the backend or change the folder name on Hostinger, update:
`src/api/client.js` -> `API_BASE`
