# Kelemat Pallet 🎨

The Infinite Color Library for Frontend Developers.

**Kelemat Pallet** is a modern, AI-powered web application that generates aesthetically pleasing color palettes on demand. Built with React, Tailwind CSS, and the Google Gemini API, it provides developers and designers with endless inspiration for their projects.

## ✨ Features

-   **AI-Powered Generation**: Utilizes Google's Gemini 2.5 Flash model to create coherent and themed color schemes.
-   **Themed Categories**: Generate palettes for specific vibes like "UI Dashboard", "Neon", "Vintage", "Dark Mode", and more.
-   **Comprehensive Export Options**:
    -   **Code**: CSS Variables, SCSS, Tailwind Config, JSON.
    -   **Visuals**: PNG Image, SVG Vector.
    -   **Sharing**: Copy URL, Web Share API, Twitter, Pinterest.
    -   **Print**: PDF export.
-   **Responsive Design**: Fully optimized for mobile, tablet, and desktop experiences.
-   **Instant Interactions**: One-click copy for Hex codes.

## 🛠️ Tech Stack

-   **Frontend**: React 19, TypeScript
-   **Styling**: Tailwind CSS
-   **AI/Backend**: Google Gemini API (`@google/genai` SDK)
-   **Icons**: Heroicons / Custom SVG

## 🚀 Getting Started

To run this project locally:

1.  **Clone the repository**
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Configure API Key**
    Create a `.env` file and add your Google Gemini API key:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```
    *Note: The application expects the API key to be available via `process.env.API_KEY`.*

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## 📦 Export Formats

-   **CSS**: Root variables (`--color-1`, etc.)
-   **SCSS**: SASS variables (`$color-1`, etc.)
-   **Tailwind**: A configuration object ready to paste into `tailwind.config.js`.
-   **JSON**: Raw data structure of the palette.
-   **Image**: High-quality PNG generation.
-   **SVG**: Scalable vector strip of the palette.

## 👨‍💻 Author

Developed by **Robel Shemeles**.

---

*Powered by Google Gemini*