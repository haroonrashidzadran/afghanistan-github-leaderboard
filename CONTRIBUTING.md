# Contributing to Afghanistan GitHub Leaderboard

Thank you for your interest in contributing! This project aims to showcase Afghan developers on GitHub.

## How to Contribute

### 1. Fork the Repository

Click the "Fork" button at the top right of this page.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/afghanistan-github-leaderboard.git
cd afghanistan-github-leaderboard
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Make Changes

- **Add new locations** to search in `src/config/index.js`
- **Modify scoring weights** in `src/config/index.js`
- **Improve the README template** in `src/services/readme.js`
- **Fix bugs** in the source files

### 5. Test Your Changes

```bash
npm install
npm test  # Dry run without saving
```

### 6. Commit and Push

```bash
git add .
git commit -m "Add your descriptive commit message"
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

Go to your fork and click "New Pull Request".

## Contribution Ideas

- Add support for additional countries/regions
- Improve the scoring algorithm
- Add more statistics to the leaderboard
- Create a website to display the data
- Add localization support
- Improve error handling
- Add unit tests

## Code Style

- Use meaningful variable names
- Add comments for complex logic
- Follow existing project structure
- Use async/await for asynchronous operations
- Handle errors gracefully

## Questions?

Open an issue if you have questions or need help!
