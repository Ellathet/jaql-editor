# JAQL Filter Editor

A Next.js web application for editing and exporting Sisense Filter JAQL configurations via UI instead of manually editing JSON.

## Setup

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
cd jaql-render
pnpm install
```

### Development

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
pnpm build
pnpm start
```

## Usage

1. **Paste JAQL JSON** - Import your filter configuration
2. **Edit Filters** - Modify properties, add/remove members
3. **Export** - Generate updated JAQL JSON

### Example JAQL Input

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

## Project Structure

```
jaql-render/
├── app/
│   ├── page.tsx              # Main application
│   ├── FilterForm.tsx        # Filter editor
│   ├── utils.ts              # Utilities
│   └── types.ts              # Type definitions
├── components/ui/            # Shadcn UI components
├── lib/
│   └── utils.ts              # Shared utilities
└── public/
```

## Limitations

- Cascading filters are displayed but cannot be edited
- Does not validate if member values exist in the datasource
- Very large datasets (100,000+ members) may experience performance lag
- Dates are converted using browser timezone
- No support for complex AND/OR filter conditions
