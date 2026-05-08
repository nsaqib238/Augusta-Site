# Augusta Search Website

A modern, responsive business website for Augusta Search. Built with HTML, CSS, and JavaScript, this standalone website showcases our AI-powered RAG applications and custom solutions.

## Features

- **Fully Responsive**: Works on all devices (desktop, tablet, mobile)
- **Modern Design**: Clean, professional layout with smooth animations
- **Fast Loading**: Optimized performance with minimal dependencies
- **No Backend Required**: Static HTML files, ready to deploy anywhere
- **RAG Applications**: Integrated country-specific code and standards applications

## Sections

- **Hero Section**: Welcome banner with call-to-action
- **About Section**: Our mission and company values
- **Services Section**: 
  - RAG Application for Codes & Standards with country selection
  - Custom RAG Solutions with email contact
- **Contact Section**: Address, phone, and email information
- **Footer**: Copyright information

## Getting Started


cd /home/ragadmin/ragadmin/projects/officesitemain
git pull origin main
sudo cp -r /home/ragadmin/ragadmin/projects/officesitemain/* /var/www/augusta-search/
sudo chown -R www-data:www-data /var/www/augusta-search
sudo systemctl reload nginx



### View the Website

Simply open `index.html` in your web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

### File Structure

```
Website/
├── index.html          # Main HTML file
├── css/
│   ├── bootstrap.min.css  # Bootstrap framework
│   └── style.css          # Custom styles
├── js/
│   ├── jquery.min.js      # jQuery library
│   ├── bootstrap.min.js   # Bootstrap JavaScript
│   └── main.js            # Custom JavaScript
├── img/
│   └── no-image-400-320.png  # Placeholder images
└── README.md            # This file
```

## Customization

### Colors

Edit the color scheme in `css/style.css`:

- Primary Accent: `#F88C00` (Orange)
- Background: `#f8f9fa` (Light Gray)
- Text: `#333` (Dark Gray)

### Content

Edit the content directly in `index.html`:
- Section titles and descriptions
- Service boxes
- Portfolio items
- Contact information

### Images

Replace placeholder images in the `img/` folder with your own images.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Internet Explorer 11+

## License

This project is open source and available for personal and commercial use.

## Credits

- Design inspired by Corporate Plus WordPress Theme
- Icons from Font Awesome
- Framework: Bootstrap 3
- JavaScript Library: jQuery

## Support

For questions or issues, feel free to reach out or create an issue in the repository.

