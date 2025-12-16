# Portfolio Website - Rıza Erdi Karakuş

Modern, responsive portfolio website showcasing iOS development projects. All project data is loaded dynamically from JSON - no hardcoded content!

## 🎨 Design Features

- **Modern gradient colors** - Purple (#8B5CF6) and Blue (#3B82F6) theme
- **Fully responsive** - Mobile, tablet, and desktop optimized
- **Smooth animations** - Scroll effects, hover states, and transitions
- **Interactive modals** - Detailed project information
- **Mobile navigation** - Hamburger menu for smaller screens

## 🚀 Getting Started

1. Replace placeholder images with your actual app screenshots:
   - `localex-app.png` - LocaleX application screenshot
   - `donatbi-app.png` - DonatBi application screenshot
   - `aleefy-app.png` - Aleefy application screenshot
   - `sparrowai-app.png` - SparrowAI application screenshot
   - `quakesafe-app.png` - QuakeSafe application screenshot

2. Simply open `index.html` in any modern web browser

## 📁 File Structure

```
LocaleX-Web/
├── index.html          # Main HTML file
├── style.css           # All styles and responsive design
├── script.js           # Interactive features and animations
├── README.md           # This file
└── [app-images].png    # Your app screenshots (to be added)
```

## 🖼️ Image Requirements

For best results, use images with these specifications:
- **Format**: PNG or JPG
- **Recommended size**: 1200x800px or similar ratio
- **Featured project (LocaleX)**: Larger showcase image
- **Other projects**: Square or landscape orientation

### Quick Image Setup

1. Take screenshots of your apps
2. Rename them according to the filenames above
3. Place them in the same directory as `index.html`
4. Refresh the browser - images will appear automatically!

## 🎯 Features

### Hero Section
- Eye-catching introduction
- Statistics showcase (8+ apps, 100+ languages, 3+ years)
- Call-to-action buttons

### Projects Grid
- Featured project (LocaleX) with expanded details
- Additional projects (DonatBi, Aleefy, SparrowAI, QuakeSafe)
- Click on any project for detailed modal view

### About Section
- Professional experience
- Technical skills organized by category
- Education and languages

### Contact Section
- Email, GitHub, and LinkedIn links
- Hover effects for engagement

## 🛠️ Technologies Used

- Pure HTML5, CSS3, JavaScript
- No external dependencies
- Modern CSS Grid and Flexbox
- Intersection Observer API for scroll animations
- Smooth scrolling and transitions

## 📱 Mobile Responsive

The website automatically adapts to:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎨 Color Palette

```css
Primary Purple: #8B5CF6
Primary Blue: #3B82F6
Accent Pink: #EC4899
Dark Background: #0F172A
Dark Card: #1E293B
```

## ✨ Interactive Features

- **Smooth scrolling** navigation
- **Animated project cards** on scroll
- **Modal popups** with detailed project info
- **Mobile hamburger menu**
- **Ripple effects** on buttons
- **Parallax hero section**
- **Active navigation** highlighting

## 🔧 Customization

### Update Project Information

All project data is stored in `projects.json`. Simply edit this file to add, remove, or modify projects:

```json
{
  "projects": [
    {
      "id": "project-id",
      "title": "Project Name",
      "tagline": "Short description",
      "description": "Main description",
      "image": "images/image1.png",
      "featured": true,
      "tech": ["Tech1", "Tech2"],
      "fullDescription": { ... }
    }
  ]
}
```

No need to touch HTML or JavaScript - just update the JSON!

### Modify Colors

Update CSS variables in `style.css`:

```css
:root {
    --primary-purple: #8B5CF6;
    --primary-blue: #3B82F6;
    /* ... */
}
```

### Add New Projects

1. Add project card HTML in `index.html`
2. Add project data in `script.js`
3. Add project image file

## 📄 License

Personal portfolio website - Feel free to use as inspiration!

## 👤 Contact

- **Email**: karakusapp@gmail.com
- **GitHub**: [@karakuserdi](https://github.com/karakuserdi)
- **LinkedIn**: [rizaerdikarakus](https://linkedin.com/in/rizaerdikarakus)

---

Built with ❤️ by Rıza Erdi Karakuş
