# Bilmece Bulmaca - Historical Turkey Riddles

A bilingual (Turkish/English) web application featuring riddles about Turkey's historical places, cultural landmarks, and iconic locations.

## Features

- 🏛️ **Historical Place Riddles**: Interactive riddles about Turkey's rich history
- 🌍 **Bilingual Support**: Automatic language detection with manual override (Turkish/English)
- 🎯 **Smart Filtering**: Filter riddles by location and tags
- 🎲 **Random Quiz Generation**: Create custom quizzes with random riddles
- 📱 **Responsive Design**: Works seamlessly on all devices
- 💾 **Export Functionality**: Export quiz results as JSON files
- 🗄️ **Supabase Integration**: Real-time database with PostgreSQL

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Internationalization**: next-intl
- **Icons**: Lucide React
- **Deployment**: Ready for Vercel

## Database Schema

The `riddles` table contains:
- `id` (UUID): Unique identifier
- `question_text` (TEXT): The riddle question
- `question_answer` (TEXT): The correct answer
- `location` (TEXT): Geographic location
- `tags` (TEXT[]): Array of relevant tags
- `established_at` (TEXT): When the place was established
- `near_spots` (TEXT[]): Nearby places of interest
- `short_def` (TEXT): Short description
- `image` (TEXT): Image URL (optional)
- `created_at` (TIMESTAMP): Record creation time

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bilmece-bulmaca
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL commands from `database.sql` in your Supabase SQL editor
   - Copy your project URL and anon key

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features in Detail

### Language Support
- Automatic detection based on browser language
- Manual language switching between Turkish and English
- Localized content for all UI elements

### Quiz System
- Random selection of riddles
- Progress tracking
- Score calculation
- Detailed results with explanations

### Filtering System
- Filter by geographic location
- Filter by tags (historical period, type, etc.)
- Combine multiple filters

### Data Export
- Export quiz results as JSON
- Include questions, answers, and metadata

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Configure domain** (optional)
   - Add custom domain in Vercel settings

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Adding New Riddles

To add new riddles, insert data into the Supabase `riddles` table:

```sql
INSERT INTO public.riddles (question_text, question_answer, location, tags, established_at, near_spots, short_def) 
VALUES (
    'Your riddle question here',
    'Correct Answer',
    'Location Name',
    ARRAY['tag1', 'tag2', 'tag3'],
    'Establishment Date',
    ARRAY['nearby place 1', 'nearby place 2'],
    'Short description of the place'
);
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Locale-based routing
│   │   ├── page.tsx       # Home page
│   │   ├── riddles/       # Riddles browser
│   │   └── quiz/          # Interactive quiz
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── lib/
│   └── supabase.ts        # Supabase client
├── messages/              # Internationalization
│   ├── en.json           # English translations
│   └── tr.json           # Turkish translations
├── i18n.ts               # i18n configuration
└── middleware.ts         # Locale detection
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ for exploring Turkey's rich cultural heritage.
