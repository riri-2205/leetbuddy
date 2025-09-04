# LeetHint AI – Chrome Extension for AI-Powered LeetCode Hints

LeetHint AI is an intelligent Chrome Extension that provides AI-generated hints for LeetCode problems using Hugging Face's language models. Get personalized guidance without spoiling the solution!
<img width="300" height="168" alt="image" src="https://github.com/user-attachments/assets/268be600-8e04-476e-9363-54235fdc4c00" />
<img width="300" height="168" alt="image" src="https://github.com/user-attachments/assets/bebd6a24-46ae-4879-8cb5-c8a0b9504e76" />
<img width="300" height="168" alt="image" src="https://github.com/user-attachments/assets/f5c4e41c-253e-41c3-863a-821194410c4b" />
<img width="300" height="168" alt="image" src="https://github.com/user-attachments/assets/f5954175-6b03-4c56-b514-f78143c2705c" />

## ✨ Features

- **🤖 AI-Powered Hints**: Dynamic hint generation using Hugging Face's language models
- **🔄 Refresh for New Hints**: Generate multiple AI hints for different perspectives
- **🎯 Context-Aware**: Uses problem descriptions for more relevant hints
- **📚 Smart Fallback**: Falls back to curated hints if AI is unavailable
- **⚡ Easy Setup**: Simple token configuration in the popup
- **🔒 Secure Storage**: API tokens stored securely in Chrome's local storage

---

## 🚀 How It Works

LeetHint AI detects the current LeetCode problem and sends the problem title and description to Hugging Face's API to generate contextual hints. The AI focuses on algorithms, data structures, and problem-solving approaches without revealing the actual solution.

---

## 📋 Prerequisites

1. **Hugging Face Account**: Sign up at [huggingface.co](https://huggingface.co)
2. **API Token**: Get your free token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
   - Create a token with "Read" permissions
   - No special scopes needed for inference API

---

## 🛠️ Installation

1. **Clone or Download** this repository
2. **Open Chrome Extensions**: Go to `chrome://extensions`
3. **Enable Developer Mode** (toggle in top-right)
4. **Load Unpacked**: Click "Load unpacked" and select the project folder
5. **Configure Token**: Click the extension icon and enter your Hugging Face token
6. **Visit LeetCode**: Open any LeetCode problem – AI hints will appear automatically!

---

## ⚙️ Configuration

### Setting Up Your Hugging Face Token

1. Click the LeetHint AI extension icon
2. Enter your Hugging Face API token in the input field
3. Click "Save Token"
4. Toggle "Enable AI Hints" if not already enabled

### Token Requirements
- Must start with `hf_`
- Needs "Read" permissions
- Free tier provides sufficient usage for personal use

---

## 🎮 Usage

1. **Navigate** to any LeetCode problem page
2. **Wait** for the AI hint to appear (top-right corner)
3. **Refresh** hints by clicking the 🔄 button for new perspectives
4. **Toggle** hints on/off via the extension popup

### Hint Generation
- **Primary**: Uses Microsoft DialoGPT for conversational hints
- **Fallback**: Uses GPT-2 if primary model is loading
- **Static Backup**: 200+ curated hints for popular problems

---

## 🔧 Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Platform**: Chrome Extensions (Manifest V3)
- **AI Models**: Hugging Face Inference API
  - Microsoft DialoGPT-medium (primary)
  - GPT-2 (fallback)
- **Storage**: Chrome Local Storage API
- **Permissions**: Host permissions for Hugging Face API

---

## 📁 File Structure
```bash
leetbuddy/
├── manifest.json          # Extension configuration
├── popup.html             # Token configuration UI
├── popup.js              # Popup functionality
├── popup.css             # Popup styling
├── ai-service.js         # Hugging Face API integration
├── hints.js              # Hint generation logic
├── content.js            # Page injection script
├── styles.css            # Hint box styling
└── icon.png              # Extension icon
```

---

## 🔮 Advanced Features

### Multiple AI Models
The extension tries multiple models in sequence:
1. **DialoGPT-medium**: Conversational, context-aware hints
2. **GPT-2**: General language model fallback
3. **Static Hints**: 200+ curated problem-specific hints

### Smart Context Extraction
- Extracts problem descriptions from multiple LeetCode page formats
- Provides context to AI for more relevant hints
- Handles dynamic page loading and updates

### Error Handling
- Graceful fallback to static hints if AI fails
- Network error handling
- Token validation and user feedback

---

## 🚧 Coming Soon

- **🎯 Difficulty-based hints**: Adjust hint complexity based on problem difficulty
- **📊 Usage analytics**: Track hint effectiveness
- **🌐 Multi-platform support**: Support for more coding platforms
- **💬 Custom prompts**: User-defined hint generation prompts
- **⚡ Caching**: Cache hints for faster loading

---

## 🔒 Privacy & Security

- **Local Storage**: API tokens stored locally in Chrome
- **No Data Collection**: No user data sent to external servers except Hugging Face API
- **Secure Transmission**: All API calls use HTTPS
- **Token Encryption**: Consider using Chrome's storage encryption for sensitive data

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with various LeetCode problems
5. Submit a pull request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🆘 Troubleshooting

### Common Issues

**"Please configure your Hugging Face API token"**
- Ensure you've entered a valid token starting with `hf_`
- Check that the token has "Read" permissions

**"AI hint generation failed"**
- Check your internet connection
- Verify your token is still valid
- Extension will fall back to static hints automatically

**No hints appearing**
- Ensure hints are enabled in the extension popup
- Check that you're on a LeetCode problem page
- Wait a few seconds for page loading

**Rate Limiting**
- Hugging Face free tier has usage limits
- Consider upgrading to a paid plan for higher limits
- Static hints will still work if rate limited

---

## 🙏 Acknowledgments

- **Hugging Face** for providing accessible AI model APIs
- **LeetCode** for the awesome platform
- **Community** for feedback and suggestions

