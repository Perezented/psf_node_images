# PSF Node Images Server

This project is a simple Node.js/Express server for serving and listing images, with support for both original and compressed images. It is designed for easy deployment and local use, and does not require a database.

## Features

- Serves images from `images/` and `compressed_images/` directories
- Lists all available images in each directory via API endpoints
- CORS enabled for cross-origin requests
- Session support (in-memory, not for production)
- Security best practices with Helmet
- Logging with Morgan

## Requirements

- Node.js (v12 or higher recommended)
- npm

## Installation

1. Clone the repository:
	```bash
	git clone <repo-url>
	cd PSF_Images_Server
	```
2. Install dependencies:
	```bash
	npm install
	```
3. Create `.env` file (optional, for custom PORT or URL):
	```env
	PORT=8080
	URL=http://localhost:8080
	SESSION_SECRET=your_secret
	COOKIE_SECURE=false
	```

## Usage

Start the server:

```bash
npm start
```

The server will run on the port specified in your `.env` file or default to `8080`.

## API Endpoints

### Root

- `GET /` — Returns a welcome message.

### List Images

- `GET /images` — Returns a JSON list of all images in the `images/` directory.
- `GET /compressed_images` — Returns a JSON list of all images in the `compressed_images/` directory.

### Get Image by Name

- `GET /images/:imagename` — Returns the binary data for the specified image from `images/`.
- `GET /compressed_images/:imagename` — Returns the binary data for the specified image from `compressed_images/`.

## Directory Structure

- `images/` — Place your original images here.
- `compressed_images/` — Place your compressed images here.
- `index.js` — Main server entry point (used by default)
- `server.js` — Alternative server entry (modular, for use as a library)

## Notes

- The server does not currently support image upload or database storage.
- Session storage is in-memory and not suitable for production.
- Make sure to set the `URL` variable in your `.env` for correct image URLs in the API responses.
