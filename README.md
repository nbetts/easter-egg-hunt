# 🥚 Easter Egg Hunt

A virtual Easter egg hunt web app inspired by Cadbury's Worldwide Hide. Hide Easter eggs anywhere in the world using an interactive map and challenge friends to find them!

## Features

- 🗺️ **Interactive Map** - Powered by Mapbox with satellite imagery
- 🥚 **Hide Easter Eggs** - Click anywhere to hide your egg
- 🔗 **Shareable Links** - Unique URLs for each hidden egg
- 📏 **Distance Feedback** - See how far you are from the egg in miles
- 🎯 **Win at 100m** - Get within 100 meters to reveal the egg
- 📱 **Fully Responsive** - Works on desktop and mobile
- 🐰 **Easter Themed** - Beautiful pastel colors and animations

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Mapbox GL JS
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Mapbox account (free tier available)

### Environment Setup

1. Clone the repository and install dependencies:
```bash
cd easter-egg-hunt
npm install
```

2. Copy the environment file:
```bash
cp .env.example .env.local
```

3. Configure your environment variables in `.env.local`:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/easter_egg_hunt

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token_here
```

### Database Setup

1. Create your PostgreSQL database:
```bash
# If using PostgreSQL locally
createdb easter_egg_hunt
```

2. Run database migrations:
```bash
npm run db:generate
npm run db:migrate
```

Or push the schema directly:
```bash
npm run db:push
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Hiding an Egg

1. Navigate to the home page
2. Click anywhere on the map to select a location
3. Review the coordinates
4. Click "Create Easter Egg Hunt!"
5. Copy the generated link and share it with friends

### Finding an Egg

1. Click on a shared hunt link
2. Click anywhere on the map to make a guess
3. See your distance from the egg in miles
4. Keep guessing until you're within 100 meters
5. The egg will be revealed when you find it!

### Distance Feedback

The app provides visual feedback based on your distance:
- 🔥 **Very Hot** - Within 0.1 miles
- 🌡️ **Hot** - Within 1 mile
- 😊 **Warm** - Within 10 miles
- 🤔 **Cool** - Within 50 miles
- ❄️ **Cold** - Within 100 miles
- 🥶 **Freezing** - Over 100 miles

## Database Schema

```sql
CREATE TABLE eggs (
  id VARCHAR(21) PRIMARY KEY,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Routes

- `POST /api/eggs` - Create a new egg
  - Body: `{ latitude: number, longitude: number }`
  - Response: `{ id: string }`

- `GET /api/eggs/:eggId` - Get egg details
  - Response: `{ id: string, latitude: number, longitude: number }`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` - Your Mapbox token
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Set environment variables
- Run `npm run build`
- Start the server with `npm start`

## Mapbox Configuration

1. Sign up at [Mapbox](https://www.mapbox.com/)
2. Create an access token
3. Add it to your environment variables
4. The free tier includes 50,000 map loads/month (plenty for a hobby project!)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes directly
- `npm run db:studio` - Open Drizzle Studio

## Customization

### Change the Reveal Distance

Edit `src/app/hunt/[eggId]/page.tsx`:
```typescript
if (distanceMeters <= 100) { // Change 100 to your desired distance in meters
  setFound(true);
  setShowEgg(true);
}
```

### Change Distance Units

Edit `src/lib/distance.ts`:
```typescript
export function metersToMiles(meters: number): number {
  return meters * 0.000621371; // Change to kilometers: meters / 1000
}
```

### Update Colors

Modify the theme colors in:
- `tailwind.config.ts` - Tailwind configuration
- `src/app/globals.css` - Custom CSS

## License

MIT License - Feel free to use this for your own projects!

## Acknowledgments

- Inspired by [Cadbury Worldwide Hide](https://www.cadburyworldwidehide.co.uk/)
- Built with [Mapbox](https://www.mapbox.com/)
- Icons and emojis from [Lucide](https://lucide.dev/) and Unicode
