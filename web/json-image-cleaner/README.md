# JSON Image Cleaner

A single-page Next.js application that runs entirely in the browser (client-side only, no backend, no external APIs).

## Features

- **JSON Upload**: Drag & drop or click to upload JSON files
- **Automatic Image Detection**: Recursively finds image URLs in JSON objects
- **Image Validation**: Validates images using browser's Image loading (8s timeout)
- **Card-based UI**: Visual cards with image previews and status indicators
- **Filtering Tabs**: Filter by All, All Valid, Any Valid, Some Broken, All Broken, No Images, Selected
- **Bulk Selection**: Select all on tab, select all with any/all valid images, invert selection
- **Export**: Download selected items as JSON or copy to clipboard
- **Live Metrics**: Real-time counters for all filter states

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

### Testing

```bash
npm test
```

## Usage

1. Upload a JSON file (drag & drop or click to browse)
2. The app will automatically detect image URLs in your JSON
3. Images are validated in parallel (8 concurrent by default)
4. Use tabs to filter by status
5. Select items and export filtered JSON

## Sample Files

Sample JSON files are available in the `samples/` directory:
- `sample.json` - Basic test cases
- `sample2.json` - Additional test scenarios

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Zustand (state management)
- react-dropzone (file upload)
- date-fns (date formatting)

## JSON Format

The app accepts JSON in these formats:
- Array: `[{}, {}, ...]`
- Object with single array property: `{ "items": [{}, {}, ...] }`

## Browser Requirements

- Modern browser with JavaScript enabled
- All processing happens client-side
- No server or API calls required
