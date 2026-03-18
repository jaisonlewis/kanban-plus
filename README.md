# Kanban Board Plus

A beautiful, feature-rich personal Kanban board application with soft pastel colors, drag-and-drop functionality, and team collaboration features.

![Kanban Board](Screenshot%20from%202026-03-18%2008-48-59.png)

## Features

### Core Kanban Functionality
- **Three-column board**: To Do, In Progress, Done
- **Drag and drop**: Move tasks between columns and reorder within columns
- **Task cards**: Beautiful pastel-colored cards with customizable themes
- **Priority system**: Automatic priority calculation based on deadlines
  - Urgent (overdue or ≤2 days)
  - Approaching (3-7 days)
  - Active (8-14 days)
  - Later (>14 days)

### Task Management
- **Click-to-edit notes**: Click directly on notes in task modal to edit (no need for edit button)
- **Custom colors**: Choose custom colors for individual task cards
- **Project organization**: Link tasks to projects with custom colors and icons
- **Meeting details**: Add meeting links and passwords with quick copy buttons
- **Subtasks**: Mini kanban board within each task with drag-and-drop
- **Promote subtasks**: Convert subtasks to full tasks with inherited properties

![Task Details](Screenshot%20from%202026-03-18%2008-49-10.png)

### People & Collaboration
- **Contact management**: Create and manage team member contacts
- **Location & timezone**: Add location with autocomplete (200+ cities)
- **Automatic timezone detection**: Select a city and timezone auto-fills
- **Real-time timezone display**: See current time for each team member
- **Communication channels**: Store Slack, Matrix, Telegram handles
- **Assign people to tasks**: Add multiple team members to any task

![People Management](Screenshot%20from%202026-03-18%2008-49-22.png)

### Recurring Tasks
- **Weekly, biweekly, monthly**: Set tasks to recur automatically
- **Smart return**: Tasks return to "To Do" when completed
- **Flexible scheduling**: Choose specific days for recurring tasks

### Project Management
- **Custom project colors**: Assign unique colors to each project
- **Project icons**: Add icons that display on task card color bars
- **Project settings**: Manage all projects in one place
- **Task filtering**: See task count per project

![Project Manager](Screenshot%20from%202026-03-18%2008-49-35.png)

### Archive System
- **Auto-archive**: Tasks completed >7 days ago automatically archive
- **Archive browser**: View and restore archived tasks
- **Permanent deletion**: Remove archived tasks when no longer needed

### Data Persistence
- **Local storage**: All data saved automatically in browser
- **No backend required**: Fully client-side application
- **Export/import ready**: Data stored in structured JSON format

## Installation

### Download Node.js

Before installing the Kanban board, you need Node.js installed on your system:

- **Windows**: [Download Node.js for Windows](https://nodejs.org/en/download/)
- **macOS**: [Download Node.js for Mac](https://nodejs.org/en/download/)
- **Ubuntu/Linux**: 
  ```bash
  # Using Ubuntu/Debian package manager
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```
  Or download from: [Node.js Downloads](https://nodejs.org/en/download/)

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

### Quick Start

1. **Clone or download the repository**
   ```bash
   git clone <your-repo-url>
   cd kanban+
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - The app will be available at `http://localhost:5173` (or another port if 5173 is in use)
   - The terminal will show the exact URL

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## How to Use

### Creating Tasks

1. Click the **"+ Add"** button in any column (To Do, In Progress, Done)
2. Fill in task details:
   - **Task Title** (required)
   - **Due Date** (e.g., "Mar 25, 2026") - Priority auto-calculates from this
   - **Project** - Link to a project for color coding
   - **Card Color Theme** - Choose from 5 pastel themes
   - **Custom Color** - Optional hex color picker for unique colors
   - **Notes** - Add detailed task notes
   - **Meeting Details** - Add meeting links and passwords (optional)
   - **Recurring** - Set up recurring tasks (optional)
3. Click **"Create Task"**

### Editing Tasks

**Quick Edit (Notes):**
- Click on any task card to open the modal
- Click directly on the notes section to edit inline
- Save or cancel your changes

**Full Edit:**
- Open task modal
- Click the **Edit** button in the top-right
- Modify any task properties
- Click **"Save Changes"**

### Managing Subtasks

1. Open a task modal
2. Click **"+ Add Subtask"** in the subtasks section
3. Enter subtask name
4. Drag subtasks between To Do, In Progress, Done columns
5. **Promote to full task**: Click the arrow button on any subtask
   - Opens task form with inherited properties
   - Subtask name becomes task title
   - Inherits parent's colors, project, and due date

### Setting Up Projects

1. Click **"Projects"** button in the header
2. Enter project details:
   - **Project Name** (required)
   - **Icon** - Optional icon
   - **Color** - Choose a custom color
3. Click **"+ Add Project"**
4. Edit existing projects inline:
   - Change icon in the icon field
   - Change color with the color picker
   - Delete projects with the delete button

### Managing People

1. Click **"+ Add Person"** in a task modal
2. Create a new contact:
   - **Name** (required)
   - **Email**
   - **Communication**: Slack, Matrix, Telegram handles
   - **Location**: Type to search 200+ cities with autocomplete
   - **Timezone**: Auto-fills when you select a location
3. Click **"Add Person"**
4. Assign contacts to tasks from the contact picker

### Using the Archive

1. Click **"Archive"** button in the header
2. View all archived tasks (auto-archived after 7 days)
3. **Restore**: Click "Restore" to move task back to its original column
4. **Delete**: Permanently remove archived tasks

## Customization

### Color Themes
- **Sky Blue**: Cool, professional
- **Mint Green**: Fresh, energetic
- **Pink**: Creative, friendly
- **Violet**: Modern, elegant
- **Peach**: Warm, inviting

### Custom Colors
- Use the color picker in task form for any hex color
- Custom colors override project and theme colors
- Great for highlighting special tasks

### Project Colors & Icons
- Each project can have a unique color
- Add icons for visual identification
- Icons appear on task card color bars

## Technical Details

### Built With
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with custom properties

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Uses localStorage for data persistence

### Data Storage
All data is stored locally in your browser using `localStorage`:
- `kanban-tasks` - Task data
- `kanban-projects` - Project settings
- `kanban-contacts` - People/contacts
- `kanban-archived-tasks` - Archived tasks

## Screenshots

### Main Board View
![Main Board](Screenshot%20from%202026-03-18%2008-48-59.png)

### Task Details with Notes
![Task Modal](Screenshot%20from%202026-03-18%2008-49-10.png)

### People Management with Timezones
![People](Screenshot%20from%202026-03-18%2008-49-22.png)

### Project Manager
![Projects](Screenshot%20from%202026-03-18%2008-49-35.png)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the **GNU General Public License v3.0 or later (GPL-3.0-or-later)**.

This means:
- You can freely use, modify, and distribute this software
- You can use it for commercial purposes
- **Any modifications or derivative works MUST also be open source under GPL-3.0**
- You must include the original copyright and license notices
- You must state any changes you made to the original code

See the [LICENSE](LICENSE) file for the full license text.

**Why GPL-3.0?** This copyleft license ensures that improvements to this project remain open and available to everyone. If you build upon this work, you must share your improvements with the community.

## Tips & Tricks

- **Keyboard shortcuts**: Press `Escape` to close any modal
- **Quick notes**: Click directly on notes to edit without opening the full form
- **Timezone awareness**: Add locations to see team members' current times
- **Project icons**: Use icons that represent your project type
- **Priority management**: Set realistic due dates and let the system calculate priorities
- **Subtask promotion**: Use the arrow button to quickly convert subtasks into full tasks
- **Color coding**: Use custom colors to highlight urgent or special tasks

## Troubleshooting

**Port already in use?**
- Vite will automatically try the next available port
- Check the terminal output for the actual URL

**Data not persisting?**
- Ensure browser localStorage is enabled
- Check browser privacy settings
- Try a different browser

**Drag and drop not working?**
- Ensure JavaScript is enabled
- Try refreshing the page
- Check browser console for errors

---

Made with React + TypeScript + Vite
