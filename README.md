# AI Journey 🚀

An interactive educational game that teaches AI concepts through exploration and hands-on activities across four unique regions.

## 🌟 Features

- **Interactive Learning**: Learn AI concepts through gameplay
- **Four Unique Regions**: 
  - 🏝️ Island - AI Basics & Bias
  - 🌴 Jungle - Data Collection & Cleaning
  - 🏜️ Desert - Data Labeling & Context
  - ❄️ Glacier - Privacy & Ethics
- **AI Integration**: Powered by Google Gemini API
- **Camera Features**: Real-world object recognition
- **Progress Tracking**: Save your journey in Explorer's Journal
- **Multi-language**: English & Chinese support

## 🛠️ Tech Stack

- **Frontend**: React 19.2.3
- **Build Tool**: Vite 5.4.2
- **AI API**: Google Gemini API
- **Storage**: localStorage (browser-based)
- **Styling**: Inline CSS with custom animations

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-journey.git
cd ai-journey
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
VITE_GEMINI_API_KEY=your_api_key_here
```

Get your API key from: https://ai.google.dev/

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
ai-journey/
├── public/              # Static assets (images, sounds, icons)
│   ├── background/      # Background images
│   ├── desert/          # Desert region assets
│   ├── glacier/         # Glacier region assets
│   ├── island/          # Island region assets
│   ├── jungle/          # Jungle region assets
│   ├── icon/            # UI icons
│   ├── npc/             # NPC characters
│   └── sound/           # Audio files
├── src/
│   ├── components/      # React components
│   │   ├── Homepage.jsx
│   │   ├── MapView.jsx
│   │   ├── IslandMap.jsx
│   │   ├── FungiJungleMap.jsx
│   │   ├── DataCollection.jsx
│   │   ├── DataCleaning.jsx
│   │   ├── DesertMap.jsx
│   │   ├── GlacierMap.jsx
│   │   ├── ExplorerJournal.jsx
│   │   └── ...
│   ├── contexts/        # React contexts
│   │   ├── AudioContext.jsx
│   │   └── LanguageContext.jsx
│   ├── hooks/           # Custom React hooks
│   ├── locales/         # i18n translations
│   ├── utils/           # Utility functions
│   ├── config/          # Configuration files
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore rules
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

## 🎮 How to Play

1. **Sign In**: Create an account or continue as guest
2. **Choose a Region**: Select from Island, Jungle, Desert, or Glacier
3. **Complete Missions**: Follow NPC guidance to learn AI concepts
4. **Collect Items**: Use camera features to capture real-world objects
5. **Track Progress**: View your journey in Explorer's Journal

## 🌐 Deployment

### Deploy to Alibaba Cloud

1. Build the project:
```bash
npm run build
```

2. Upload the `dist` folder to your Alibaba Cloud OSS or ECS

3. Configure your web server (Nginx example):
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔒 Security Notes

- Never commit `.env` file to version control
- Keep your Gemini API key secure
- Use environment variables for sensitive data
- Consider implementing rate limiting for API calls

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- React team for the amazing framework
- All contributors and testers

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

Made with ❤️ for AI education
