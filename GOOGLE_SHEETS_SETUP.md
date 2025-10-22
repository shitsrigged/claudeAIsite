# Google Sheets Setup Instructions

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Portfolio Gifs Database"

## Step 2: Set Up Your Columns

In the first row (header row), create these exact column names:

| url | name | link | directedBy | producedBy | client | year |
|-----|------|------|------------|------------|--------|------|

**Important:** Column names must match exactly (case-sensitive)

## Step 3: Add Your Data

Fill in your gif data in the rows below. Example:

| url | name | link | directedBy | producedBy | client | year |
|-----|------|------|------------|------------|--------|------|
| gifs/1_1_Final_gold_shrine_video_3k0001-0300_AdobeExpress.gif | Gold Shrine Campaign | https://youtube.com/watch?v=ABC123 | Jane Doe | John Smith | Nike | 2024 |
| gifs/doja_AdobeExpress.gif | Doja Cat Music Video | https://youtube.com/watch?v=XYZ789 | Jane Doe | Sarah Lee | Atlantic Records | 2023 |

**Tips:**
- Make sure the `url` column matches your actual gif filenames in the `gifs` folder
- Links should be full URLs (include https://)
- Don't use commas within your cell data (they'll break the CSV parsing)

## Step 4: Publish Your Sheet as CSV

1. Click **File** → **Share** → **Publish to web**
2. In the dialog:
   - First dropdown: Select the specific sheet tab you want to publish
   - Second dropdown: Select **Comma-separated values (.csv)**
3. Click **Publish**
4. Copy the URL it gives you (should look like: `https://docs.google.com/spreadsheets/d/e/...../pub?output=csv`)

## Step 5: Update Your Website

1. Open `script.js` in your code editor
2. Find line 2: `const GOOGLE_SHEET_URL = 'YOUR_PUBLISHED_GOOGLE_SHEET_URL_HERE';`
3. Replace `'YOUR_PUBLISHED_GOOGLE_SHEET_URL_HERE'` with your copied URL
4. Save the file

Example:
```javascript
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQxxx.../pub?output=csv';
```

## Step 6: Test Your Setup

1. Open your website in a browser
2. Open the browser console (F12 or right-click → Inspect → Console)
3. Look for a message: `Loaded gifs from Google Sheets: [...]`
4. If you see this, it's working!
5. If you see "Failed to load from Google Sheets", check:
   - Is the URL correct?
   - Did you publish to web as CSV?
   - Is the sheet publicly accessible?

## Updating Your Data

Once set up, you can edit your Google Sheet anytime:
1. Make changes to the sheet
2. Refresh your website
3. The new data will load automatically!

**Note:** Changes may take a few minutes to appear due to Google's caching. You can add `?timestamp=${Date.now()}` to the URL in your code to force fresh data.

## Fallback Data

If Google Sheets fails to load for any reason, the website will automatically use the fallback data defined in `script.js` (starting at line 5). This ensures your site always works!
