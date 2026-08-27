# WordPress Plugin – Gutenberg Block Bootstrap Carousel

A WordPress plugin that adds a responsive **Bootstrap Carousel Gutenberg Block**, allowing users to create customizable image sliders and carousels directly in the WordPress editor without custom coding.

## 🚀 Features

- Gutenberg block for Bootstrap Carousel
- Responsive carousel layout
- Multiple slides
- Image support
- Previous/Next navigation
- Carousel indicators
- Configurable slide settings
- Bootstrap-based styling
- Works directly inside the Gutenberg editor
- No custom coding required
- Lightweight and easy to integrate

## 📦 Installation

### From GitHub

Clone the repository into your WordPress plugins directory:

```bash
cd wp-content/plugins
git clone https://github.com/SEU-USUARIO/wordpress-plugin-gutenberg-block-bootstrap-carousel.git
```

Replace `SEU-USUARIO` with your GitHub username.

Then:

1. Access the WordPress administration panel.
2. Go to **Plugins → Installed Plugins**.
3. Find **WordPress Gutenberg Block Bootstrap Carousel**.
4. Click **Activate**.

### Manual Installation

1. Download the repository as a ZIP file.
2. Go to **WordPress → Plugins → Add New → Upload Plugin**.
3. Select the downloaded ZIP file.
4. Install the plugin.
5. Activate the plugin.

## 🧱 Gutenberg Block

After activating the plugin, open the Gutenberg editor and search for:

```text
Bootstrap Carousel
```

Add the block to your page or post and configure the carousel using the Gutenberg block settings.

## 🎨 Bootstrap

This plugin is designed to work with the **Bootstrap Carousel** component.

Depending on the implementation, Bootstrap CSS and JavaScript may need to be loaded by the theme or plugin.

Example Bootstrap Carousel structure:

```html
<div id="carouselExample" class="carousel slide">
    <div class="carousel-inner">
        <div class="carousel-item active">
            <img src="image-1.jpg" class="d-block w-100" alt="Slide 1">
        </div>

        <div class="carousel-item">
            <img src="image-2.jpg" class="d-block w-100" alt="Slide 2">
        </div>
    </div>

    <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
    </button>

    <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
    </button>
</div>
```

## 🛠️ Development

Clone the repository:

```bash
git clone https://github.com/SEU-USUARIO/wordpress-plugin-gutenberg-block-bootstrap-carousel.git
```

Enter the project directory:

```bash
cd wordpress-plugin-gutenberg-block-bootstrap-carousel
```

Install dependencies:

```bash
npm install
```

Build the Gutenberg block:

```bash
npm run build
```

For development:

```bash
npm run start
```

## 📁 Project Structure

```text
wordpress-plugin-gutenberg-block-bootstrap-carousel/
│
├── build/
├── src/
│   ├── block.json
│   ├── edit.js
│   ├── index.js
│   ├── save.js
│   └── style.scss
│
├── wordpress-plugin-gutenberg-block-bootstrap-carousel.php
├── package.json
├── package-lock.json
├── readme.txt
└── README.md
```

> The exact structure may change as the project evolves.

## ⚙️ Requirements

- WordPress 6.0+
- PHP 7.4+
- Gutenberg / WordPress Block Editor
- Node.js and npm for development
- Bootstrap 5.x

## 🌐 Browser Support

The plugin uses modern WordPress and Bootstrap functionality and is intended for current versions of:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

## 🔧 Customization

The carousel can be extended to support additional options, such as:

- Autoplay
- Slide interval
- Transition effects
- Indicators
- Navigation arrows
- Captions
- Custom CSS classes
- Responsive behavior
- Multiple carousel layouts

## 🐛 Bug Reports

If you find a bug, please open an issue on GitHub with:

- WordPress version
- PHP version
- Bootstrap version
- Browser
- Steps to reproduce the problem
- Screenshots, if applicable
- Relevant error messages

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/my-new-feature
```

3. Commit your changes.

```bash
git commit -m "Add new carousel feature"
```

4. Push the branch.

```bash
git push origin feature/my-new-feature
```

5. Open a Pull Request.

## 📄 License

This project is licensed under the **GPL-2.0-or-later** license, in accordance with WordPress plugin licensing practices.

See the `LICENSE` file for more information.

## 👨‍💻 Author

**Luiz Fernando Brogliatto Ferreira**

## ⭐ Support

If this project is useful to you, consider giving the repository a ⭐ on GitHub.

---

**WordPress Plugin · Gutenberg Block · Bootstrap · Carousel**
