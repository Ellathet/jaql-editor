# JAQL Filter Editor

A Next.js web application for editing, validating, and exporting Sisense Filter JAQL configurations, without need to edit directly the JSON.

## Overview

The JAQL Filter Editor allows you to:

- **Parse JAQL JSON** - Import existing filter configurations from Sisense dashboards
- **Edit Filters** - Modify filter properties with an intuitive UI
- **Dynamic Input Types** - Automatically detect and display appropriate input types:
  - **Text fields** for text columns
  - **Number inputs** for numeric values
  - **Date pickers** for datetime/date columns.
- **Smart Filter Logic** - Control filter behavior with:
  - Explicit Filter mode (define specific members)
  - Multi-selection support
  - Select All option (mutually exclusive with Explicit)
- **Export Results** - Generate updated JAQL JSON configurations
- **Download/Copy** - Save or copy exported configurations to clipboard

## Setup Instructions

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 ([Install pnpm](https://pnpm.io/installation))

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd jaql-render
   ```

2. **Install dependencies using pnpm:**
   ```bash
   pnpm install
   ```

   This will install all required packages including:
   - React & React DOM
   - Next.js
   - Shadcn UI components
   - Tailwind CSS
   - TypeScript
   - Sonner (toast notifications)
   - Lucide React (icons)

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

The app will auto-reload as you make changes to the code.

### Build for Production

```bash
pnpm build
pnpm start
```

## Usage Guide

### 1. Input JAQL JSON

Paste your Sisense JAQL filter configuration in the JSON input field. The configuration should be an array of filter objects with the following structure:

```json
[
  {
    "jaql": {
      "table": "DimCountries",
      "column": "CountryName",
      "datatype": "text",
      "filter": {
        "explicit": false,
        "multiSelection": true,
        "all": true
      }
    },
    "instanceid": "5BE57-434B-09",
    "isCascading": false,
    "disabled": false
  }
]
```

### 2. Edit Filters

Once parsed, filters appear in the "Edit Filters" section where you can:

- **Toggle Filter Properties:**
  - **Explicit Filter** - When enabled, define specific member values (auto-disables Select All)
  - **Multi-Selection** - Allow/disallow multiple members (disabling limits to 1 member)
  - **Select All** - Include all members (auto-disables Explicit Filter)
  - **Use Condition Filters** - Switch from member-based to condition-based filtering with operators

- **Condition Filters** (NEW) - When enabled on an Explicit Filter:
  - Choose from 10 condition operators:
    - **Text Operators**: Contains, Does not contain, Starts with, Does not start with, Ends with, Does not end with
    - **Equality Operators**: Equals, Does not equal
    - **Presence Operators**: Is empty, Is not empty
  - **Logical Connectors** - Combine multiple conditions with AND/OR logic
  - **Smart Inputs** - Automatically uses appropriate input type based on column datatype

- **Add/Remove Members** - Input values based on column datatype
- **View Filter Metadata** - See column, table, and datatype information

### 3. Export Results

Click "Export Results" to generate the updated JAQL configuration. The output appears with options to:
- **Copy to Clipboard** - Quick copy for pasting elsewhere
- **Download JSON** - Save as a timestamped JSON file

## Project Structure

```
jaql-render/
├── app/
│   ├── page.tsx              # Main application page
│   ├── FilterForm.tsx        # Filter editing component
│   ├── layout.tsx            # App layout
│   ├── globals.css           # Global styles & Sisense color theme
│   ├── types.ts              # TypeScript type definitions
│   └── utils.ts              # Utility functions
├── components/
│   └── ui/                   # Shadcn UI components
│       ├── button.tsx
│       ├── checkbox.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── card.tsx
│       ├── alert.tsx
│       └── ...
├── lib/
│   └── utils.ts              # Shared utility functions
├── public/                   # Static assets
├── package.json              # Project dependencies
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS theme (Sisense brand)
└── README.md                 # This file
```

## Limitations

### Known Limitations

1. **Cascading Filters** - Display only; editing cascading filter hierarchies directly is not yet supported
2. **Complex JAQL** - Advanced JAQL properties (not related to basic filtering) are not editable through the UI
3. **Large Datasets** - JSON inputs with very large member lists (100,000+) may experience performance lag
4. **Member Validation** - The app doesn't validate if entered member values actually exist in the data source
5. **Timezone Handling** - Date conversions follow browser timezone; no explicit timezone configuration available
6. **Complex Filter Conditions** - Does not support complex filtering conditions (AND/OR logic), only member-based filters

### Browser Support

- Chrome/Edge >= 90
- Firefox >= 88
- Safari >= 14
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Known Issues & Problems

### Issues Found

1. **Date Format Conversion**
   - **Issue**: Dates stored internally as YYYY-MM-DD may display inconsistently if user input is malformed
   - **Workaround**: Ensure dates follow MM/DD/YYYY format strictly (e.g., 01/15/2024)
   - **Status**: Will be improved with better validation in future versions

2. **Multi-Selection Disabling**
   - **Issue**: Hidden members (beyond the first) when multi-selection is disabled may not be removed from the underlying data
   - **Workaround**: Manually remove extra members before disabling multi-selection
   - **Status**: UI hides them, but export includes hidden values

3. **Explicit Filter & Select All Collision**
   - **Current Behavior**: Enabling one automatically disables the other (mutually exclusive)
   - **Note**: This is intentional design, not a bug

4. **Large JSON Performance**
   - **Issue**: Parsing JAQL files with 50,000+ filter members can take 2-5 seconds
   - **Workaround**: Split large configurations into smaller batches
   - **Status**: Optimization planned for future releases

5. **Special Characters in Member Values**
   - **Issue**: Some special chars (quotes, backslashes) may not be properly escaped in export
   - **Workaround**: Manually verify exported JSON after export
   - **Status**: Improved escaping to be added in next version

6. **Empty Filter Arrays**
   - **Issue**: Parsing completely empty arrays may result in confusing error message
   - **Workaround**: Ensure at least one valid filter object is present
   - **Status**: Better error messages being implemented

7. **Cascading Filter Display**
   - **Issue**: Very deep cascading hierarchies (10+ levels) may exceed viewport height
   - **Workaround**: Use browser zoom-out or mobile responsive view
   - **Status**: Scroll container will be added in future update

8. **Copy to Clipboard Timing**
   - **Issue**: On very large exports (100KB+ JSON), copy has slight delay before confirming
   - **Workaround**: Wait 1-2 seconds after clicking copy before assuming it failed
   - **Status**: Async handling being improved

9. **Numeric Input Precision**
   - **Issue**: Very large numbers (> 2^53) may lose precision due to JavaScript number limitations
   - **Workaround**: Manually verify large numeric values in exported JSON
   - **Status**: Consider as limitation of JavaScript itself

10. **Missing Datasource Info**
    - **Issue**: If datasource information is missing from JAQL, filter cannot validate data types
    - **Workaround**: Ensure complete JAQL structure with datasource metadata
    - **Status**: Gracefully handled with fallback to text input

11. **Condition Filters & Members**
    - **Note**: Condition filters and member-based filters are mutually exclusive within the same explicit filter
    - **Behavior**: Enabling "Use Condition Filters" clears members list; disabling it removes conditions
    - **Status**: Intentional design for clarity and data consistency

---

## Advanced Features

### Condition Filtering

When "Explicit Filter" is enabled, you can toggle "Use Condition Filters" to switch from member-based to condition-based filtering:

**Available Operators:**
- **Text Matching**: Contains, Does not contain, Starts with, Does not start with, Ends with, Does not end with
- **Equality**: Equals, Does not equal
- **Presence**: Is empty, Is not empty

**Combining Conditions:**
- Single condition: Applied directly to the filter
- Multiple conditions: Choose AND (all must match) or OR (any can match)

**Example Usage:**
1. Enable "Explicit Filter"
2. Check "Use Condition Filters"
3. Add condition: `operator: "contains", value: "test"`
4. For multiple conditions, click "+ Add Condition"
5. Select AND/OR logic to combine them
6. Export to generate updated JAQL with conditions



### Reporting Issues

If you encounter a problem:

1. Note the exact steps to reproduce
2. Include the JAQL JSON that caused the issue
3. Check if it's listed in the "Known Issues" section above
4. Submit details with error messages or screenshots

### Future Enhancements

Planned features for future releases:

- [ ] Cascading filter editing support
- [ ] Direct Sisense API integration for live validation
- [ ] Batch filter operations
- [ ] Filter templates & presets
- [ ] Dark mode theme
- [ ] Advanced JAQL property editor
- [ ] Filter comparison/diff tool
- [ ] JSON schema validation
- [ ] Filter cloning functionality
- [ ] Search & filter within the editor

---

## Dependencies

Key dependencies in this project:

- **Next.js 16.1.6** - React framework
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Shadcn UI** - Component library
- **Sonner 2.0.7** - Toast notifications
- **Lucide React 0.564.0** - Icons
- **Radix UI 1.4.3** - Accessible UI primitives

---

## License

This project is part of the Sisense ecosystem.

---

## Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `pnpm dev` |
| Build for production | `pnpm build` |
| Start production server | `pnpm start` |
| Run linting | `pnpm lint` |
| Install dependencies | `pnpm install` |
| Update dependencies | `pnpm update` |

---

**Last Updated:** February 2026  
**Version:** 0.1.0

## Getting Started



```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
