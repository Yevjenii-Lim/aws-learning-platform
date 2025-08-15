# AWS Learning Platform

An interactive learning platform that helps users master AWS services through step-by-step visualizations and detailed console/CLI instructions.

## 🌟 Features

- **Interactive Tutorials**: Step-by-step guides for AWS services
- **Dual Instructions**: Both AWS Console and CLI command instructions
- **Progress Tracking**: Track your learning progress across tutorials
- **Visual Learning**: Beautiful UI with animations and visual feedback
- **Search & Filter**: Find tutorials by service or category
- **AWS Architecture Builder**: Drag-and-drop interface to visualize network structures
- **Pre-built Templates**: Start with common AWS architectures
- **Component Connections**: Link components to show relationships
- **Export Functionality**: Save your architectures as JSON
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd aws-learning-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Available Tutorials

### Networking
- **VPC (Virtual Private Cloud)**: Create your first VPC with public and private subnets

### Compute
- **EC2 (Elastic Compute Cloud)**: Launch and manage virtual servers

### Storage
- **S3 (Simple Storage Service)**: Create and configure S3 buckets

### Database
- **RDS (Relational Database Service)**: Set up managed databases

## 🏗️ Architecture Builder

### Available Components
- **VPC**: Virtual Private Cloud with configurable CIDR blocks
- **EC2**: Elastic Compute Cloud instances with different types
- **RDS**: Relational Database Service instances
- **S3**: Simple Storage Service buckets
- **ALB**: Application Load Balancer
- **Security Groups**: Network security configurations

### Pre-built Templates
- **Web Application**: Complete web app with load balancer, EC2 instances, and database
- **Data Pipeline**: Data processing pipeline with S3 buckets and EC2 processing server

### Features
- Drag and drop components onto the canvas
- Connect components to show network relationships
- Configure component properties in real-time
- Export architectures as JSON files
- Grid-based layout for precise positioning

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Code Highlighting**: React Syntax Highlighter

## 📁 Project Structure

```
aws-learning-platform/
├── app/                          # Next.js app directory
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   └── tutorial/                # Tutorial pages
│       └── [serviceId]/
│           └── [tutorialId]/
│               └── page.tsx
├── data/                        # Data files
│   └── aws-services.ts          # AWS services and tutorials data
├── public/                      # Static assets
└── package.json                 # Dependencies and scripts
```

## 🎯 How It Works

1. **Browse Services**: Start from the homepage to see all available AWS services
2. **Choose Tutorial**: Select a tutorial based on your learning goals
3. **Follow Steps**: Each tutorial breaks down into numbered steps
4. **Toggle Instructions**: Switch between Console and CLI instructions
5. **Track Progress**: Mark steps as complete and see your progress
6. **Learn Tips**: Get pro tips and best practices for each step

## 🔧 Customization

### Adding New Tutorials

1. Open `data/aws-services.ts`
2. Add a new tutorial to an existing service or create a new service
3. Follow the interface structure:

```typescript
{
  id: 'unique-tutorial-id',
  title: 'Tutorial Title',
  description: 'Brief description',
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  estimatedTime: '15 minutes',
  category: 'Networking',
  steps: [
    {
      id: 1,
      title: 'Step Title',
      description: 'Step description',
      consoleInstructions: ['Step 1', 'Step 2'],
      cliCommands: ['aws command'],
      tips: ['Tip 1', 'Tip 2']
    }
  ],
  prerequisites: ['Requirement 1'],
  learningObjectives: ['Objective 1', 'Objective 2']
}
```

### Styling

- Modify `app/globals.css` for global styles
- Update `tailwind.config.js` for theme customization
- Use the predefined CSS classes: `.aws-card`, `.aws-button`, etc.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- AWS for providing excellent documentation
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and users

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Happy Learning! ☁️** 