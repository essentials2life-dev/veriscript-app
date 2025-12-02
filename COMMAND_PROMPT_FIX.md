# 💻 Command Prompt Issues - Complete Fix Guide

## ❌ **COMMON ISSUES**

1. Command Prompt won't open
2. Commands not recognized
3. Permission denied errors
4. Path not found errors
5. npm/node not found

---

## ✅ **SOLUTION 1: USE WINDOWS POWERSHELL (Recommended)**

### **Step 1: Open PowerShell**

**Method 1: Search**
1. Press `Win` key
2. Type: `powershell`
3. Right-click "Windows PowerShell"
4. Click "Run as administrator"

**Method 2: Quick Access**
1. Press `Win + X`
2. Click "Windows PowerShell (Admin)"

**Method 3: File Explorer**
1. Open File Explorer
2. Navigate to your folder
3. Hold `Shift` + Right-click in folder
4. Click "Open PowerShell window here"

### **Step 2: Verify Node.js**

```powershell
# Check Node.js
node --version
# Should show: v18.x.x or higher

# Check npm
npm --version
# Should show: 9.x.x or higher
```

### **Step 3: If Node.js Not Found**

```powershell
# Check if Node.js is installed
Get-Command node

# If error, Node.js is not in PATH
# Fix: Add to PATH manually
```

---

## ✅ **SOLUTION 2: USE GIT BASH (Easiest)**

### **Step 1: Install Git Bash**

1. Download Git: https://git-scm.com/download/win
2. Run installer
3. Use default settings
4. Click "Install"

### **Step 2: Open Git Bash**

**Method 1: Desktop**
1. Right-click on Desktop
2. Click "Git Bash Here"

**Method 2: Folder**
1. Navigate to your folder
2. Right-click inside folder
3. Click "Git Bash Here"

**Method 3: Start Menu**
1. Press `Win` key
2. Type: `git bash`
3. Click "Git Bash"

### **Step 3: Use Git Bash**

```bash
# All commands work the same
cd Documents
git clone https://github.com/essentials2life-dev/veriscript-app.git
cd veriscript-app/mobile-app
npm install -g firebase-tools
firebase login
```

---

## ✅ **SOLUTION 3: USE VS CODE TERMINAL (Best for Development)**

### **Step 1: Install VS Code**

1. Download: https://code.visualstudio.com/
2. Install with default settings

### **Step 2: Open VS Code**

1. Press `Win` key
2. Type: `visual studio code`
3. Press Enter

### **Step 3: Open Terminal in VS Code**

**Method 1: Menu**
1. Click "Terminal" in top menu
2. Click "New Terminal"

**Method 2: Keyboard**
1. Press `` Ctrl + ` `` (backtick key)

**Method 3: View Menu**
1. Click "View" → "Terminal"

### **Step 4: Choose Terminal Type**

1. Click dropdown in terminal (top-right)
2. Select:
   - **PowerShell** (Recommended)
   - **Git Bash** (If installed)
   - **Command Prompt** (If working)

### **Step 5: Navigate and Run Commands**

```bash
# Check current location
pwd

# Navigate to Documents
cd C:\Users\YourName\Documents

# Clone repository
git clone https://github.com/essentials2life-dev/veriscript-app.git

# Navigate to project
cd veriscript-app\mobile-app

# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login
```

---

## ✅ **SOLUTION 4: FIX COMMAND PROMPT**

### **Issue 1: Command Prompt Won't Open**

**Fix 1: Use Run Dialog**
```
1. Press Win + R
2. Type: cmd
3. Press Enter
```

**Fix 2: Use Task Manager**
```
1. Press Ctrl + Shift + Esc
2. Click "File" → "Run new task"
3. Type: cmd
4. Check "Create this task with administrative privileges"
5. Click OK
```

**Fix 3: Use File Explorer**
```
1. Open File Explorer
2. Navigate to: C:\Windows\System32
3. Find: cmd.exe
4. Right-click → "Run as administrator"
```

### **Issue 2: Commands Not Recognized**

**Error:**
```
'node' is not recognized as an internal or external command
```

**Fix: Add Node.js to PATH**

**Step 1: Find Node.js Installation**
```
Default locations:
C:\Program Files\nodejs
C:\Program Files (x86)\nodejs
```

**Step 2: Add to PATH**
1. Press `Win` key
2. Type: `environment variables`
3. Click "Edit the system environment variables"
4. Click "Environment Variables" button
5. Under "System variables", find "Path"
6. Click "Edit"
7. Click "New"
8. Add: `C:\Program Files\nodejs`
9. Click "OK" on all windows
10. **Restart Command Prompt**

**Step 3: Verify**
```cmd
node --version
npm --version
```

### **Issue 3: Permission Denied**

**Error:**
```
Access is denied
EPERM: operation not permitted
```

**Fix: Run as Administrator**
1. Close Command Prompt
2. Press `Win` key
3. Type: `cmd`
4. Right-click "Command Prompt"
5. Click "Run as administrator"

### **Issue 4: npm Not Found**

**Fix: Reinstall Node.js**
1. Uninstall Node.js:
   - Settings → Apps → Node.js → Uninstall
2. Download fresh: https://nodejs.org/
3. Install with default settings
4. Restart computer
5. Open new Command Prompt
6. Verify: `node --version`

---

## ✅ **SOLUTION 5: USE ONLINE ALTERNATIVE**

If nothing works, use online development:

### **Option 1: GitHub Codespaces**

1. Go to: https://github.com/essentials2life-dev/veriscript-app
2. Click green "Code" button
3. Click "Codespaces" tab
4. Click "Create codespace on main"
5. Wait for environment to load
6. Use terminal in browser

**Pros:**
- ✅ No local setup needed
- ✅ Works in browser
- ✅ All tools pre-installed

**Cons:**
- ❌ Requires internet
- ❌ Limited free hours

### **Option 2: Replit**

1. Go to: https://replit.com/
2. Sign up/Login
3. Click "Create Repl"
4. Import from GitHub
5. Use terminal in browser

### **Option 3: StackBlitz**

1. Go to: https://stackblitz.com/
2. Click "New Project"
3. Import from GitHub
4. Use terminal in browser

---

## 🎯 **RECOMMENDED SOLUTION FOR YOU**

### **Best Option: VS Code with Git Bash**

**Why?**
- ✅ Most reliable
- ✅ Professional tool
- ✅ Works on all systems
- ✅ Great for development
- ✅ Built-in terminal

**Setup (10 minutes):**

1. **Install VS Code:**
   - Download: https://code.visualstudio.com/
   - Install with defaults

2. **Install Git (includes Git Bash):**
   - Download: https://git-scm.com/download/win
   - Install with defaults

3. **Open VS Code:**
   - Press `Win` key
   - Type: `code`
   - Press Enter

4. **Open Terminal:**
   - Press `` Ctrl + ` ``
   - Select "Git Bash" from dropdown

5. **Start Working:**
   ```bash
   cd Documents
   git clone https://github.com/essentials2life-dev/veriscript-app.git
   cd veriscript-app/mobile-app
   npm install -g firebase-tools
   firebase login
   ```

---

## 📋 **STEP-BY-STEP: COMPLETE SETUP**

### **Step 1: Install Required Software**

**1.1 Install Node.js:**
```
1. Go to: https://nodejs.org/
2. Download LTS version (v18 or higher)
3. Run installer
4. Click "Next" → "Next" → "Install"
5. Wait for installation
6. Click "Finish"
```

**1.2 Install Git:**
```
1. Go to: https://git-scm.com/download/win
2. Download latest version
3. Run installer
4. Use default settings
5. Click "Next" → "Next" → "Install"
6. Click "Finish"
```

**1.3 Install VS Code:**
```
1. Go to: https://code.visualstudio.com/
2. Download for Windows
3. Run installer
4. Check "Add to PATH"
5. Click "Next" → "Install"
6. Click "Finish"
```

### **Step 2: Verify Installation**

**2.1 Open VS Code:**
```
1. Press Win key
2. Type: code
3. Press Enter
```

**2.2 Open Terminal:**
```
1. Press Ctrl + ` (backtick)
2. Or: View → Terminal
```

**2.3 Select Git Bash:**
```
1. Click dropdown in terminal (top-right)
2. Select "Git Bash"
```

**2.4 Verify Tools:**
```bash
# Check Node.js
node --version
# Should show: v18.x.x

# Check npm
npm --version
# Should show: 9.x.x

# Check Git
git --version
# Should show: git version 2.x.x
```

### **Step 3: Clone Repository**

```bash
# Navigate to Documents
cd ~/Documents

# Clone repository
git clone https://github.com/essentials2life-dev/veriscript-app.git

# Navigate to project
cd veriscript-app/mobile-app

# List files
ls -la
```

### **Step 4: Install Firebase CLI**

```bash
# Install Firebase tools
npm install -g firebase-tools

# Verify installation
firebase --version

# Login to Firebase
firebase login
```

### **Step 5: Continue with Setup**

Now follow the rest of the guide from `STEP_BY_STEP_GUIDE.md`

---

## 🐛 **TROUBLESHOOTING**

### **Issue: "npm command not found"**

**Solution:**
```bash
# Check if Node.js is installed
which node

# If not found, reinstall Node.js
# Download from: https://nodejs.org/

# After install, restart VS Code
# Open new terminal
```

### **Issue: "Permission denied"**

**Solution:**
```bash
# Don't use sudo on Windows
# Instead, run VS Code as administrator

# Close VS Code
# Right-click VS Code icon
# Click "Run as administrator"
```

### **Issue: "Git not found"**

**Solution:**
```bash
# Install Git
# Download from: https://git-scm.com/download/win

# After install, restart VS Code
# Select Git Bash in terminal dropdown
```

### **Issue: "Cannot find module"**

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install -g firebase-tools
```

### **Issue: "Terminal not opening in VS Code"**

**Solution:**
```
1. Close VS Code completely
2. Press Win + R
3. Type: %APPDATA%\Code
4. Delete "User" folder
5. Restart VS Code
6. Try opening terminal again
```

---

## 💡 **PRO TIPS**

### **Tip 1: Use VS Code for Everything**
```
- Open folders directly in VS Code
- Use integrated terminal
- Install extensions
- Use Git integration
```

### **Tip 2: Create Desktop Shortcut**
```
1. Right-click Desktop
2. New → Shortcut
3. Location: C:\Program Files\Git\git-bash.exe
4. Name: Git Bash
5. Click Finish
```

### **Tip 3: Set Default Terminal**
```
In VS Code:
1. Ctrl + Shift + P
2. Type: "Terminal: Select Default Profile"
3. Select "Git Bash"
```

### **Tip 4: Use Keyboard Shortcuts**
```
Ctrl + `          - Toggle terminal
Ctrl + Shift + `  - New terminal
Ctrl + Shift + 5  - Split terminal
```

---

## 📊 **COMPARISON: TERMINAL OPTIONS**

| Terminal | Pros | Cons | Recommended |
|----------|------|------|-------------|
| **Git Bash** | ✅ Unix commands<br>✅ Works everywhere<br>✅ Reliable | ❌ Separate install | ⭐⭐⭐⭐⭐ |
| **PowerShell** | ✅ Built-in<br>✅ Powerful<br>✅ Modern | ❌ Different syntax | ⭐⭐⭐⭐ |
| **Command Prompt** | ✅ Built-in<br>✅ Simple | ❌ Limited features<br>❌ Old | ⭐⭐ |
| **VS Code Terminal** | ✅ Integrated<br>✅ Multiple types<br>✅ Best for dev | ❌ Requires VS Code | ⭐⭐⭐⭐⭐ |

---

## ✅ **FINAL RECOMMENDATION**

### **For You Right Now:**

**Use VS Code with Git Bash**

**Setup Steps:**
1. Install Node.js (5 min)
2. Install Git (3 min)
3. Install VS Code (2 min)
4. Open VS Code terminal (1 min)
5. Select Git Bash (1 min)
6. Continue with project setup

**Total Time: 12 minutes**

**Why This Works:**
- ✅ Most reliable solution
- ✅ Professional development environment
- ✅ Works for all future projects
- ✅ Great learning tool
- ✅ Industry standard

---

## 📞 **STILL STUCK?**

### **Quick Fixes:**

**Option 1: Use PowerShell**
```
Win + X → Windows PowerShell (Admin)
```

**Option 2: Use Git Bash**
```
Right-click Desktop → Git Bash Here
```

**Option 3: Use VS Code**
```
Open VS Code → Ctrl + ` → Select Git Bash
```

### **Need More Help?**

**Video Tutorials:**
- VS Code Setup: https://code.visualstudio.com/docs/setup/windows
- Git Bash Setup: https://www.youtube.com/results?search_query=git+bash+windows+setup
- Node.js Setup: https://nodejs.org/en/download/

**Documentation:**
- VS Code: https://code.visualstudio.com/docs
- Git: https://git-scm.com/doc
- Node.js: https://nodejs.org/docs

---

<div align="center">

# **💻 COMMAND PROMPT FIXED!**

**Choose your solution:**

---

## **🥇 Best Solution: VS Code + Git Bash**

**Setup:**
1. Install Node.js
2. Install Git
3. Install VS Code
4. Use integrated terminal

**Time: 12 minutes**

---

## **🥈 Quick Solution: PowerShell**

**Setup:**
1. Win + X
2. Windows PowerShell (Admin)
3. Run commands

**Time: 1 minute**

---

## **🥉 Simple Solution: Git Bash**

**Setup:**
1. Install Git
2. Right-click → Git Bash Here
3. Run commands

**Time: 5 minutes**

---

## **My Recommendation:**

**Use VS Code with Git Bash!**

**Why?**
- ✅ Professional tool
- ✅ Best for development
- ✅ Works for all projects
- ✅ Industry standard
- ✅ Great learning

---

**Download VS Code:**
```
https://code.visualstudio.com/
```

**Download Git:**
```
https://git-scm.com/download/win
```

**Download Node.js:**
```
https://nodejs.org/
```

---

**Install all three and you're ready!** 🚀

</div>
