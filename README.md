# Budget Tracker App

A funky, colorful budget tracking application built with Next.js, TypeScript, and Tailwind CSS. Track your earnings, expenses, and budget projections with a beautiful, modern interface.

## Features

- 🎨 **Funky Colorful Design** - Beautiful pastel colors with purple as the base palette
- 🌙 **Dark/Light Mode** - Seamless theme switching with next-themes
- 👥 **Multi-Person Support** - Attach earnings and expenses to different people
- 📊 **Budget Pages** - Create multiple budget pages for different purposes
- 💰 **Real-time Calculations** - Automatic budget summaries and projections
- 🔐 **Simple Authentication** - Password-based authentication
- 💾 **File-based Storage** - Data stored locally in JSON files
- 📱 **Responsive Design** - Works perfectly on all devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom CSS variables
- **Themes**: next-themes for dark/light mode
- **Storage**: File system (JSON files in config folder)
- **Authentication**: Simple password-based with cookies

## Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd finance
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Edit `.env.local` and add your password:
```env
APP_PASSWORD=your-secure-password-here
```

5. Start the development server:
```bash
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### First Time Setup

1. Navigate to the login page
2. Enter the password you set in `.env.local`
3. Create your first budget page
4. Start adding earnings and expenses!

## Usage

### Creating Budget Pages
- Click the "+ New Budget" button in the tabs
- Enter a name for your budget page
- Switch between budget pages using the tabs

### Adding People
- When adding earnings or expenses, click "+ Add Person"
- Enter the person's name
- They'll get a random colorful badge
- Select people to attach to transactions

### Adding Transactions
- Use the "Add Earning" or "Add Expense" buttons
- Enter amount and description
- Optionally attach to a person
- View all transactions in the lists below

### Settings
- Click the ⚙️ icon in the top right
- Switch between light and dark themes
- Change currency format
- Settings are saved automatically

## Data Storage

All data is stored locally in the `config/app-data.json` file:
- People profiles with colors
- Budget pages with earnings and expenses
- App settings (theme, currency)

## Project Structure

```
src/
├── app/
│   ├── _components/          # Reusable components
│   │   ├── ui/              # Basic UI components
│   │   └── features/        # Feature-specific components
│   ├── _libs/               # Utilities and server actions
│   ├── _types/              # TypeScript type definitions
│   ├── _utils/              # Helper functions
│   ├── (auth)/              # Authentication routes
│   ├── (dashboard)/         # Protected dashboard routes
│   └── api/                 # API routes
├── config/                  # Data storage directory
└── public/                  # Static assets
```

## Customization

### Colors
The app uses a purple-based color palette. You can customize colors in:
- `src/app/globals.css` - CSS variables
- `src/app/_utils/calculations.ts` - Person color generation

### Styling
All styling is done with Tailwind CSS classes. The design system includes:
- Gradient backgrounds
- Rounded corners
- Smooth transitions
- Responsive breakpoints

## Development

### Code Standards
- All files under 250 lines
- Modular, reusable components
- TypeScript strict mode
- No inline imports
- Proper type definitions

### Adding Features
1. Define types in `_types/index.ts`
2. Add server actions in `_libs/serverActions.ts`
3. Create components in appropriate folders
4. Update data storage utilities if needed

## License

This project is open source and available under the MIT License.
